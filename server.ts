'use strict';

import * as express from 'express';
import * as socketIO from 'socket.io';
import * as path from 'path';
import * as redis from 'redis';
import * as randomstring from 'randomstring';
import * as sakuraba from './lib/sakuraba';

const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const MAIN_JS = path.join(__dirname, 'main.js');

const server = express()
  .set('views', __dirname + '/')
  .set('view engine', 'ejs')
  .use(express.static('public'))
  .use(express.static('node_modules'))
  .get('/main.js', (req, res) => res.sendFile(MAIN_JS) )
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

io.on('connection', (socket) => {
  console.log(`Client connected - ${socket.id}`);
  socket.on('disconnect', () => console.log('Client disconnected'));
  
  // ボード情報のリクエスト
  socket.on('request_first_board_to_server', (data) => {
    console.log('on request_first_board_to_server: ', data);
    // ボード情報を取得
    RedisClient.HGET('boards', data.boardId, (err, json) => {
      let boardData = JSON.parse(json) as sakuraba.BoardData;
      console.log('emit send_first_board_to_client: ', socket.id, boardData);
      socket.emit('send_first_board_to_client', boardData);
    });
  });

  // 名前の入力
  socket.on('player_name_input', (data) => {
    console.log('on player_name_input: ', data);
    // ボード情報を取得
    RedisClient.HGET('boards', data.boardId, (err, json) => {
      let boardData = JSON.parse(json) as sakuraba.BoardData;
      // 名前をアップデートして保存
      if(data.side === 'p1'){
        boardData.p1Side.playerName = data.name;
      } else if(data.side === 'p2'){
        boardData.p2Side.playerName = data.name;
      }
      RedisClient.HSET('boards', data.boardId, JSON.stringify(boardData));
    });
  });
  // ボード情報を受信
  socket.on('send_board_to_server', (data) => {
    // 
    console.log('on send_board_to_server: ', data);
    let boardData = {
      body: data.board,
      updated: new Date(),
      logs: [],
      p1Name: 'ポン',
      p2Name: 'ポン2'
    };
    console.log('send: ', boardData);
    RedisClient.HSET('boards', data.boardId, JSON.stringify(boardData), (error, n) => {
      socket.broadcast.emit('send_board_to_client', boardData);
    });
    
  });
});

// setInterval(() => {
//   let count = RedisClient.INCR('counter', (error, n) => {
//     io.emit('time', n);
//   });
  
// }, 1000);