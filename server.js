'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var socketIO = require("socket.io");
var path = require("path");
var redis = require("redis");
var randomstring = require("randomstring");
var sakuraba = require("./lib/sakuraba");
var RedisClient = redis.createClient(process.env.REDIS_URL);
var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, 'index.html');
var MAIN_JS = path.join(__dirname, 'dist/main.js');
var server = express()
    .set('views', __dirname + '/')
    .set('view engine', 'ejs')
    .use(express.static('public'))
    .use(express.static('node_modules'))
    .get('/dist/main.js', function (req, res) { return res.sendFile(MAIN_JS); })
    .get('/', function (req, res) { return res.sendFile(INDEX); })
    .get('/b/:boardId/:side', function (req, res) { return res.render('board', { boardId: req.params.boardId, side: req.params.side }); })
    .post('/boards.create', function (req, res) {
    // 新しい卓IDを生成
    var boardId = randomstring.generate({
        length: 10,
        readable: true
    });
    // 卓を追加
    var board = new sakuraba.Board();
    RedisClient.HSET('boards', boardId, JSON.stringify(board.data));
    // 卓にアクセスするためのURLを生成
    var urlBase = req.protocol + '://' + req.hostname + ':' + PORT;
    var p1Url = urlBase + "/b/" + boardId + "/p1";
    var p2Url = urlBase + "/b/" + boardId + "/p2";
    var watchUrl = urlBase + "/b/" + boardId + "/watch";
    res.json({ p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl });
})
    .listen(PORT, function () { return console.log("Listening on " + PORT); });
var io = socketIO(server);
io.on('connection', function (socket) {
    console.log("Client connected - " + socket.id);
    socket.on('disconnect', function () { return console.log('Client disconnected'); });
    // ボード情報のリクエスト
    socket.on('request_first_board_to_server', function (data) {
        console.log('on request_first_board_to_server: ', data);
        // ボード情報を取得
        RedisClient.HGET('boards', data.boardId, function (err, json) {
            var boardData = JSON.parse(json);
            console.log('emit send_first_board_to_client: ', socket.id, boardData);
            socket.emit('send_first_board_to_client', boardData);
        });
    });
    // 名前の入力
    socket.on('player_name_input', function (data) {
        console.log('on player_name_input: ', data);
        // ボード情報を取得
        RedisClient.HGET('boards', data.boardId, function (err, json) {
            var boardData = JSON.parse(json);
            // 名前をアップデートして保存
            if (data.side === 'p1') {
                boardData.p1Side.playerName = data.name;
            }
            else if (data.side === 'p2') {
                boardData.p2Side.playerName = data.name;
            }
            RedisClient.HSET('boards', data.boardId, JSON.stringify(boardData));
        });
    });
    // ボード情報を受信
    socket.on('send_board_to_server', function (data) {
        // 
        console.log('on send_board_to_server: ', data);
        var boardData = {
            body: data.board,
            updated: new Date(),
            logs: [],
            p1Name: 'ポン',
            p2Name: 'ポン2'
        };
        console.log('send: ', boardData);
        RedisClient.HSET('boards', data.boardId, JSON.stringify(boardData), function (error, n) {
            socket.broadcast.emit('send_board_to_client', boardData);
        });
    });
});
//# sourceMappingURL=server.js.map