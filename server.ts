'use strict';

import * as express from 'express';
import * as socketIO from 'socket.io';
import * as path from 'path';
import * as redis from 'redis';

const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => {
  let count = RedisClient.INCR('counter', (error, n) => {
    io.emit('time', n);
  });
  
}, 1000);