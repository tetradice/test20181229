/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server.ts":
/*!*******************!*\
  !*** ./server.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(/*! express */ "express");
var socketIO = __webpack_require__(/*! socket.io */ "socket.io");
var path = __importStar(__webpack_require__(/*! path */ "path"));
var redis = __importStar(__webpack_require__(/*! redis */ "redis"));
var randomstring = __importStar(__webpack_require__(/*! randomstring */ "randomstring"));
var utils_1 = __webpack_require__(/*! ./src/sakuraba/utils */ "./src/sakuraba/utils/index.ts");
// import browserSync = require('browser-sync');
// import connectBrowserSync = require('connect-browser-sync');
var hyperapp_1 = __webpack_require__(/*! hyperapp */ "hyperapp");
var actions_1 = __webpack_require__(/*! ./src/sakuraba/actions */ "./src/sakuraba/actions/index.ts");
var RedisClient = redis.createClient(process.env.REDIS_URL);
var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, '../index.html');
var MAIN_JS = path.join(__dirname, 'main.js');
var MAIN_JS_MAP = path.join(__dirname, 'main.js.map');
console.log(MAIN_JS);
var browserSyncConfigurations = { "files": "dist/*.js" };
var server = express()
    // .use(connectBrowserSync(browserSync(browserSyncConfigurations)))
    .set('views', path.join(__dirname, '../'))
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
var appActions = hyperapp_1.app(utils_1.createInitialState(), actions_1.actions, view, null);
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
            // // ログをアップデートして保存
            // let rec = new sakuraba.LogRecord();
            // Object.assign(rec, data.log);
            // board.actionLog.push(rec);
            // saveBoard(data.boardId, board, () => {
            //   // イベントを他ユーザーに配信
            //   let param: sakuraba.SocketParam.bcAppendActionLog = {log: rec};
            //   socket.broadcast.emit('bc_append_action_log', param);
            // });
        });
    });
    socket.on('append_chat_log', function (data) {
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
            //   socket.broadcast.emit('bc_append_chat_log', param);
            // });
        });
    });
    // 名前の入力
    socket.on('player_name_input', function (data) {
        console.log('on player_name_input: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            // 名前をアップデートして保存
            board.playerNames[data.side] = data.name;
            saveBoard(data.boardId, board, function () {
                // プレイヤー名が入力されたイベントを他ユーザーに配信
                socket.broadcast.emit('on_player_name_input', board);
            });
        });
    });
    socket.on('reset_board', function (data) {
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
            board.megamis[data.side] = data.megamis;
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
            board.objects = board.objects.concat(data.addObjects);
            saveBoard(data.boardId, board, function () {
                // デッキが構築されたイベントを他ユーザーに配信
                socket.broadcast.emit('on_deck_build', board);
            });
            // let myBoardSide = board.getMySide(data.side);
            // let serialized = board.serialize();
            // serialized.p1Side.library = data.library;
            // serialized.p1Side.specials = data.specials;
            // board.deserialize(serialized);
            // saveBoard(data.boardId, board, () => {
            //   // デッキが構築されたイベントを他ユーザーに配信
            //   socket.broadcast.emit('on_deck_build',  board);
            // });
        });
    });
    // ボードオブジェクトの状態を更新
    socket.on('board_object_set', function (data) {
        console.log('on board_object_set: ', data);
        // ボード情報を取得
        getStoredBoard(data.boardId, function (board) {
            board.objects = data.objects;
            saveBoard(data.boardId, board, function () {
                // ボードオブジェクトの状態が更新されたイベントを他ユーザーに配信
                socket.broadcast.emit('on_board_object_set', board);
            });
        });
    });
});


/***/ }),

