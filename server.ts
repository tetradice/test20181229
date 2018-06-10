'use strict';

import * as express from 'express';
import * as socketIO from 'socket.io';
import * as path from 'path';
import * as redis from 'redis';
import * as randomstring from 'randomstring';
import * as sakuraba from './src/sakuraba';

const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const MAIN_JS = path.join(__dirname, 'dist/main.js');
const MAIN_JS_MAP = path.join(__dirname, 'dist/main.js.map');

const server = express()
  .set('views', __dirname + '/')
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
    let board = new sakuraba.Board();
    RedisClient.HSET('boards', boardId, JSON.stringify(board.data));

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
function getStoredBoard(boardId: string, callback: (board: sakuraba.Board) => void){
  // ボード情報を取得
  RedisClient.HGET('boards', boardId, (err, json) => {
    let boardData = JSON.parse(json) as sakuraba.BoardData;
    let board = new sakuraba.Board(boardData);

    // コールバックを実行
    callback.call(undefined, board);
  });
}

/** Redisへボードデータを保存 */
function saveBoard(boardId: string, board: sakuraba.Board, callback: () => void){
  // ボード情報を保存
  RedisClient.HSET('boards', boardId, JSON.stringify(board.data), (err, success) => {
    // コールバックを実行
    callback.call(undefined);
  });
}

io.on('connection', (socket) => {
  console.log(`Client connected - ${socket.id}`);
  socket.on('disconnect', () => console.log('Client disconnected'));
  
  // ボード情報のリクエスト
  socket.on('request_first_board_to_server', (data) => {
    console.log('on request_first_board_to_server: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      console.log('emit send_first_board_to_client: ', socket.id, board.data);
      socket.emit('send_first_board_to_client', board.data);
    });
  });

  // 名前の入力
  socket.on('player_name_input', (data: {boardId: string, side: sakuraba.Side, name: string}) => {
    console.log('on player_name_input: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      // 名前をアップデートして保存
      board.getMySide(data.side).playerName = data.name;
      saveBoard(data.boardId, board, () => {
        // プレイヤー名が入力されたイベントを他ユーザーに配信
        socket.broadcast.emit('on_player_name_input', board.data);
      });
    });
  });


  // メガミの選択
  socket.on('megami_select', (data: {boardId: string, side: sakuraba.Side, megamis: sakuraba.Megami[]}) => {
    console.log('on megami_select: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      // メガミをアップデートして保存
      board.getMySide(data.side).megamis = data.megamis;
      saveBoard(data.boardId, board, () => {
        // メガミが選択されたイベントを他ユーザーに配信
        socket.broadcast.emit('on_megami_select', board.data);
      });
    });
  });

  // デッキの構築
  socket.on('deck_build', (data: {boardId: string, side: sakuraba.Side, library: sakuraba.Card[], specials: sakuraba.Card[]}) => {
    console.log('on deck_build: ', data);
    // ボード情報を取得
    getStoredBoard(data.boardId, (board) => {
      let myBoardSide = board.getMySide(data.side);

      // デッキをアップデートして保存
      myBoardSide.library = data.library;
      myBoardSide.specials = data.specials;
      saveBoard(data.boardId, board, () => {
        // デッキが構築されたイベントを他ユーザーに配信
        socket.broadcast.emit('on_deck_build',  board.data);
      });
    });
  });
});
// setInterval(() => {
//   let count = RedisClient.INCR('counter', (error, n) => {
//     io.emit('time', n);
//   });
  
// }, 1000);