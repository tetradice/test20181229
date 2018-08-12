'use strict';

import express = require('express');
import socketIO = require('socket.io');
import * as path from 'path';
import * as redis from 'redis';
import moment = require('moment');
import * as randomstring from 'randomstring';
import * as sakuraba from 'sakuraba';
import browserSync = require('browser-sync');
import connectBrowserSync = require('connect-browser-sync');
import { ServerSocket } from 'sakuraba/socket';
import * as utils from 'sakuraba/utils';

const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../index.html');
const MAIN_JS = path.join(__dirname, 'main.js');
const MAIN_JS_MAP = path.join(__dirname, 'main.js.map');
const browserSyncConfigurations = { "files": "dist/*.js" };
const server = express()
  .use(connectBrowserSync(browserSync(browserSyncConfigurations)))
  .set('views', __dirname + '/../')
  .set('view engine', 'ejs')
  .use(express.static('public'))
  .use(express.static('node_modules'))
  .get('/dist/main.js', (req, res) => res.sendFile(MAIN_JS) )
  .get('/dist/main.js.map', (req, res) => res.sendFile(MAIN_JS_MAP) )
  .get('/', (req, res) => res.sendFile(INDEX) )
  .get('/b/:boardId/:side', (req, res) => res.render('board', {boardId: req.params.boardId, side: req.params.side}) )
  .post('/boards.create', (req, res) => {
    // 新しい卓IDを生成
    let boardId = randomstring.generate({
        length: 10
      , readable: true
    });

    // 卓を追加
    let state = utils.createInitialState();
    RedisClient.HSET('boards', boardId, JSON.stringify(state.board));

    // 卓にアクセスするためのURLを生成
    let urlBase = req.protocol + '://' + req.hostname + ':' + PORT;
    let p1Url = `${urlBase}/b/${boardId}/p1`;
    let p2Url = `${urlBase}/b/${boardId}/p2`;
    let watchUrl = `${urlBase}/b/${boardId}/watch`;

    res.json({p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl});
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

/** Redis上に保存されたボードデータを取得 */
function getStoredBoard(boardId: string, callback: (board: state.Board) => void){
  // ボード情報を取得
  RedisClient.HGET('boards', boardId, (err, json) => {
    let boardData = JSON.parse(json) as state.Board;
    console.log('getStoredBoard: ', boardData);

    // コールバックを実行
    callback.call(undefined, boardData);
  });
}

/** Redisへボードデータを保存 */
function saveBoard(boardId: string, board: state.Board, callback: () => void){
  console.log('saveBoard: ', JSON.stringify(board));
  // ボード情報を保存
  RedisClient.HSET('boards', boardId, JSON.stringify(board), (err, success) => {
    // コールバックを実行
    callback.call(undefined);
  });
}

io.on('connection', (ioSocket) => {
  const socket = new ServerSocket(ioSocket);

  console.log(`Client connected - ${ioSocket.id}`);
  ioSocket.on('disconnect', () => console.log('Client disconnected'));
  
  // ボード情報のリクエスト
  socket.on('requestFirstBoard', (p) => {
    // ボード情報を取得
    getStoredBoard(p.boardId, (board) => {
      socket.emit('onFirstBoardReceived', {board});
    });
  });

  // ログ追加
  ioSocket.on('append_action_log', (data: sakuraba.SocketParam.appendActionLog) => {
    console.log('on append_action_log: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      // // ログをアップデートして保存
      // let rec = new sakuraba.LogRecord();
      // Object.assign(rec, data.log);
      // board.actionLog.push(rec);
      // saveBoard(data.boardId, board, () => {
      //   // イベントを他ユーザーに配信
      //   let param: sakuraba.SocketParam.bcAppendActionLog = {log: rec};
      //   ioSocket.broadcast.emit('bc_append_action_log', param);
      // });
    });
  });
  ioSocket.on('append_chat_log', (data: sakuraba.SocketParam.appendChatLog) => {
    console.log('on append_chat_log: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      // // ログをアップデートして保存
      // let rec = new sakuraba.LogRecord();
      // Object.assign(rec, data.log);
      // board.chatLog.push(rec);
      // saveBoard(data.boardId, board, () => {
      //   // イベントを他ユーザーに配信
      //   let param: sakuraba.SocketParam.bcAppendChatLog = {log: rec};
      //   ioSocket.broadcast.emit('bc_append_chat_log', param);
      // });
    });
  });


  // ボード状態の更新
  socket.on('updateBoard', (p: {boardId: string, side: PlayerSide, board: state.Board}) => {
    // ボード情報を取得
    getStoredBoard(p.boardId, (board) => {
      // 送信されたボード情報を上書き
      saveBoard(p.boardId, p.board, () => {
        // ボードが更新されたイベントを他ユーザーに配信
        socket.broadcastEmit('onBoardReceived', {board: p.board});
      });
    });
  });

  // 名前の入力
  ioSocket.on('player_name_input', (data: {boardId: string, side: PlayerSide, name: string}) => {
    console.log('on player_name_input: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      // 名前をアップデートして保存
      board.playerNames[data.side] = data.name;
      saveBoard(data.boardId, board, () => {
        // プレイヤー名が入力されたイベントを他ユーザーに配信
        ioSocket.broadcast.emit('on_player_name_input', board);
      });
    });
  });

  ioSocket.on('reset_board', (data: {boardId: string}) => {
    console.log('on reset_board: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      // 盤を初期状態に戻す
      let newBoard = utils.createInitialState().board;

      saveBoard(data.boardId, newBoard, () => {
        // ボードが更新されたイベントを他ユーザーに配信
        socket.broadcastEmit('onBoardReceived', {board: newBoard});
      });
    });
  });

  // メガミの選択
  ioSocket.on('megami_select', (data: {boardId: string, side: PlayerSide, megamis: sakuraba.Megami[]}) => {
    console.log('on megami_select: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      // メガミをアップデートして保存
      board.megamis[data.side] = data.megamis;
      saveBoard(data.boardId, board, () => {
        // メガミが選択されたイベントを他ユーザーに配信
        ioSocket.broadcast.emit('on_megami_select', board);
      });
    });
  });

  // デッキの構築
  ioSocket.on('deck_build', (data: {boardId: string, side: PlayerSide, addObjects: state.BoardObject[]}) => {
    console.log('on deck_build: ', data);

    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      board.objects = board.objects.concat(data.addObjects);
      saveBoard(data.boardId, board, () => {
        // デッキが構築されたイベントを他ユーザーに配信
        ioSocket.broadcast.emit('on_deck_build', board);
      });

      // let myBoardSide = board.getMySide(data.side);

      // let serialized = board.serialize();
      // serialized.p1Side.library = data.library;
      // serialized.p1Side.specials = data.specials;
      // board.deserialize(serialized);

      // saveBoard(data.boardId, board, () => {
      //   // デッキが構築されたイベントを他ユーザーに配信
      //   ioSocket.broadcast.emit('on_deck_build',  board);
      // });
    });
  });

  // ボードオブジェクトの状態を更新
  ioSocket.on('board_object_set', (data: {boardId: string, side: PlayerSide, objects: state.BoardObject[]}) => {
    console.log('on board_object_set: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      board.objects = data.objects;
      saveBoard(data.boardId, board, () => {
        // ボードオブジェクトの状態が更新されたイベントを他ユーザーに配信
        ioSocket.broadcast.emit('on_board_object_set', board);
      });
    });
  });
});
// setInterval(() => {
//   let count = RedisClient.INCR('counter', (error, n) => {
//     io.emit('time', n);
//   });
  
// }, 1000);