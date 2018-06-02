'use strict';

import * as express from 'express';
import * as socketIO from 'socket.io';
import * as path from 'path';
import * as redis from 'redis';
import * as randomstring from 'randomstring';

const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use(express.static('public'))
  .get('/', (req, res) => res.sendFile(INDEX) )
  .post('/tables.create', (req, res) => {
    // 新しい卓IDを生成
    let tableId = randomstring.generate({
        length: 10
      , readable: true
    });

    // 卓を追加
    RedisClient.HSET('tables', tableId, JSON.stringify({created: new Date().toJSON()}));

    // 卓にアクセスするためのURLを生成
    let urlBase = req.protocol + '://' + req.hostname;
    let p1Url = `${urlBase}/t/${tableId}/p1`;
    let p2Url = `${urlBase}/t/${tableId}/p2`;
    let watchUrl = `${urlBase}/t/${tableId}/watch`;

    res.json({p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl});
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log(`Client connected - ${socket.id}`);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// setInterval(() => {
//   let count = RedisClient.INCR('counter', (error, n) => {
//     io.emit('time', n);
//   });
  
// }, 1000);