'use strict';
exports.__esModule = true;
var express = require("express");
var socketIO = require("socket.io");
var path = require("path");
var redis = require("redis");
var randomstring = require("randomstring");
var sakuraba = require("./src/sakuraba");
var browserSync = require("browser-sync");
var connectBrowserSync = require("connect-browser-sync");
var RedisClient = redis.createClient(process.env.REDIS_URL);
var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, 'index.html');
var MAIN_JS = path.join(__dirname, 'dist/main.js');
var MAIN_JS_MAP = path.join(__dirname, 'dist/main.js.map');
var browserSyncConfigurations = { "files": "dist/*.js" };
var server = express()
    .use(connectBrowserSync(browserSync(browserSyncConfigurations)))
    .set('views', __dirname + '/')
    .set('view engine', 'ejs')
    .use(express.static('public'))
    .use(express.static('node_modules'))
    .get('/dist/main.js', function (req, res) { return res.sendFile(MAIN_JS); })
    .get('/dist/main.js.map', function (req, res) { return res.sendFile(MAIN_JS_MAP); })
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
    RedisClient.HSET('boards', boardId, JSON.stringify(board));
    // 卓にアクセスするためのURLを生成
    var urlBase = req.protocol + '://' + req.hostname + ':' + PORT;
    var p1Url = urlBase + "/b/" + boardId + "/p1";
    var p2Url = urlBase + "/b/" + boardId + "/p2";
    var watchUrl = urlBase + "/b/" + boardId + "/watch";
    res.json({ p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl });
})
    .listen(PORT, function () { return console.log("Listening on " + PORT); });
var io = socketIO(server);
/** Redis上に保存されたボードデータを取得 */
function getStoredBoard(boardId, callback) {
    // ボード情報を取得
    RedisClient.HGET('boards', boardId, function (err, json) {
        var boardData = JSON.parse(json);
        console.log('getStoredBoard: ', boardData);
        var board = new sakuraba.Board();
        board.deserialize(boardData);
        // コールバックを実行
        callback.call(undefined, board);
    });
}
/** Redisへボードデータを保存 */
function saveBoard(boardId, board, callback) {
    console.log('saveBoard: ', JSON.stringify(board.serialize()));
    // ボード情報を保存
    RedisClient.HSET('boards', boardId, JSON.stringify(board.serialize()), function (err, success) {
        // コールバックを実行
        callback.call(undefined);
    });
}
io.on('connection', function (socket) {
    console.log("Client connected - " + socket.id);
    socket.on('disconnect', function () { return console.log('Client disconnected'); });
    // ボード情報のリクエスト
    socket.on('request_first_board_to_server', function (data) {
        console.log('on request_first_board_to_server: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            console.log('emit send_first_board_to_client: ', socket.id, board);
            socket.emit('send_first_board_to_client', board);
        });
    });
    // ログ追加
    socket.on('append_action_log', function (data) {
        console.log('on append_action_log: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            // ログをアップデートして保存
            var rec = new sakuraba.LogRecord();
            Object.assign(rec, data.log);
            board.actionLog.push(rec);
            saveBoard(data.boardId, board, function () {
                // イベントを他ユーザーに配信
                var param = { log: rec };
                socket.broadcast.emit('bc_append_action_log', param);
            });
        });
    });
    socket.on('append_chat_log', function (data) {
        console.log('on append_chat_log: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            // ログをアップデートして保存
            var rec = new sakuraba.LogRecord();
            Object.assign(rec, data.log);
            board.chatLog.push(rec);
            saveBoard(data.boardId, board, function () {
                // イベントを他ユーザーに配信
                var param = { log: rec };
                socket.broadcast.emit('bc_append_chat_log', param);
            });
        });
    });
    // 名前の入力
    socket.on('player_name_input', function (data) {
        console.log('on player_name_input: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            // 名前をアップデートして保存
            board.getMySide(data.side).playerName = data.name;
            saveBoard(data.boardId, board, function () {
                // プレイヤー名が入力されたイベントを他ユーザーに配信
                socket.broadcast.emit('on_player_name_input', board);
            });
        });
    });
    // メガミの選択
    socket.on('megami_select', function (data) {
        console.log('on megami_select: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            // メガミをアップデートして保存
            board.getMySide(data.side).megamis = data.megamis;
            saveBoard(data.boardId, board, function () {
                // メガミが選択されたイベントを他ユーザーに配信
                socket.broadcast.emit('on_megami_select', board);
            });
        });
    });
    // デッキの構築
    socket.on('deck_build', function (data) {
        console.log('on deck_build: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            var myBoardSide = board.getMySide(data.side);
            var serialized = board.serialize();
            serialized.p1Side.library = data.library;
            serialized.p1Side.specials = data.specials;
            board.deserialize(serialized);
            saveBoard(data.boardId, board, function () {
                // デッキが構築されたイベントを他ユーザーに配信
                socket.broadcast.emit('on_deck_build', board);
            });
        });
    });
    // 初期手札を引く
    socket.on('hand_set', function (data) {
        console.log('on hand_set: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            var myBoardSide = board.getMySide(data.side);
            var serialized = board.serialize();
            serialized.p1Side.library = data.library;
            serialized.p1Side.hands = data.hands;
            board.deserialize(serialized);
            saveBoard(data.boardId, board, function () {
                // デッキが構築されたイベントを他ユーザーに配信
                socket.broadcast.emit('on_hand_set', board);
            });
        });
    });
});