/***/ "./src/sakuraba.ts":
/*!*************************!*\
  !*** ./src/sakuraba.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MEGAMI_DATA = {
    'yurina': { name: 'ユリナ', symbol: '刀' },
    'saine': { name: 'サイネ', symbol: '薙刀' },
    'himika': { name: 'ヒミカ', symbol: '銃' },
    'tokoyo': { name: 'トコヨ', symbol: '扇' },
    'oboro': { name: 'オボロ', symbol: '忍' },
    'yukihi': { name: 'ユキヒ', symbol: '傘/簪' },
    'shinra': { name: 'シンラ', symbol: '書' },
    'hagane': { name: 'ハガネ', symbol: '槌' },
    'chikage': { name: 'チカゲ', symbol: '毒' },
    'kururu': { name: 'クルル', symbol: '絡繰' },
    'thallya': { name: 'サリヤ', symbol: '乗騎' },
    'raira': { name: 'ライラ', symbol: '爪' }
};
exports.CARD_DATA = {
    '01-yurina-o-n-1': { megami: 'yurina', name: '斬', ruby: 'ざん', baseType: 'normal', types: ['attack'], range: "3-4", damage: '3/1', text: '' },
    '01-yurina-o-n-2': { megami: 'yurina', name: '一閃', ruby: 'いっせん', baseType: 'normal', types: ['attack'], range: "3", damage: '2/2', text: '【常時】決死-あなたのライフが3以下ならば、この《攻撃》は+1/+0となる。' },
    '01-yurina-o-n-3': { megami: 'yurina', name: '柄打ち', ruby: 'つかうち', baseType: 'normal', types: ['attack'], range: "1-2", damage: '2/1', text: '【攻撃後】決死-あなたのライフが3以下ならば、このターンにあなたが次に行う《攻撃》は+1/+0となる。' },
    '01-yurina-o-n-4': { megami: 'yurina', name: '居合', ruby: 'いあい', baseType: 'normal', types: ['attack', 'fullpower'], range: "3-4", damage: '4/3', text: '' },
    '01-yurina-o-n-5': { megami: 'yurina', name: '足捌き', ruby: 'あしさばき', baseType: 'normal', types: ['action'], text: '現在の間合が4以上ならば、間合→ダスト：2' },
    '01-yurina-o-n-6': { megami: 'yurina', name: '圧気', ruby: 'あっき', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙\n【破棄時】攻撃『適正距離1-4、3/-』を行う。' },
    '01-yurina-o-n-7': { megami: 'yurina', name: '気炎万丈', ruby: 'きえんばんじょう', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '2', text: '【展開中】決死-あなたのライフが3以下ならば、あなたの他のメガミによる《攻撃》は+1/+1となるとともに超克を得る。' },
    '01-yurina-o-s-1': { megami: 'yurina', name: '月影落', ruby: 'つきかげおとし', baseType: 'special', cost: '7', types: ['attack'], range: '3-4', damage: '4/4', text: '' },
    '01-yurina-o-s-2': { megami: 'yurina', name: '浦波嵐', ruby: 'うらなみあらし', baseType: 'special', cost: '3', types: ['attack', 'reaction'], range: '0-10', damage: '2/-', text: '【攻撃後】対応した《攻撃》は-2/+0となる。' },
    '01-yurina-o-s-3': { megami: 'yurina', name: '浮舟宿', ruby: 'うきふねやどし', baseType: 'special', cost: '3', types: ['action'], text: 'ダスト→自オーラ：5 \n【再起】決死-あなたのライフが3以下である。' },
    '01-yurina-o-s-4': { megami: 'yurina', name: '天音揺波の底力', ruby: 'あまねゆりなのそこぢから', baseType: 'special', cost: '5', types: ['attack', 'fullpower'], range: '1-4', damage: '5/5', text: '【常時】決死-あなたのライフが3以下でないと、このカードは使用できない。' },
    '02-saine-o-n-1': { megami: 'saine', name: '八方振り', ruby: 'はっぽうぶり', baseType: 'normal', types: ['attack'], range: "4-5", damage: '2/1', text: '【攻撃後】八相-あなたのオーラが0ならば、攻撃『適正距離4-5、2/1』を行う。' },
    '02-saine-o-n-2': { megami: 'saine', name: '薙斬り', ruby: 'なぎぎり', baseType: 'normal', types: ['attack', 'reaction'], range: "4-5", damage: '3/1', text: '' },
    '02-saine-o-n-3': { megami: 'saine', name: '返し刃', ruby: 'かえしやいば', baseType: 'normal', types: ['attack'], range: "3-5", damage: '1/1', text: '【攻撃後】このカードを対応で使用したならば、攻撃『適正距離3-5、2/1、対応不可』を行う。' },
    '02-saine-o-n-4': { megami: 'saine', name: '見切り', ruby: 'みきり', baseType: 'normal', types: ['action'], text: '【常時】八相-あなたのオーラが0ならば、このカードを《対応》を持つかのように相手の《攻撃》に割り込んで使用できる。\n間合⇔ダスト：1' },
    '02-saine-o-n-5': { megami: 'saine', name: '圏域', ruby: 'けんいき', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開時】ダスト→間合：1\n【展開中】達人の間合は2大きくなる。' },
    '02-saine-o-n-6': { megami: 'saine', name: '衝音晶', ruby: 'しょうおんしょう', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '1', text: '【展開時】対応した《攻撃》は-1/+0となる。 \n【破棄時】攻撃『適正距離0-10、1/-、対応不可』を行う。' },
    '02-saine-o-n-7': { megami: 'saine', name: '無音壁', ruby: 'むおんへき', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '5', text: '【展開中】あなたへのダメージを解決するに際し、このカードの上に置かれた桜花結晶をあなたのオーラにあるかのように扱う。' },
    '02-saine-o-s-1': { megami: 'saine', name: '律動弧戟', ruby: 'りつどうこげき', baseType: 'special', cost: '5', types: ['action'], text: '攻撃『適正距離3-4、1/1』を行う。\n攻撃『適正距離4-5、1/1』を行う。\n攻撃『適正距離3-5、2/2』を行う。' },
    '02-saine-o-s-2': { megami: 'saine', name: '響鳴共振', ruby: 'きょうめいきょうしん', baseType: 'special', cost: '1', types: ['action'], text: '相手のオーラが5以上ならば、相オーラ→間合：3' },
    '02-saine-o-s-3': { megami: 'saine', name: '音無砕氷', ruby: 'おとなしさいひょう', baseType: 'special', cost: '1', types: ['action', 'reaction'], text: '対応した《攻撃》は-1/-1となる。\n【再起】八相-あなたのオーラが0である。' },
    '02-saine-o-s-4': { megami: 'saine', name: '氷雨細音の果ての果て', ruby: 'ひさめさいねのはてのはて', baseType: 'special', cost: '4', types: ['attack', 'reaction'], range: '1-5', damage: '5/5', text: '【常時】このカードは切札に対する対応でしか使用できない。' },
    '03-himika-o-n-1': { megami: 'himika', name: 'シュート', ruby: '', baseType: 'normal', types: ['attack'], range: "4-10", damage: '2/1', text: '' },
    '03-himika-o-n-2': { megami: 'himika', name: 'ラピッドファイア', ruby: '', baseType: 'normal', types: ['attack'], range: "7-8", damage: '2/1', text: '【常時】連火-このカードがこのターンに使用した3枚目以降のカードならば、この《攻撃》は+1/+1となる。' },
    '03-himika-o-n-3': { megami: 'himika', name: 'マグナムカノン', ruby: '', baseType: 'normal', types: ['attack'], range: "5-8", damage: '3/2', text: '【攻撃後】自ライフ→ダスト：1' },
    '03-himika-o-n-4': { megami: 'himika', name: 'フルバースト', ruby: '', baseType: 'normal', types: ['attack', 'fullpower'], range: "5-9", damage: '3/1', text: '【常時】この《攻撃》がダメージを与えるならば、相手は片方を選ぶのではなく両方のダメージを受ける。' },
    '03-himika-o-n-5': { megami: 'himika', name: 'バックステップ', ruby: '', baseType: 'normal', types: ['action'], text: 'カードを1枚引く。\nダスト→間合：1' },
    '03-himika-o-n-6': { megami: 'himika', name: 'バックドラフト', ruby: '', baseType: 'normal', types: ['action'], text: '相手を畏縮させる。\n連火-このカードがこのターンに使用した3枚目以降のカードならば、このターンにあなたが次に行う他のメガミによる《攻撃》を+1/+1する。' },
    '03-himika-o-n-7': { megami: 'himika', name: 'スモーク', ruby: '', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開中】カードの矢印(→)により間合にある桜花結晶は移動しない。' },
    '03-himika-o-s-1': { megami: 'himika', name: 'レッドバレット', ruby: '', baseType: 'special', cost: '0', types: ['attack'], range: '5-10', damage: '3/1', text: '' },
    '03-himika-o-s-2': { megami: 'himika', name: 'クリムゾンゼロ', ruby: '', baseType: 'special', cost: '5', types: ['attack'], range: '0-2', damage: '2/2', text: '【常時】この《攻撃》がダメージを与えるならば、相手は片方を選ぶのではなく両方のダメージを受ける。\n【常時】現在の間合が0ならば、この《攻撃》は対応不可を得る。' },
    '03-himika-o-s-3': { megami: 'himika', name: 'スカーレットイマジン', ruby: '', baseType: 'special', cost: '3', types: ['action'], text: 'カードを2枚引く。その後、あなたは手札を1枚伏せ札にする。' },
    '03-himika-o-s-4': { megami: 'himika', name: 'ヴァーミリオンフィールド', ruby: '', baseType: 'special', cost: '2', types: ['action'], text: '連火-このカードがこのターンに使用した3枚目以降のカードならば、ダスト→間合：2\n【再起】あなたの手札が0枚である。' }
    // , '99-xxx-o-n-1': {megami: 'xxx', name: '　', ruby: '　', baseType: 'normal', types: ['attack'], range: " ", damage: '-/-', text: ''}
    // , '99-xxx-o-s-1': {megami: 'xxx', name: '　', ruby: '　', baseType: 'special', cost: '5', types: ['attack'], range: ' ', damage: '-/-', text: ''}
};


/***/ }),

