'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const redis = require("redis");
const randomstring = require("randomstring");
const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const server = express()
    .use(express.static('public'))
    .get('/', (req, res) => res.sendFile(INDEX))
    .post('/tables.create', (req, res) => {
    // 新しい卓IDを生成
    let tableId = randomstring.generate({
        length: 10,
        readable: true
    });
    // 卓を追加
    RedisClient.HSET('tables', tableId, JSON.stringify({ created: new Date().toJSON() }));
    // 卓にアクセスするためのURLを生成
    let urlBase = req.protocol + '://' + req.hostname;
    let p1Url = `${urlBase}/t/${tableId}/p1`;
    let p2Url = `${urlBase}/t/${tableId}/p2`;
    let watchUrl = `${urlBase}/t/${tableId}/watch`;
    res.json({ p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl });
})
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server);
io.on('connection', (socket) => {
    console.log(`Client connected - ${socket.id}`);
    socket.on('disconnect', () => console.log('Client disconnected'));
});
