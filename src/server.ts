'use strict';

import express = require('express');
import socketIO = require('socket.io');
import * as path from 'path';
import * as redis from 'redis';
import * as randomstring from 'randomstring';
import * as sakuraba from 'sakuraba';
import { ServerSocket } from 'sakuraba/socket';
import * as utils from 'sakuraba/utils';
import { EnvironmentPlugin } from 'webpack';

const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../index.html');
const MAIN_JS = path.join(__dirname, 'main.js');
const MAIN_JS_MAP = path.join(__dirname, 'main.js.map');
const browserSyncConfigurations = { "files": ["**/*.js"] };


let app = express();

if(process.env.ENVIRONMENT === 'development'){
  const browserSync = require('browser-sync');
  const connectBrowserSync = require('connect-browser-sync');
  app.use(connectBrowserSync(browserSync(browserSyncConfigurations)));
}

app
  .set('views', __dirname + '/../')
  .set('view engine', 'ejs')
  .use(express.static('public'))
  .use(express.static('node_modules'))
  .get('/dist/main.js', (req, res) => res.sendFile(MAIN_JS) )
  .get('/dist/main.js.map', (req, res) => res.sendFile(MAIN_JS_MAP) )
  .get('/', (req, res) => res.sendFile(INDEX) )

  .get('/play/:key', (req, res) => {
    // キーに対応する情報の取得を試みる
    RedisClient.HGET(`sakuraba:player-key-map`, req.params.key, (err, dataJson) => {
      if(dataJson !== null){
        let data = JSON.parse(dataJson);
        res.render('board', {tableId: data.tableId, side: data.side})
      } else {
        res.status(404);
        res.end('NotFound : ' + req.path);
      }
    });
  })
  .get('/watch/:tableId', (req, res) => {
    res.render('board', {tableId: req.params.tableId, side: 'watcher'})
  })

  .post('/tables.create', (req, res) => {
    // 新しい卓番号を採番
    RedisClient.INCR(`sakuraba:currentTableNo`, (err, newTableNo) => {
      // トランザクションを張る
      var multiClient = RedisClient.multi();

      // 卓を追加
      let state = utils.createInitialState();
      multiClient.SET(`sakuraba:tables:${newTableNo}:board`, JSON.stringify(state.board));

      // 卓へアクセスするための、プレイヤー1用アクセスキー、プレイヤー2用アクセスキーを生成
      let p1Key = randomstring.generate({
          length: 12
        , readable: true
      });
      let p2Key = randomstring.generate({
          length: 12
        , readable: true
      });

      multiClient.HSET(`sakuraba:player-key-map`, p1Key, JSON.stringify({tableId: newTableNo, side: 'p1'}));
      multiClient.HSET(`sakuraba:player-key-map`, p2Key, JSON.stringify({tableId: newTableNo, side: 'p2'}));

      multiClient.EXEC((err, replies) => {
        console.log(JSON.stringify(err));
        console.log(JSON.stringify(replies));

        // 卓にアクセスするためのURLを生成
        let urlBase: string;
        if(process.env.BASE_URL){
          urlBase = process.env.BASE_URL;
        } else {
          // for development
          urlBase = req.protocol + '://' + req.hostname + ':' + PORT;
        }
         
        let p1Url = `${urlBase}/play/${p1Key}`;
        let p2Url = `${urlBase}/play/${p2Key}`;
        let watchUrl = `${urlBase}/watch/${newTableNo}`;

        res.json({p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl});
      });
    });
  });


const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

/** Redis上に保存されたボードデータを取得 */
function getStoredBoard(tableId: string, callback: (board: state.Board) => void){
  // ボード情報を取得
  RedisClient.GET(`sakuraba:tables:${tableId}:board`, (err, json) => {
    let boardData = JSON.parse(json) as state.Board;

    // コールバックを実行
    callback(boardData);
  });
}

/** Redisへボードデータを保存 */
function saveBoard(tableId: string, board: state.Board, callback: () => void){
  // ボード情報を保存
  RedisClient.SET(`sakuraba:tables:${tableId}:board`, JSON.stringify(board), (err, success) => {
    // コールバックを実行
    callback();
  });
}

/** Redis上に保存されたアクションログを取得 */
function getStoredActionLogs(tableId: string, callback: (logs: state.LogRecord[]) => void){
  // ログを取得
  RedisClient.LRANGE(`sakuraba:tables:${tableId}:actionLogs`, 0, -1, (err, jsons) => {

    let logs = jsons.map((json) => JSON.parse(json) as state.LogRecord); 

    // コールバックを実行
    callback(logs);
  });
}