/***/ "./src/sakuraba/actions/board.ts":
/*!***************************************!*\
  !*** ./src/sakuraba/actions/board.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(__webpack_require__(/*! lodash */ "lodash"));
var models = __importStar(__webpack_require__(/*! ../models */ "./src/sakuraba/models/index.ts"));
var utils = __importStar(__webpack_require__(/*! ../utils */ "./src/sakuraba/utils/index.ts"));
var sakuraba_1 = __webpack_require__(/*! ../../sakuraba */ "./src/sakuraba.ts");
exports.default = {
    /** ボード全体を設定する */
    setBoard: function (newBoard) {
        return { board: newBoard };
    },
    /** ボード全体を初期化する */
    resetBoard: function () {
        return { board: utils.createInitialState().board };
    },
    /** 指定したサイドのプレイヤー名を設定する */
    setPlayerName: function (p) { return function (state) {
        var newBoard = _.merge({}, state.board);
        newBoard.playerNames[p.side] = p.name;
        return { board: newBoard };
    }; },
    /** 指定したサイドのメガミを設定する */
    setMegamis: function (p) { return function (state) {
        var newBoard = _.merge({}, state.board);
        newBoard.megamis[p.side] = [p.megami1, p.megami2];
        return { board: newBoard };
    }; },
    /** 集中力の値を変更 */
    setVigor: function (p) { return function (state) {
        var newBoard = models.Board.clone(state.board);
        newBoard.vigors[p.side] = p.value;
        return { board: newBoard };
    }; },
    /** デッキのカードを設定する */
    setDeckCards: function (p) { return function (state, actions) {
        p.cardIds.forEach(function (id) {
            var data = sakuraba_1.CARD_DATA[id];
            if (data.baseType === 'normal') {
                actions.addCard({ region: 'library', cardId: id });
            }
            if (data.baseType === 'special') {
                actions.addCard({ region: 'special', cardId: id });
            }
        });
    }; },
    /** ボードの状態を取得 */
    getState: function () { return function (state) { return state; }; }
};


