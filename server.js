'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var socketIO = require("socket.io");
var path = __importStar(require("path"));
var redis = __importStar(require("redis"));
var randomstring = __importStar(require("randomstring"));
var utils_1 = require("sakuraba/utils");
var browserSync = require("browser-sync");
var connectBrowserSync = require("connect-browser-sync");
var hyperapp_1 = require("hyperapp");
var mainApp = __importStar(require("sakuraba/app/main"));
var socket_1 = require("sakuraba/socket");
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
    var state = utils_1.createInitialState();
    RedisClient.HSET('boards', boardId, JSON.stringify(state.board));
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
        // コールバックを実行
        callback.call(undefined, boardData);
    });
}
/** Redisへボードデータを保存 */
function saveBoard(boardId, board, callback) {
    console.log('saveBoard: ', JSON.stringify(board));
    // ボード情報を保存
    RedisClient.HSET('boards', boardId, JSON.stringify(board), function (err, success) {
        // コールバックを実行
        callback.call(undefined);
    });
}
var view = function () { return hyperapp_1.h('div'); };
var appActions = mainApp.launch(utils_1.createInitialState(), null);
io.on('connection', function (ioSocket) {
    var socket = new socket_1.ServerSocket(ioSocket);
    console.log("Client connected - " + ioSocket.id);
    ioSocket.on('disconnect', function () { return console.log('Client disconnected'); });
    // ボード情報のリクエスト
    socket.on('requestFirstBoard', function (p) {
        // ボード情報を取得
        getStoredBoard(p.boardId, function (board) {
            socket.emit('onFirstBoardReceived', { board: board });
        });
    });
    // ログ追加
    ioSocket.on('append_action_log', function (data) {
        console.log('on append_action_log: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
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
    ioSocket.on('append_chat_log', function (data) {
        console.log('on append_chat_log: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
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
    socket.on('updateBoard', function (p) {
        // ボード情報を取得
        getStoredBoard(p.boardId, function (board) {
            // 送信されたボード情報を上書き
            saveBoard(p.boardId, p.board, function () {
                // ボードが更新されたイベントを他ユーザーに配信
                socket.broadcastEmit('onBoardReceived', { board: p.board });
            });
        });
    });
    // 名前の入力
    ioSocket.on('player_name_input', function (data) {
        console.log('on player_name_input: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            // 名前をアップデートして保存
            board.playerNames[data.side] = data.name;
            saveBoard(data.boardId, board, function () {
                // プレイヤー名が入力されたイベントを他ユーザーに配信
                ioSocket.broadcast.emit('on_player_name_input', board);
            });
        });
    });
    ioSocket.on('reset_board', function (data) {
        console.log('on reset_board: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            // 盤を初期状態に戻す
            appActions.setBoard(board);
            appActions.resetBoard();
            appActions.getState();
            var st = appActions.getState();
            saveBoard(data.boardId, st.board, function () {
                // プレイヤー名が入力されたイベントを他ユーザーに配信
                ioSocket.broadcast.emit('on_player_name_input', board);
            });
        });
    });
    // メガミの選択
    ioSocket.on('megami_select', function (data) {
        console.log('on megami_select: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            // メガミをアップデートして保存
            board.megamis[data.side] = data.megamis;
            saveBoard(data.boardId, board, function () {
                // メガミが選択されたイベントを他ユーザーに配信
                ioSocket.broadcast.emit('on_megami_select', board);
            });
        });
    });
    // デッキの構築
    ioSocket.on('deck_build', function (data) {
        console.log('on deck_build: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            board.objects = board.objects.concat(data.addObjects);
            saveBoard(data.boardId, board, function () {
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
    ioSocket.on('board_object_set', function (data) {
        console.log('on board_object_set: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            board.objects = data.objects;
            saveBoard(data.boardId, board, function () {
                // ボードオブジェクトの状態が更新されたイベントを他ユーザーに配信
                ioSocket.broadcast.emit('on_board_object_set', board);
            });
        });
    });
});
//# sourceMappingURL=server.js.map