/** Redisへアクションログデータを追加 */
function appendActionLogs(tableId: string, logs: state.LogRecord[], callback: (logs: state.LogRecord[]) => void){
  // ログをトランザクションで追加
  let commands: string[][] = [];
  logs.forEach((log) => {
    commands.push(['RPUSH', `sakuraba:tables:${tableId}:actionLogs`, JSON.stringify(log)]);
  });
  RedisClient.multi(commands).exec((err, success) => {
    // コールバックを実行
    console.log('appendActionLogs response: ', success);
    callback(logs);
  });
}

io.on('connection', (ioSocket) => {
  const socket = new ServerSocket(ioSocket);

  console.log(`Client connected - ${ioSocket.id}`);
  ioSocket.on('disconnect', () => console.log('Client disconnected'));
  
  // ボード情報のリクエスト
  socket.on('requestFirstBoard', (p) => {
    // roomにjoin
    socket.ioSocket.join(p.tableId);

    // ボード情報を取得
    getStoredBoard(p.tableId, (board) => {
      socket.emit('onFirstBoardReceived', {board});
    });
  });

  // ボード状態の更新
  socket.on('updateBoard', (p) => {
    // ボード情報を取得
    getStoredBoard(p.tableId, (board) => {
      // 送信されたボード情報を上書き
      saveBoard(p.tableId, p.board, () => {
        // ボードが更新されたイベントを他ユーザーに配信
        socket.broadcastEmit(p.tableId, 'onBoardReceived', {board: p.board, appendedActionLogs: p.appendedActionLogs});
      });
    });
    // ログがあればサーバー側DBにログを追加
    if(p.appendedActionLogs !== null){
      appendActionLogs(p.tableId, p.appendedActionLogs, (logs) => {
        // 送信成功後は何もしない
      });
    }
  });

  // アクションログ情報のリクエスト
  socket.on('requestFirstActionLogs', (p) => {
    // アクションログ情報を取得
    getStoredActionLogs(p.tableId, (logs) => {
      socket.emit('onFirstActionLogsReceived', {logs: logs});
    });
  });

  
  // 通知送信
  socket.on('notify', (p) => {
      // ログが追加されたイベントを他ユーザーに配信
      socket.broadcastEmit(p.tableId, 'onNotifyReceived', {senderSide: p.senderSide, message: p.message});
  });

  // 名前の入力
  ioSocket.on('player_name_input', (data: {tableId: string, side: PlayerSide, name: string}) => {
    console.log('on player_name_input: ', data);
    // ボード情報を取得
    getStoredBoard(data.tableId, (board) => {
      // 名前をアップデートして保存
      board.playerNames[data.side] = data.name;
      saveBoard(data.tableId, board, () => {
        // プレイヤー名が入力されたイベントを他ユーザーに配信
        ioSocket.broadcast.emit('on_player_name_input', board);
      });
    });
  });
  
  // メガミの選択
  ioSocket.on('megami_select', (data: {tableId: string, side: PlayerSide, megamis: sakuraba.Megami[]}) => {
    console.log('on megami_select: ', data);
    // ボード情報を取得
    getStoredBoard(data.tableId, (board) => {
      // メガミをアップデートして保存
      board.megamis[data.side] = data.megamis;
      saveBoard(data.tableId, board, () => {
        // メガミが選択されたイベントを他ユーザーに配信
        ioSocket.broadcast.emit('on_megami_select', board);
      });
    });
  });

  // デッキの構築
  ioSocket.on('deck_build', (data: {tableId: string, side: PlayerSide, addObjects: state.BoardObject[]}) => {
    console.log('on deck_build: ', data);

    // ボード情報を取得
    getStoredBoard(data.tableId, (board) => {
      board.objects = board.objects.concat(data.addObjects);
      saveBoard(data.tableId, board, () => {
        // デッキが構築されたイベントを他ユーザーに配信
        ioSocket.broadcast.emit('on_deck_build', board);
      });
    });
  });

  // ボードオブジェクトの状態を更新
  ioSocket.on('board_object_set', (data: {tableId: string, side: PlayerSide, objects: state.BoardObject[]}) => {
    console.log('on board_object_set: ', data);
    // ボード情報を取得
    getStoredBoard(data.tableId, (board) => {
      board.objects = data.objects;
      saveBoard(data.tableId, board, () => {
        // ボードオブジェクトの状態が更新されたイベントを他ユーザーに配信
        ioSocket.broadcast.emit('on_board_object_set', board);
      });
    });
  });
});