/***/ }),

/***/ "./src/sakuraba/actions/card.ts":
/*!**************************************!*\
  !*** ./src/sakuraba/actions/card.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(__webpack_require__(/*! lodash */ "lodash"));
var models = __importStar(__webpack_require__(/*! ../models */ "./src/sakuraba/models/index.ts"));
var utils = __importStar(__webpack_require__(/*! ../utils */ "./src/sakuraba/utils/index.ts"));
exports.default = {
    /** カードを1枚追加する */
    addCard: function (p) { return function (state) {
        // 元の盤の状態をコピーして新しい盤を生成
        var newBoard = models.Board.clone(state.board);
        // 現在カード数 + 1で新しい連番を振る
        var cardCount = newBoard.objects.filter(function (obj) { return obj.type === 'card'; }).length;
        var objectId = "card-" + (cardCount + 1);
        var newCard = utils.createCard(objectId, p.cardId, p.region, 'p1');
        newBoard.objects.push(newCard);
        // 領域情報更新
        newBoard.updateRegionInfo();
        // 新しい盤を返す
        return { board: newBoard };
    }; },
    /** 指定領域のカードをクリアする */
    clearCards: function (p) { return function (state) {
        var newObjects = state.board.objects.filter(function (obj) { return (obj.type === 'card' && obj.region === p.region); });
        var newBoard = _.merge({}, state.board, { objects: newObjects });
        // 新しい盤を返す
        return { board: newBoard };
    }; },
    /**
     * カードを指定領域から別の領域に移動させる
     */
    moveCard: function (p) { return function (state) {
        // 元の盤の状態をコピーして新しい盤を生成
        var newBoard = models.Board.clone(state.board);
        // カードを指定枚数移動 (省略時は0枚)
        var fromIndex = (p.fromIndex === undefined ? 0 : p.fromIndex);
        var num = (p.moveNumber === undefined ? 1 : p.moveNumber);
        var fromRegionCards = newBoard.getRegionCards(p.fromSide, p.from).sort(function (a, b) { return a.indexOfRegion - b.indexOfRegion; });
        var toRegionCards = newBoard.getRegionCards(p.toSide, p.to).sort(function (a, b) { return a.indexOfRegion - b.indexOfRegion; });
        var indexes = toRegionCards.map(function (c) { return c.indexOfRegion; });
        var maxIndex = Math.max.apply(Math, indexes);
        var targetCards = fromRegionCards.slice(fromIndex, fromIndex + num);
        targetCards.forEach(function (c) {
            c.region = p.to;
            // 領域インデックスは最大値+1
            c.indexOfRegion = maxIndex + 1;
            maxIndex++;
        });
        // 領域情報の更新
        newBoard.updateRegionInfo();
        // 新しい盤を返す
        return { board: newBoard };
    }; },
    flipCard: function (objectId) { return function (state) {
        var ret = {};
        var newBoard = models.Board.clone(state.board);
        var card = newBoard.getCard(objectId);
        if (card.type !== null) {
            card.opened = !card.opened;
        }
        ret.board = newBoard;
        return ret;
    }; },
    shuffle: function (p) { return function (state) {
        var ret = {};
        var newBoard = models.Board.clone(state.board);
        // 山札のカードをすべて取得
        var cards = newBoard.getRegionCards(p.side, 'library');
        // ランダムに整列し、その順番をインデックスに再設定
        var shuffledCards = _.shuffle(cards);
        shuffledCards.forEach(function (c, i) {
            c.indexOfRegion = i;
        });
        // 新しいボードを返す
        return { board: newBoard };
    }; },
    /** 再構成 */
    reshuffle: function (p) { return function (state, actions) {
        // 使用済、伏せ札をすべて山札へ移動
        var newBoard = models.Board.clone(state.board);
        var usedCards = newBoard.getRegionCards(p.side, 'used');
        actions.moveCard({ from: 'used', fromSide: p.side, to: 'library', toSide: p.side, moveNumber: usedCards.length });
        newBoard = models.Board.clone(actions.getState().board);
        var hiddenUsedCards = newBoard.getRegionCards(p.side, 'hidden-used');
        actions.moveCard({ from: 'hidden-used', fromSide: p.side, to: 'library', toSide: p.side, moveNumber: hiddenUsedCards.length });
        // 山札を混ぜる
        actions.shuffle({ side: p.side });
    }; },
    /** ドラッグ開始 */
    cardDragStart: function (card) { return function (state) {
        var ret = {};
        // ドラッグを開始したカードを設定
        ret.draggingFromCard = card;
        return ret;
    }; },
    /** ドラッグ中にカード領域の上に移動 */
    cardDragEnter: function (region) { return function (state) {
        var ret = {};
        // 切札エリアからのドラッグや、切札エリアへのドラッグは禁止
        if (state.draggingFromCard.region === 'special' || region === 'special') {
            return null;
        }
        // ドラッグを開始したカードを設定
        ret.draggingHoverCardRegion = region;
        return ret;
    }; },
    /** ドラッグ中にカード領域の上から離れた */
    cardDragLeave: function () { return function (state) {
        var ret = {};
        // ドラッグ中領域の初期化
        ret.draggingHoverCardRegion = null;
        return ret;
    }; },
    /** ドラッグ終了 */
    cardDragEnd: function () {
        var ret = {};
        ret.draggingFromCard = null;
        ret.draggingHoverCardRegion = null;
        return ret;
    },
};


/***/ }),

/***/ "./src/sakuraba/actions/index.ts":
/*!***************************************!*\
  !*** ./src/sakuraba/actions/index.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = __importDefault(__webpack_require__(/*! ./log */ "./src/sakuraba/actions/log.ts"));
var card_1 = __importDefault(__webpack_require__(/*! ./card */ "./src/sakuraba/actions/card.ts"));
var board_1 = __importDefault(__webpack_require__(/*! ./board */ "./src/sakuraba/actions/board.ts"));
var sakuraToken_1 = __importDefault(__webpack_require__(/*! ./sakuraToken */ "./src/sakuraba/actions/sakuraToken.ts"));
var misc_1 = __importDefault(__webpack_require__(/*! ./misc */ "./src/sakuraba/actions/misc.ts"));
var actionsTemp = Object.assign(log_1.default, card_1.default, board_1.default, sakuraToken_1.default);
var actionsTemp2 = Object.assign(actionsTemp, misc_1.default);
exports.actions = actionsTemp2;


/***/ }),

/***/ "./src/sakuraba/actions/log.ts":
/*!*************************************!*\
  !*** ./src/sakuraba/actions/log.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment = __webpack_require__(/*! moment */ "moment");
var models = __importStar(__webpack_require__(/*! ../models */ "./src/sakuraba/models/index.ts"));
exports.default = {
    appendActionLog: function (p) { return function (state) {
        // 元の盤の状態をコピーして新しい盤を生成
        var newBoard = models.Board.clone(state.board);
        var append = { body: p.text, time: moment().format() };
        newBoard.actionLog.push(append);
        return { board: newBoard };
    }; }
};


/***/ }),

/***/ "./src/sakuraba/actions/misc.ts":
/*!**************************************!*\
  !*** ./src/sakuraba/actions/misc.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    /** ズーム倍率を変更する */
    setZoom: function (p) {
        return { zoom: p };
    },
};


/***/ }),

/***/ "./src/sakuraba/actions/sakuraToken.ts":
/*!*********************************************!*\
  !*** ./src/sakuraba/actions/sakuraToken.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(__webpack_require__(/*! lodash */ "lodash"));
var models = __importStar(__webpack_require__(/*! ../models */ "./src/sakuraba/models/index.ts"));
var utils = __importStar(__webpack_require__(/*! ../utils */ "./src/sakuraba/utils/index.ts"));
exports.default = {
    /** 桜花結晶を指定数追加する */
    addSakuraToken: function (p) { return function (state) {
        // 元の盤の状態をコピーして新しい盤を生成
        var newBoard = models.Board.clone(state.board);
        // 指定数分繰り返す
        _.times(p.number, function () {
            // 現在桜花結晶数 + 1で新しい連番を振る
            var tokenCount = newBoard.objects.filter(function (obj) { return obj.type === 'sakura-token'; }).length;
            var objectId = "sakuraToken-" + (tokenCount + 1);
            var newToken = utils.createSakuraToken(objectId, p.region, p.side);
            newBoard.objects.push(newToken);
        });
        // 領域情報更新
        newBoard.updateRegionInfo();
        // 新しい盤を返す
        return { board: newBoard };
    }; },
    /**
     * カードを指定領域から別の領域に移動させる
     */
    moveSakuraToken: function (p) { return function (state) {
        // 元の盤の状態をコピーして新しい盤を生成
        var newBoard = models.Board.clone(state.board);
        // 桜花結晶数を指定枚数移動 (省略時は0枚)
        var num = (p.moveNumber === undefined ? 1 : p.moveNumber);
        var fromRegionSakuraTokens = newBoard.getRegionSakuraTokens(p.fromSide, p.from).sort(function (a, b) { return a.indexOfRegion - b.indexOfRegion; });
        var toRegionSakuraTokens = newBoard.getRegionSakuraTokens(p.toSide, p.to).sort(function (a, b) { return a.indexOfRegion - b.indexOfRegion; });
        var indexes = toRegionSakuraTokens.map(function (c) { return c.indexOfRegion; });
        var maxIndex = Math.max.apply(Math, indexes);
        var targetSakuraTokens = fromRegionSakuraTokens.slice(0, num);
        targetSakuraTokens.forEach(function (c) {
            c.region = p.to;
            // 領域インデックスは最大値+1
            c.indexOfRegion = maxIndex + 1;
            maxIndex++;
        });
        // 領域情報の更新
        newBoard.updateRegionInfo();
        // 新しい盤を返す
        return { board: newBoard };
    }; },
    /** ドラッグ開始 */
    sakuraTokenDragStart: function (sakuraToken) { return function (state) {
        var ret = {};
        // ドラッグを開始したカードを設定
        ret.draggingFromSakuraToken = sakuraToken;
        return ret;
    }; },
    /** ドラッグ中にカード領域の上に移動 */
    sakuraTokenDragEnter: function (region) { return function (state) {
        var ret = {};
        // ドラッグを開始したカードを設定
        ret.draggingHoverSakuraTokenRegion = region;
        return ret;
    }; },
    /** ドラッグ中にカード領域の上から離れた */
    sakuraTokenDragLeave: function () { return function (state) {
        var ret = {};
        // ドラッグ中領域の初期化
        ret.draggingHoverSakuraTokenRegion = null;
        return ret;
    }; },
    /** ドラッグ終了 */
    sakuraTokenDragEnd: function () {
        var ret = {};
        ret.draggingFromSakuraToken = null;
        ret.draggingHoverSakuraTokenRegion = null;
        return ret;
    },
};


/***/ }),

/***/ "./src/sakuraba/models/Board.ts":
/*!**************************************!*\
  !*** ./src/sakuraba/models/Board.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(__webpack_require__(/*! lodash */ "lodash"));
var Board = /** @class */ (function () {
    function Board(original, deepCloning) {
        if (original !== undefined) {
            if (deepCloning === true) {
                _.merge(this, original);
            }
            else {
                _.extend(this, original);
            }
        }
    }
    Board.clone = function (original) {
        return new Board(original, true);
    };
    /** すべてのカードを取得 */
    Board.prototype.getCards = function () {
        return this.objects.filter(function (v) { return v.type === 'card'; });
    };
    /** 指定したIDのカードを取得 */
    Board.prototype.getCard = function (objectId) {
        return this.objects.find(function (v) { return v.type === 'card' && v.id === objectId; });
    };
    /** 指定した領域にあるカードを一括取得 */
    Board.prototype.getRegionCards = function (side, region) {
        return this.objects.filter(function (v) { return v.type === 'card' && v.side === side && v.region === region; });
    };
    /** すべての桜花結晶を取得 */
    Board.prototype.getSakuraTokens = function () {
        return this.objects.filter(function (v) { return v.type === 'sakura-token'; });
    };
    /** 指定したIDの桜花結晶を取得 */
    Board.prototype.getSakuraToken = function (objectId) {
        return this.objects.find(function (v) { return v.type === 'sakura-token' && v.id === objectId; });
    };
    /** 指定した領域にある桜花結晶を一括取得 */
    Board.prototype.getRegionSakuraTokens = function (side, region) {
        return this.objects.filter(function (v) { return v.type === 'sakura-token' && v.side === side && v.region == region; });
    };
    /** カード移動時などの領域情報一括更新 */
    Board.prototype.updateRegionInfo = function () {
        var _this = this;
        var cards = this.getCards();
        var sideAndRegions = _.uniq(cards.map(function (c) { return [c.side, c.region]; }));
        sideAndRegions.forEach(function (r) {
            var side = r[0], region = r[1];
            var regionCards = _this.getRegionCards(side, region).sort(function (a, b) { return a.indexOfRegion - b.indexOfRegion; });
            var index = 0;
            regionCards.forEach(function (c) {
                // インデックス更新
                c.indexOfRegion = index;
                index++;
                // 開閉状態更新
                c.opened = (region === 'used' || region === 'hand');
                // 回転状態更新
                c.rotated = (region === 'hidden-used');
                // known状態 (中身を知っているかどうか) 更新
                c.known.p1 = true;
                if (c.region === 'library')
                    c.known.p1 = false; // 山札の場合は分からない
            });
        });
    };
    return Board;
}());
exports.Board = Board;


/***/ }),

/***/ "./src/sakuraba/models/index.ts":
/*!**************************************!*\
  !*** ./src/sakuraba/models/index.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./Board */ "./src/sakuraba/models/Board.ts"));


/***/ }),

/***/ "./src/sakuraba/utils/index.ts":
/*!*************************************!*\
  !*** ./src/sakuraba/utils/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./state */ "./src/sakuraba/utils/state.ts"));
__export(__webpack_require__(/*! ./modal */ "./src/sakuraba/utils/modal.ts"));
__export(__webpack_require__(/*! ./misc */ "./src/sakuraba/utils/misc.ts"));


/***/ }),

/***/ "./src/sakuraba/utils/misc.ts":
/*!************************************!*\
  !*** ./src/sakuraba/utils/misc.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/** プレイヤーサイドを逆にする */
function flipSide(side) {
    if (side === 'p1')
        return 'p2';
    if (side === 'p2')
        return 'p1';
    return side;
}
exports.flipSide = flipSide;


/***/ }),

/***/ "./src/sakuraba/utils/modal.ts":
/*!*************************************!*\
  !*** ./src/sakuraba/utils/modal.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function confirmModal(desc, yesCallback) {
    $('#CONFIRM-MODAL .description').html(desc);
    $('#CONFIRM-MODAL')
        .modal({ closable: false, onApprove: yesCallback })
        .modal('show');
}
exports.confirmModal = confirmModal;


/***/ }),

/***/ "./src/sakuraba/utils/state.ts":
/*!*************************************!*\
  !*** ./src/sakuraba/utils/state.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/** 初期ステートを生成 */
function createInitialState() {
    var st = {
        stateDataVersion: 1,
        board: {
            objects: [],
            playerNames: { p1: null, p2: null },
            megamis: { p1: null, p2: null },
            vigors: { p1: 0, p2: 0 },
            witherFlags: { p1: false, p2: false },
            actionLog: [],
            chatLog: []
        },
        zoom: 1,
        draggingFromCard: null,
        draggingHoverCardRegion: null,
        draggingFromSakuraToken: null,
        draggingHoverSakuraTokenRegion: null
    };
    return st;
}
exports.createInitialState = createInitialState;
/** 指定した条件を満たすカード一覧を取得 */
function getCards(state, region) {
    var ret = [];
    state.board.objects.forEach(function (obj) {
        if (obj.type === 'card' && (region === undefined || obj.region === region)) {
            ret.push(obj);
        }
    });
    return ret;
}
exports.getCards = getCards;
/** カード1枚を作成 */
function createCard(id, cardId, region, side) {
    return {
        type: 'card',
        id: id,
        cardId: cardId,
        region: region,
        indexOfRegion: 0,
        rotated: false,
        opened: false,
        side: side,
        known: { p1: true, p2: true }
    };
}
exports.createCard = createCard;
/** 桜花結晶1つを作成 */
function createSakuraToken(id, region, side) {
    return {
        type: 'sakura-token',
        id: id,
        region: region,
        indexOfRegion: 0,
        side: side,
        onCardId: null
    };
}
exports.createSakuraToken = createSakuraToken;


/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "hyperapp":
/*!***************************!*\
  !*** external "hyperapp" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("hyperapp");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "randomstring":
/*!*******************************!*\
  !*** external "randomstring" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("randomstring");

/***/ }),

/***/ "redis":
/*!************************!*\
  !*** external "redis" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redis");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map