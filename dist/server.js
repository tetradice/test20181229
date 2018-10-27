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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/sakuraba.ts":
/*!*************************!*\
  !*** ./src/sakuraba.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// 領域ごとの桜花結晶最大数
exports.SAKURA_TOKEN_MAX = {
    aura: 5,
    life: 99,
    flair: 99,
    distance: 10,
    dust: 99,
    'on-card': 99,
    machine: 5,
    burned: 5
};
var MEGAMI_DATA_BASE = {
    'yurina': { name: 'ユリナ', symbol: '刀' },
    'yurina-a1': { name: '第一章ユリナ', symbol: '古刀', base: 'yurina', anotherID: 'A1' },
    'saine': { name: 'サイネ', symbol: '薙刀' },
    'saine-a1': { name: '第二章サイネ', symbol: '琵琶', base: 'saine', anotherID: 'A1' },
    'himika': { name: 'ヒミカ', symbol: '銃' },
    'himika-a1': { name: '原初ヒミカ', symbol: '炎', base: 'himika', anotherID: 'A1' },
    'tokoyo': { name: 'トコヨ', symbol: '扇' },
    'tokoyo-a1': { name: '旅芸人トコヨ', symbol: '笛', base: 'tokoyo', anotherID: 'A1' },
    'oboro': { name: 'オボロ', symbol: '忍' },
    'yukihi': { name: 'ユキヒ', symbol: '傘/簪' },
    'shinra': { name: 'シンラ', symbol: '書' },
    'hagane': { name: 'ハガネ', symbol: '槌' },
    'chikage': { name: 'チカゲ', symbol: '毒' },
    'kururu': { name: 'クルル', symbol: '絡繰' },
    'thallya': { name: 'サリヤ', symbol: '乗騎' },
    'raira': { name: 'ライラ', symbol: '爪' },
    'utsuro': { name: 'ウツロ', symbol: '鎌' }
};
exports.MEGAMI_DATA = MEGAMI_DATA_BASE;
exports.CARD_DATA = {
    '01-yurina-o-n-1': { megami: 'yurina', name: '斬', ruby: 'ざん', baseType: 'normal', types: ['attack'], range: "3-4", damage: '3/1', text: '' },
    '01-yurina-A1-n-1': { megami: 'yurina', anotherID: 'A1', replace: '01-yurina-o-n-1', name: '乱打', ruby: 'らんだ', baseType: 'normal', types: ['attack'], range: '2', damage: '2/1', text: '【常時】決死-あなたのライフが3以下ならば、この《攻撃》は+0/+2となり、対応不可を得る。' },
    '01-yurina-o-n-2': { megami: 'yurina', name: '一閃', ruby: 'いっせん', baseType: 'normal', types: ['attack'], range: "3", damage: '2/2', text: '【常時】決死-あなたのライフが3以下ならば、この《攻撃》は+1/+0となる。' },
    '01-yurina-o-n-3': { megami: 'yurina', name: '柄打ち', ruby: 'つかうち', baseType: 'normal', types: ['attack'], range: "1-2", damage: '2/1', text: '【攻撃後】決死-あなたのライフが3以下ならば、このターンにあなたが次に行う《攻撃》は+1/+0となる。' },
    '01-yurina-o-n-4': { megami: 'yurina', name: '居合', ruby: 'いあい', baseType: 'normal', types: ['attack', 'fullpower'], range: "2-4", damage: '4/3', text: '【常時】現在の間合が2以下ならば、この攻撃は-1/-1となる。' },
    '01-yurina-o-n-5': { megami: 'yurina', name: '足捌き', ruby: 'あしさばき', baseType: 'normal', types: ['action'], text: '現在の間合が4以上ならば、間合→ダスト：2\n現在の間合が1以下ならば、ダスト→間合：2' },
    '01-yurina-o-n-6': { megami: 'yurina', name: '圧気', ruby: 'あっき', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙\n【破棄時】攻撃『適正距離1-4、3/-』を行う。' },
    '01-yurina-A1-n-6': { megami: 'yurina', anotherID: 'A1', replace: '01-yurina-o-n-6', name: '癇癪玉', ruby: 'かんしゃくだま ', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '１', text: '【破棄時】攻撃『適正距離0-4、1/-、対応不可、【攻撃後】相手を畏縮させる』を行う。' },
    '01-yurina-o-n-7': { megami: 'yurina', name: '気炎万丈', ruby: 'きえんばんじょう', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '2', text: '【展開中】決死-あなたのライフが3以下ならば、あなたの他のメガミによる《攻撃》は+1/+1となるとともに超克を得る。' },
    '01-yurina-o-s-1': { megami: 'yurina', name: '月影落', ruby: 'つきかげおとし', baseType: 'special', cost: '7', types: ['attack'], range: '3-4', damage: '4/4', text: '' },
    '01-yurina-o-s-2': { megami: 'yurina', name: '浦波嵐', ruby: 'うらなみあらし', baseType: 'special', cost: '3', types: ['attack', 'reaction'], range: '0-10', damage: '2/-', text: '【攻撃後】対応した《攻撃》は-2/+0となる。' },
    '01-yurina-A1-s-2': { megami: 'yurina', anotherID: 'A1', replace: '01-yurina-o-s-2', name: '不完全浦波嵐', ruby: 'ふかんぜんうらなみあらし', baseType: 'special', types: ['attack', 'reaction'], range: '0-10', damage: '3/-', cost: '5', text: '【攻撃後】対応した《攻撃》は-3/+0となる。' },
    '01-yurina-o-s-3': { megami: 'yurina', name: '浮舟宿', ruby: 'うきふねやどし', baseType: 'special', cost: '2', types: ['action'], text: 'ダスト→自オーラ：5 \n----\n【即再起】決死-あなたのライフが3以下である。' },
    '01-yurina-o-s-4': { megami: 'yurina', name: '天音揺波の底力', ruby: 'あまねゆりなのそこぢから', baseType: 'special', cost: '5', types: ['attack', 'fullpower'], range: '1-4', damage: '5/5', text: '【常時】決死-あなたのライフが3以下でないと、このカードは使用できない。' },
    '02-saine-o-n-1': { megami: 'saine', name: '八方振り', ruby: 'はっぽうぶり', baseType: 'normal', types: ['attack'], range: "4-5", damage: '2/1', text: '【攻撃後】八相-あなたのオーラが0ならば、攻撃『適正距離4-5、2/1』を行う。' },
    '02-saine-o-n-2': { megami: 'saine', name: '薙斬り', ruby: 'なぎぎり', baseType: 'normal', types: ['attack', 'reaction'], range: "4-5", damage: '3/1', text: '' },
    '02-saine-o-n-3': { megami: 'saine', name: '返し刃', ruby: 'かえしやいば', baseType: 'normal', types: ['attack', 'reaction'], range: "3-5", damage: '1/1', text: '【攻撃後】このカードを対応で使用したならば、攻撃『適正距離3-5、2/1、対応不可』を行う。' },
    '02-saine-A1-n-3': { megami: 'saine', anotherID: 'A1', replace: '02-saine-o-n-3', name: '氷の音', ruby: 'ひのね', baseType: 'normal', types: ['action', 'reaction'], text: '相オーラ→ダスト：1 \nこのカードを対応で使用したならば、さらに\n相オーラ→ダスト：1' },
    '02-saine-o-n-4': { megami: 'saine', name: '見切り', ruby: 'みきり', baseType: 'normal', types: ['action'], text: '【常時】八相-あなたのオーラが0ならば、このカードを《対応》を持つかのように相手の《攻撃》に割り込んで使用できる。\n間合⇔ダスト：1' },
    '02-saine-o-n-5': { megami: 'saine', name: '圏域', ruby: 'けんいき', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開時】ダスト→間合：1\n【展開中】達人の間合は2大きくなる。' },
    '02-saine-o-n-6': { megami: 'saine', name: '衝音晶', ruby: 'しょうおんしょう', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '1', text: '【展開時】対応した《攻撃》は-1/+0となる。 \n【破棄時】攻撃『適正距離0-10、1/-、対応不可』を行う。' },
    '02-saine-A1-n-6': { megami: 'saine', anotherID: 'A1', replace: '02-saine-o-n-6', name: '伴奏', ruby: 'ばんそう', baseType: 'normal', types: ['enhance'], capacity: '4', text: '【展開中】あなたの他のメガミの切札が1枚以上使用済ならば、各ターンの最初の相手の《攻撃》は-1/+0となる。 \n【展開中】あなたのサイネの切札が1枚以上使用済ならば、各ターンにあなたが最初に使用する切札の消費は1少なくなる(0未満にはならない)。' },
    '02-saine-o-n-7': { megami: 'saine', name: '無音壁', ruby: 'むおんへき', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '5', text: '【展開中】あなたへのダメージを解決するに際し、このカードの上に置かれた桜花結晶をあなたのオーラにあるかのように扱う。' },
    '02-saine-o-s-1': { megami: 'saine', name: '律動弧戟', ruby: 'りつどうこげき', baseType: 'special', cost: '6', types: ['action'], text: '攻撃『適正距離3-4、1/1』を行う。\n攻撃『適正距離4-5、1/1』を行う。\n攻撃『適正距離3-5、2/2』を行う。' },
    '02-saine-o-s-2': { megami: 'saine', name: '響鳴共振', ruby: 'きょうめいきょうしん', baseType: 'special', cost: '8', types: ['action'], text: '【常時】このカードの消費は相手のオーラの数だけ少なくなる。\n相オーラ→間合：2' },
    '02-saine-A1-s-2': { megami: 'saine', anotherID: 'A1', replace: '02-saine-o-s-2', name: '二重奏:弾奏氷瞑', ruby: 'にじゅうそう:だんそうひょうめい', baseType: 'special', types: ['action'], cost: '2', text: '現在のフェイズを終了する。 \n【使用済】あなたの他のメガミによる《攻撃》は+0/+1となる。 \n----\n【即再起】あなたが再構成以外でライフに1以上のダメージを受ける。' },
    '02-saine-o-s-3': { megami: 'saine', name: '音無砕氷', ruby: 'おとなしさいひょう', baseType: 'special', cost: '2', types: ['attack', 'reaction'], range: "0-10", damage: '1/1', text: '対応した《攻撃》は-1/-1となる。\n----\n【再起】八相-あなたのオーラが0である。' },
    '02-saine-o-s-4': { megami: 'saine', name: '氷雨細音の果ての果て', ruby: 'ひさめさいねのはてのはて', baseType: 'special', cost: '5', types: ['attack', 'reaction'], range: '1-5', damage: '5/5', text: '【常時】このカードは切札に対する対応でしか使用できない。' },
    '03-himika-o-n-1': { megami: 'himika', name: 'シュート', ruby: '', baseType: 'normal', types: ['attack'], range: "4-10", damage: '2/1', text: '' },
    '03-himika-o-n-2': { megami: 'himika', name: 'ラピッドファイア', ruby: '', baseType: 'normal', types: ['attack'], range: "7-8", damage: '2/1', text: '【常時】連火-このカードがこのターンに使用した3枚目以降のカードならば、この《攻撃》は+1/+1となる。' },
    '03-himika-A1-n-2': { megami: 'himika', anotherID: 'A1', replace: '03-himika-o-n-2', name: '火炎流', ruby: 'かえんりゅう', baseType: 'normal', types: ['attack'], range: '1-3', damage: '2/1', text: '【常時】連火-このカードがこのターンに使用した3枚目以降のカードならば、この《攻撃》は+0/+1となる。' },
    '03-himika-o-n-3': { megami: 'himika', name: 'マグナムカノン', ruby: '', baseType: 'normal', types: ['attack'], range: "5-8", damage: '3/2', text: '【攻撃後】自ライフ→ダスト：1' },
    '03-himika-o-n-4': { megami: 'himika', name: 'フルバースト', ruby: '', baseType: 'normal', types: ['attack', 'fullpower'], range: "5-9", damage: '3/1', text: '【常時】この《攻撃》がダメージを与えるならば、相手は片方を選ぶのではなく両方のダメージを受ける。' },
    '03-himika-o-n-5': { megami: 'himika', name: 'バックステップ', ruby: '', baseType: 'normal', types: ['action'], text: 'カードを1枚引く。\nダスト→間合：1' },
    '03-himika-A1-n-5': { megami: 'himika', anotherID: 'A1', replace: '03-himika-o-n-5', name: '殺意', ruby: 'さつい', baseType: 'normal', types: ['action'], text: 'あなたの手札が0枚ならば、相オーラ→ダスト：2' },
    '03-himika-o-n-6': { megami: 'himika', name: 'バックドラフト', ruby: '', baseType: 'normal', types: ['action'], text: '相手を畏縮させる。\n連火-このカードがこのターンに使用した3枚目以降のカードならば、このターンにあなたが次に行う他のメガミによる《攻撃》を+1/+1する。' },
    '03-himika-o-n-7': { megami: 'himika', name: 'スモーク', ruby: '', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開中】カードの矢印(→)により間合にある桜花結晶は移動しない。' },
    '03-himika-o-s-1': { megami: 'himika', name: 'レッドバレット', ruby: '', baseType: 'special', cost: '0', types: ['attack'], range: '5-10', damage: '3/1', text: '' },
    '03-himika-o-s-2': { megami: 'himika', name: 'クリムゾンゼロ', ruby: '', baseType: 'special', cost: '5', types: ['attack'], range: '0-2', damage: '2/2', text: '【常時】この《攻撃》がダメージを与えるならば、相手は片方を選ぶのではなく両方のダメージを受ける。\n【常時】現在の間合が0ならば、この《攻撃》は対応不可を得る。' },
    '03-himika-A1-s-2': { megami: 'himika', anotherID: 'A1', replace: '03-himika-o-s-2', name: '炎天・紅緋弥香', ruby: 'えんてん・くれないひみか', baseType: 'special', types: ['attack', 'fullpower'], range: '0-6', damage: 'X/X', cost: '7', text: '対応不可 \n【常時】Xは7から現在の間合を引いた値に等しい。 \n【攻撃後】あなたは敗北する。' },
    '03-himika-o-s-3': { megami: 'himika', name: 'スカーレットイマジン', ruby: '', baseType: 'special', cost: '3', types: ['action'], text: 'カードを2枚引く。その後、あなたは手札を1枚伏せ札にする。' },
    '03-himika-o-s-4': { megami: 'himika', name: 'ヴァーミリオンフィールド', ruby: '', baseType: 'special', cost: '2', types: ['action'], text: '連火-このカードがこのターンに使用した3枚目以降のカードならば、ダスト→間合：2\n----\n【再起】あなたの手札が0枚である。' },
    '04-tokoyo-o-n-1': { megami: 'tokoyo', name: '梳流し', ruby: 'すきながし', baseType: 'normal', types: ['attack'], range: '4', damage: '-/1', text: '【攻撃後】境地-あなたの集中力が2ならば、このカードを山札の上に戻す。' },
    '04-tokoyo-A1-n-1': { megami: 'tokoyo', anotherID: 'A1', replace: '04-tokoyo-o-n-1', name: '奏流し', ruby: 'かなでながし', baseType: 'normal', types: ['attack'], range: '5', damage: '-/1', text: '【常時】あなたのトコヨの切札が1枚以上使用済ならば、この《攻撃》は対応不可を得る。 \n【攻撃後】境地-あなたの集中力が2かつ、あなたの他のメガミの切札が1枚以上使用済ならば、このカードを山札の上に置く。' },
    '04-tokoyo-o-n-2': { megami: 'tokoyo', name: '雅打ち', ruby: 'みやびうち', baseType: 'normal', types: ['attack'], range: '2-4', damage: '2/1', text: '【攻撃後】境地-あなたの集中力が2ならば、対応した切札でない《攻撃》を打ち消す。' },
    '04-tokoyo-o-n-3': { megami: 'tokoyo', name: '跳ね兎', ruby: 'はねうさぎ', baseType: 'normal', types: ['action'], text: '現在の間合が3以下ならば、ダスト→間合：2' },
    '04-tokoyo-o-n-4': { megami: 'tokoyo', name: '詩舞', ruby: 'しぶ', baseType: 'normal', types: ['action', 'reaction'], text: '集中力を1得て、以下から1つを選ぶ。\n・自フレア→自オーラ：1\n・自オーラ→間合：1' },
    '04-tokoyo-o-n-5': { megami: 'tokoyo', name: '要返し', ruby: 'かなめがえし', baseType: 'normal', types: ['action', 'fullpower'], text: '捨て札か伏せ札からカードを2枚まで選ぶ。それらのカードを好きな順で山札の底に置く。 \nダスト→自オーラ：2' },
    '04-tokoyo-o-n-6': { megami: 'tokoyo', name: '風舞台', ruby: 'かぜぶたい', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時】間合→自オーラ：2 \n【破棄時】自オーラ→間合：2' },
    '04-tokoyo-o-n-7': { megami: 'tokoyo', name: '晴舞台', ruby: 'はれぶたい', baseType: 'normal', types: ['enhance'], capacity: '1', text: '【破棄時】境地-あなたの集中力が2ならば、ダスト→自オーラ：2 \n【破棄時】境地-あなたは集中力を1得る。' },
    '04-tokoyo-A1-n-7': { megami: 'tokoyo', anotherID: 'A1', replace: '04-tokoyo-o-n-7', name: '陽の音', ruby: 'ひのね', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時/展開中】展開時、およびあなたが《対応》カードを使用した時、その解決後にダスト→自オーラ：1 \n【展開中】相手のターンにこのカードの上の桜花結晶は移動しない。' },
    '04-tokoyo-o-s-1': { megami: 'tokoyo', name: '久遠ノ花', ruby: 'くおんのはな', baseType: 'special', types: ['attack'], range: '0-10', damage: '-/1', cost: '5', text: '【攻撃後】対応した《攻撃》を打ち消す。' },
    '04-tokoyo-o-s-2': { megami: 'tokoyo', name: '千歳ノ鳥', ruby: 'ちとせのとり', baseType: 'special', types: ['attack'], range: '3-4', damage: '2/2', cost: '2', text: '【攻撃後】山札を再構成する。 \n(その際にダメージは受けない)' },
    '04-tokoyo-A1-s-2': { megami: 'tokoyo', anotherID: 'A1', replace: '04-tokoyo-o-s-2', name: '二重奏:吹弾陽明', ruby: 'にじゅうそう：すいだんようめい', baseType: 'special', types: ['action'], cost: '1', text: '【使用済】あなたの開始フェイズの開始時に捨て札または伏せ札からカード1枚を選び、それを山札の底に置いてもよい。 \n----\n【即再起】あなたが再構成以外でライフに1以上のダメージを受ける。' },
    '04-tokoyo-o-s-3': { megami: 'tokoyo', name: '無窮ノ風', ruby: 'むきゅうのかぜ', baseType: 'special', types: ['attack'], range: '3-8', damage: '1/1', cost: '1', text: '対応不可 \n【攻撃後】相手は手札から《攻撃》でないカード1枚を捨て札にする。それが行えない場合、相手は手札を公開する。 \n----\n【再起】境地-あなたの集中力が2である。' },
    '04-tokoyo-o-s-4': { megami: 'tokoyo', name: '常世ノ月', ruby: 'とこよのつき', baseType: 'special', types: ['action'], cost: '2', text: 'あなたの集中力は2になり、相手の集中力は0になり、相手を畏縮させる。' },
    '05-oboro-o-n-1': { megami: 'oboro', name: '鋼糸', ruby: 'こうし', baseType: 'normal', types: ['attack'], range: '3-4', damage: '2/2', text: '設置' },
    '05-oboro-o-n-2': { megami: 'oboro', name: '影菱', ruby: 'かげびし', baseType: 'normal', types: ['attack'], range: '2', damage: '2/1', text: '設置　対応不可\n【攻撃後】このカードを伏せ札から使用したならば、相手の手札を見てその中から1枚を選び、それを伏せ札にする。' },
    '05-oboro-o-n-3': { megami: 'oboro', name: '斬撃乱舞', ruby: 'ざんげきらんぶ', baseType: 'normal', types: ['attack', 'fullpower'], range: '2-4', damage: '3/2', text: '【常時】相手がこのターン中にオーラへのダメージを受けているならば、この《攻撃》は+1/+1となる。' },
    '05-oboro-o-n-4': { megami: 'oboro', name: '忍歩', ruby: 'にんぽ', baseType: 'normal', types: ['action'], text: '設置 \n間合⇔ダスト：1 \nこのカードを伏せ札から使用したならば、伏せ札から設置を持つカードを1枚使用してもよい。' },
    '05-oboro-o-n-5': { megami: 'oboro', name: '誘導', ruby: 'ゆうどう', baseType: 'normal', types: ['action', 'reaction'], text: '設置\n以下から１つを選ぶ。\n・間合→相オーラ：1\n・相オーラ→相フレア：1' },
    '05-oboro-o-n-6': { megami: 'oboro', name: '分身の術', ruby: 'ぶんしんのじゅつ', baseType: 'normal', types: ['action', 'fullpower'], text: '伏せ札から《全力》でないカードを1枚選び、そのカードを使用する。その後、そのカードが捨て札にあるならば捨て札からもう1回使用する。《攻撃》カードが使用されたならばそれらの《攻撃》は対応不可を得る（2回ともに対応不可を得る）。' },
    '05-oboro-o-n-7': { megami: 'oboro', name: '生体活性', ruby: 'せいたいかっせい', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙　設置 \n【破棄時】あなたの使用済の切札を1枚選び、それを未使用に戻す。' },
    '05-oboro-o-s-1': { megami: 'oboro', name: '熊介', ruby: 'くますけ', baseType: 'special', types: ['attack', 'fullpower'], range: '3-4', damage: '2/2', cost: '4', text: '【攻撃後】攻撃『適正距離3-4、2/2』をX回行う。Xはあなたの伏せ札の枚数に等しい。' },
    '05-oboro-o-s-2': { megami: 'oboro', name: '鳶影', ruby: 'とびかげ', baseType: 'special', types: ['action', 'reaction'], cost: '3', text: '伏せ札から《全力》でないカードを1枚選び、そのカードを使用してもよい。この際、このカードが対応している《攻撃》があるならば、使用されたカードはそれに対応しているものと扱う。' },
    '05-oboro-o-s-3': { megami: 'oboro', name: '虚魚', ruby: 'うろうお', baseType: 'special', types: ['action'], cost: '4', text: '【使用済】あなたは1回の再構成に対して、設置を持つカードを任意の枚数、任意の順で使用できる。' },
    '05-oboro-o-s-4': { megami: 'oboro', name: '壬蔓', ruby: 'みかずら', baseType: 'special', types: ['action'], cost: '0', text: '相オーラ→自フレア：1 \n----\n【再起】あなたのフレアが0である。' },
    '06-yukihi-o-n-1': { megami: 'yukihi', name: 'しこみばり / ふくみばり', ruby: '', baseType: 'normal', types: ['attack'], range: '4-6', rangeOpened: '0-2', damage: '3/1', damageOpened: '1/2', text: '', textOpened: '' },
    '06-yukihi-o-n-2': { megami: 'yukihi', name: 'しこみび / ねこだまし', ruby: '', baseType: 'normal', types: ['attack'], range: '5-6', rangeOpened: '0-2', damage: '1/1', damageOpened: '1/1', text: '【攻撃後】このカードを手札に戻し、傘の開閉を行う。 ', textOpened: '' },
    '06-yukihi-o-n-3': { megami: 'yukihi', name: 'ふりはらい / たぐりよせ', ruby: '', baseType: 'normal', types: ['attack'], range: '2-5', rangeOpened: '0-2', damage: '1/1', damageOpened: '1/1', text: '【攻撃後】ダスト⇔間合：1 ', textOpened: '【攻撃後】間合→ダスト：2' },
    '06-yukihi-o-n-4': { megami: 'yukihi', name: 'ふりまわし / つきさし', ruby: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '4-6', rangeOpened: '0-2', damage: '5/-', damageOpened: '-/2', text: '', textOpened: '' },
    '06-yukihi-o-n-5': { megami: 'yukihi', name: 'かさまわし', ruby: '', baseType: 'normal', types: ['action'], text: '(このカードは使用しても効果はない) \n【常時】あなたが傘の開閉を行った時、このカードを手札から公開してもよい。そうした場合、 \nダスト→自オーラ：1\n', textOpened: '' },
    '06-yukihi-o-n-6': { megami: 'yukihi', name: 'ひきあし / もぐりこみ', ruby: '', baseType: 'normal', types: ['action', 'reaction'], text: 'ダスト→間合：1 ', textOpened: '間合→ダスト：1' },
    '06-yukihi-o-n-7': { megami: 'yukihi', name: 'えんむすび', ruby: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時】間合→ダスト：1 \n【破棄時】ダスト→間合：1 \n【常時】あなたの傘が開いているならば、このカードの矢印(→)は逆になる。', textOpened: '' },
    '06-yukihi-o-s-1': { megami: 'yukihi', name: 'はらりゆき', ruby: '', baseType: 'special', types: ['attack'], range: '3-5', rangeOpened: '0-1', damage: '3/1', damageOpened: '0/0', cost: '2', text: '', textOpened: '----\n【即再起】あなたが傘の開閉を行う。 ' },
    '06-yukihi-o-s-2': { megami: 'yukihi', name: 'ゆらりび', ruby: '', baseType: 'special', types: ['attack'], range: '4-6', rangeOpened: '0', damage: '0/0', damageOpened: '4/5', cost: '5', text: '', textOpened: '' },
    '06-yukihi-o-s-3': { megami: 'yukihi', name: 'どろりうら', ruby: '', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '7', cost: '3', text: '【展開中】あなたのユキヒの《攻撃》は傘を開いた状態と傘を閉じた状態両方の適正距離を持つ。', textOpened: '' },
    '06-yukihi-o-s-4': { megami: 'yukihi', name: 'くるりみ', ruby: '', baseType: 'special', types: ['action', 'reaction'], cost: '1', text: '傘の開閉を行う。 \nダスト→自オーラ：1', textOpened: '' },
    '07-shinra-o-n-1': { megami: 'shinra', name: '立論', ruby: 'りつろん', baseType: 'normal', types: ['attack'], range: '2-7', damage: '2/-', text: '【常時】相手の山札に2枚以上のカードがあるならば、この《攻撃》はダメージを与える代わりに山札の上から2枚を伏せ札にする。' },
    '07-shinra-o-n-2': { megami: 'shinra', name: '反論', ruby: 'はんろん', baseType: 'normal', types: ['attack', 'reaction'], range: '2-7', damage: '1/-', text: '【攻撃後】対応した切札でなく、オーラへのダメージが3以上である《攻撃》のダメージを打ち消す。 \n【攻撃後】相手はカードを1枚引く。' },
    '07-shinra-o-n-3': { megami: 'shinra', name: '詭弁', ruby: 'きべん', baseType: 'normal', types: ['attack', 'fullpower'], range: '3-8', damage: '-/1', text: '【攻撃後】計略を実行し、次の計略を準備する。 \n[神算] 相手の山札の上から3枚を伏せ札にする。 \n[鬼謀] 相手の捨て札にあるカードを1枚選び、それを使用してもよい。' },
    '07-shinra-o-n-4': { megami: 'shinra', name: '引用', ruby: 'いんよう', baseType: 'normal', types: ['action'], text: '相手の手札を見て、《攻撃》カードを1枚選んでもよい。そうした場合、そのカードを使用するか伏せ札にする。その後、そのカードが《全力》を持つならば現在のフェイズを終了する。' },
    '07-shinra-o-n-5': { megami: 'shinra', name: '煽動', ruby: 'せんどう', baseType: 'normal', types: ['action', 'reaction'], text: '計略を実行し、次の計略を準備する。 \n[神算] ダスト→間合：1 \n[鬼謀] 間合→相オーラ：1' },
    '07-shinra-o-n-6': { megami: 'shinra', name: '壮語', ruby: 'そうご', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【破棄時】計略を実行し、次の計略を準備する。 \n[神算] あなたの集中力は1増加し、このカードを山札の一番上に置く。 \n[鬼謀] 相手は手札が2枚以上ならば、手札を1枚になるまで捨て札にする。相手の集中力は0になる。' },
    '07-shinra-o-n-7': { megami: 'shinra', name: '論破', ruby: 'ろんぱ', baseType: 'normal', types: ['enhance'], capacity: '4', text: '【展開時】相手の捨て札にあるカード1枚を選び、このカードの下に封印する。 \n【破棄時】このカードに封印されたカードを相手の捨て札に戻す。', sealable: true },
    '07-shinra-o-s-1': { megami: 'shinra', name: '完全論破', ruby: 'かんぜんろんぱ', baseType: 'special', types: ['action'], cost: '4', text: '相手の捨て札にあるカード1枚を選び、このカードの下に封印する。 \n(ゲーム中に戻ることはない)', sealable: true },
    '07-shinra-o-s-2': { megami: 'shinra', name: '皆式理解', ruby: 'かいしきりかい', baseType: 'special', types: ['action'], cost: '2', text: '計略を実行し、次の計略を準備する。 \n[神算] あなたの捨て札または使用済の切札から、消費を支払わずに《付与》カード1枚を使用する。そのカードが《全力》ならば現在のフェイズを終了する。 \n[鬼謀] 切札でない相手の付与札を1枚選ぶ。その上の桜花結晶全てをダストに送る。' },
    '07-shinra-o-s-3': { megami: 'shinra', name: '天地反駁', ruby: 'てんちはんぱく', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '5', cost: '2', text: '【展開中】あなたの《攻撃》のオーラへのダメージとライフへのダメージを入れ替える。 \n（ダメージの入れ替えは、ダメージの増減より先に適用される）' },
    '07-shinra-o-s-4': { megami: 'shinra', name: '森羅判証', ruby: 'しんらばんしょう', baseType: 'special', types: ['enhance'], capacity: '6', cost: '6', text: '【展開時】ダスト→自ライフ：2 \n【展開中】あなたの他の付与札が破棄された時、相手のライフに1ダメージを与える。 \n【破棄時】あなたは敗北する。' },
    '08-hagane-o-n-1': { megami: 'hagane', name: '遠心撃', ruby: 'えんしんげき', baseType: 'normal', types: ['attack'], range: '2-6', damage: '5/3', text: '遠心 \n【攻撃後】現在のターンがあなたのターンならば、あなたと相手の手札を全て伏せ札にし、あなたの集中力は0になり、現在のフェイズを終了する。' },
    '08-hagane-o-n-2': { megami: 'hagane', name: '砂風塵', ruby: 'さふうじん', baseType: 'normal', types: ['attack'], range: '0-6', damage: '1/-', text: '【攻撃後】現在の間合がターン開始時の間合から2以上変化しているならば、相手の手札を1枚無作為に選び、それを捨て札にする。' },
    '08-hagane-o-n-3': { megami: 'hagane', name: '大地砕き', ruby: 'だいちくだき', baseType: 'normal', types: ['attack', 'fullpower'], range: '0-3', damage: '2/-', text: '対応不可 \n【攻撃後】相手の集中力は0になり、相手を畏縮させる。' },
    '08-hagane-o-n-4': { megami: 'hagane', name: '超反発', ruby: 'ちょうはんぱつ', baseType: 'normal', types: ['action'], text: '現在の間合が4以下ならば、相フレア→間合：1' },
    '08-hagane-o-n-5': { megami: 'hagane', name: '円舞錬', ruby: 'えんぶれん', baseType: 'normal', types: ['action'], text: '遠心 \n相手のフレアが3以上ならば、相フレア→自オーラ：2' },
    '08-hagane-o-n-6': { megami: 'hagane', name: '鐘鳴らし', ruby: 'かねならし', baseType: 'normal', types: ['action'], text: '遠心 \n以下から１つを選ぶ。\n・このターンにあなたが次に行う《攻撃》は対応不可を得る。\n・このターンにあなたが次に行う《攻撃》はオーラへのダメージが3以上ならば+0/+1、そうでないならば+2/+0となる。' },
    '08-hagane-o-n-7': { megami: 'hagane', name: '引力場', ruby: 'いんりょくば', baseType: 'normal', types: ['enhance'], capacity: '4', text: '【展開時】間合→ダスト：1 \n【展開中】達人の間合は1小さくなる。' },
    '08-hagane-o-s-1': { megami: 'hagane', name: '大天空クラッシュ', ruby: 'だいてんくうクラッシュ', baseType: 'special', types: ['attack'], range: '0-10', damage: 'X/Y', cost: '5', text: '超克 \n【常時】Xは現在の間合がターン開始時の間合からどれだけ変化しているかに等しい。YはXの半分(切り上げ)に等しい。' },
    '08-hagane-o-s-2': { megami: 'hagane', name: '大破鐘メガロベル', ruby: 'だいはがねメガロベル', baseType: 'special', types: ['action'], cost: '2', text: 'あなたの他の切札が全て使用済ならば、ダスト→自ライフ：2' },
    '08-hagane-o-s-3': { megami: 'hagane', name: '大重力アトラクト', ruby: 'だいじゅうりょくアトラクト', baseType: 'special', types: ['action'], cost: '5', text: '間合→自フレア：3 \n----\n【再起】このターンにあなたが遠心を持つカードを使用しており、このカードを使用していない。' },
    '08-hagane-o-s-4': { megami: 'hagane', name: '大山脈リスペクト', ruby: 'だいさんみゃくリスペクト', baseType: 'special', types: ['action'], cost: '4', text: '遠心 \nあなたの捨て札にある異なる《全力》でないカードを2枚まで選び、任意の順番で使用する。' },
    '09-chikage-o-n-1': { megami: 'chikage', name: '飛苦無', ruby: 'とびくない', baseType: 'normal', types: ['attack'], range: '4-5', damage: '2/2', text: '' },
    '09-chikage-o-n-2': { megami: 'chikage', name: '毒針', ruby: 'どくばり', baseType: 'normal', types: ['attack'], range: '4', damage: '1/1', text: '【攻撃後】毒袋から「麻痺毒」「幻覚毒」「弛緩毒」のいずれか1枚を選び、そのカードを相手の山札の一番上に置く。' },
    '09-chikage-o-n-3': { megami: 'chikage', name: '遁術', ruby: 'とんじゅつ', baseType: 'normal', types: ['attack', 'reaction'], range: '1-3', damage: '1/-', text: '【攻撃後】自オーラ→間合：2 \n【攻撃後】このターン中、全てのプレイヤーは基本動作《前進》を行えない。' },
    '09-chikage-o-n-4': { megami: 'chikage', name: '首切り', ruby: 'くびきり', baseType: 'normal', types: ['attack', 'fullpower'], range: '0-3', damage: '2/3', text: '【攻撃後】相手の手札が2枚以上あるならば、相手は手札を1枚捨て札にする。' },
    '09-chikage-o-n-5': { megami: 'chikage', name: '毒霧', ruby: 'どくぎり', baseType: 'normal', types: ['action'], text: '毒袋から「麻痺毒」「幻覚毒」「弛緩毒」のいずれか1枚を選び、そのカードを相手の手札に加える。' },
    '09-chikage-o-n-6': { megami: 'chikage', name: '抜き足', ruby: 'ぬきあし', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙 \n【展開中】現在の間合は2減少する。 \n(間合は0未満にならない)' },
    '09-chikage-o-n-7': { megami: 'chikage', name: '泥濘', ruby: 'でいねい', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開中】相手は基本動作《後退》と《離脱》を行えない。' },
    '09-chikage-o-s-1': { megami: 'chikage', name: '滅灯の魂毒', ruby: 'ほろびのみたまどく', baseType: 'special', types: ['action'], cost: '3', text: '毒袋から「滅灯毒」を1枚を選び、そのカードを相手の山札の一番上に置く。' },
    '09-chikage-o-s-2': { megami: 'chikage', name: '叛旗の纏毒', ruby: 'はんきのまといどく', baseType: 'special', types: ['enhance', 'reaction'], capacity: '5', cost: '2', text: '【展開中】相手によるオーラへのダメージかライフへのダメージのどちらかが「-」である《攻撃》は打ち消される。' },
    '09-chikage-o-s-3': { megami: 'chikage', name: '流転の霞毒', ruby: 'るてんのかすみどく', baseType: 'special', types: ['attack'], range: '3-7', damage: '1/2', cost: '1', text: '【再起】相手の手札が2枚以上ある。' },
    '09-chikage-o-s-4': { megami: 'chikage', name: '闇昏千影の生きる道', ruby: 'やみくらちかげのいきるみち', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '4', cost: '5', text: '【展開中】あなたが1以上のライフへのダメージを受けた時、このカードの上の桜花結晶は全てダストに送られ、このカードは未使用に戻る。 \n(破棄時効果は失敗する) \n【破棄時】あなたの他の切札が全て使用済ならば、あなたは勝利する。' },
    '09-chikage-o-p-1': { megami: 'chikage', name: '麻痺毒', ruby: 'まひどく', extra: true, poison: true, baseType: 'normal', types: ['action'], text: '毒（このカードは伏せ札にできない） \n【常時】このターン中にあなたが基本動作を行ったならば、このカードは使用できない。 \nこのカードを相手の毒袋に戻す。その後、このフェイズを終了する。' },
    '09-chikage-o-p-2': { megami: 'chikage', name: '幻覚毒', ruby: 'げんかくどく', extra: true, poison: true, baseType: 'normal', types: ['action'], text: '毒（このカードは伏せ札にできない） \nこのカードを相手の毒袋に戻す。 \n自フレア→ダスト：2' },
    '09-chikage-o-p-3': { megami: 'chikage', name: '弛緩毒', ruby: 'しかんどく', extra: true, poison: true, baseType: 'normal', types: ['enhance'], capacity: '3', text: '毒（このカードは伏せ札にできない） \n【展開中】あなたは《攻撃》カードを使用できない。 \n【破棄時】このカードを相手の毒袋に戻す。' },
    '09-chikage-o-p-4': { megami: 'chikage', name: '滅灯毒', ruby: 'ほろびどく', extra: true, poison: true, baseType: 'normal', types: ['action'], text: '毒（このカードは伏せ札にできない） \n自オーラ→ダスト：3' },
    '10-kururu-o-n-1': { megami: 'kururu', name: 'えれきてる', ruby: '', baseType: 'normal', types: ['action'], text: '----\n<行行行対対> 相手のライフに1ダメージを与える。 ' },
    '10-kururu-o-n-2': { megami: 'kururu', name: 'あくせらー', ruby: '', baseType: 'normal', types: ['action'], text: '----\n<行行付> あなたの手札から《全力》カードを1枚選び、そのカードを使用してもよい。 \n(フェイズは終了しない) ' },
    '10-kururu-o-n-3': { megami: 'kururu', name: 'くるるーん', ruby: '', baseType: 'normal', types: ['action', 'reaction'], text: '【常時】このカードは対応でしか使用できない。 \n以下から2つまでを選び、任意の順に行う。 \n(同じものを2回選ぶことはできない)\n・カードを1枚引く。\n・伏せ札1枚を山札の底に置く。\n・相手は手札を1枚捨て札にする。' },
    '10-kururu-o-n-4': { megami: 'kururu', name: 'とるねーど', ruby: '', baseType: 'normal', types: ['action', 'fullpower'], text: '----\n<攻攻> 相手のオーラに5ダメージを与える。 \n----\n<付付> 相手のライフに1ダメージを与える。' },
    '10-kururu-o-n-5': { megami: 'kururu', name: 'りげいなー', ruby: '', baseType: 'normal', types: ['action', 'fullpower'], text: '----\n<攻対> あなたの使用済の切札を1枚選んでもよい。そのカードを消費を支払わずに使用する。(《全力》カードでもよい) \n----\nあなたの集中力は0になる。' },
    '10-kururu-o-n-6': { megami: 'kururu', name: 'もじゅるー', ruby: '', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開中】あなたが《行動》カードを使用した時、その解決後に基本動作を1回行ってもよい。' },
    '10-kururu-o-n-7': { megami: 'kururu', name: 'りふれくた', ruby: '', baseType: 'normal', types: ['enhance'], capacity: '0', text: '----\n<攻対> 【展開時】このカードの上に桜花結晶を4個ダストから置く。 \n----\n【展開中】各ターンにおける相手の2回目の《攻撃》は打ち消される。\n' },
    '10-kururu-o-s-1': { megami: 'kururu', name: 'どれーんでびる', ruby: '', baseType: 'special', types: ['action', 'reaction'], cost: '2', text: '相オーラ→自オーラ：1 \n【使用済】あなたの使用済の切札が未使用に戻った時、このカードを消費を支払わずに使用してもよい。' },
    '10-kururu-o-s-2': { megami: 'kururu', name: 'びっぐごーれむ', ruby: '', baseType: 'special', types: ['action'], cost: '4', text: '----\n<対全全> 【使用済】あなたの終了フェイズに相手のライフに1ダメージを与えてもよい。そうした場合、山札を再構成する。 \n----\n【使用済】あなたが《全力》カードを使用した時、その解決後に基本動作を1回行ってもよい。\n' },
    '10-kururu-o-s-3': { megami: 'kururu', name: 'いんだすとりあ', ruby: '', baseType: 'special', types: ['action'], cost: '1', text: 'このカードにカードが封印されていないならば、あなたの手札から《付与》でないカードを1枚選び、そのカードをこのカードの下に表向きで封印してもよい。 \nあなたの追加札から「でゅーぷりぎあ」を山札の底に1枚置く(最大で合計3枚)。 \n----\n【即再起】あなたが山札を再構成する(再構成の後に未使用に戻る)。', sealable: true },
    '10-kururu-o-s-4': { megami: 'kururu', name: '神渉装置:枢式', ruby: 'かんしょうそうち　くるるしき', baseType: 'special', types: ['action'], cost: '3', text: '----\n<攻攻行行行付付> 相手の切札を見て、その中から1枚選び、それを使用済にしてもよい。\n----\n相手の使用済の切札1枚を選んでもよい。そのカードを消費を支払わずに使用する(《全力》カードでもよい)。その後、このカードを取り除く。', removable: true },
    '10-kururu-o-s-3-ex1': { megami: 'kururu', name: 'でゅーぷりぎあ', ruby: '', extra: true, baseType: 'normal', types: ['variable'], text: '(カードタイプが不定のカードは使用できない) \n【常時】このカードはあなたの「いんだすとりあ」に封印されたカードの複製となる。但し、名前は変更されない。 \n(「いんだすとりあ」が未使用なら複製とならないので、使用できない)' },
    '11-thallya-o-n-1': { megami: 'thallya', name: 'Burning Steam', ruby: 'バーニングスチーム', baseType: 'normal', types: ['attack'], range: '3-5', damage: '2/1', text: '【攻撃後】騎動を行う。' },
    '11-thallya-o-n-2': { megami: 'thallya', name: 'Waving Edge', ruby: 'ウェービングエッジ', baseType: 'normal', types: ['attack'], range: '1-3', damage: '3/1', text: '燃焼 \n【攻撃後】騎動を行う。' },
    '11-thallya-o-n-3': { megami: 'thallya', name: 'Shield Charge', ruby: 'シールドチャージ', baseType: 'normal', types: ['attack'], range: '1', damage: '3/2', text: '燃焼 \n【常時】この《攻撃》のダメージにより移動する桜花結晶は、ダストやフレアでなく間合に動かす。' },
    '11-thallya-o-n-4': { megami: 'thallya', name: 'Steam Cannon', ruby: 'スチームカノン', baseType: 'normal', types: ['attack', 'fullpower'], range: '2-8', damage: '3/3', text: '燃焼' },
    '11-thallya-o-n-5': { megami: 'thallya', name: 'Stunt', ruby: 'スタント', baseType: 'normal', types: ['action'], text: '相手を畏縮させる。 \n自オーラ→自フレア：2' },
    '11-thallya-o-n-6': { megami: 'thallya', name: 'Roaring', ruby: 'ロアリング', baseType: 'normal', types: ['action'], text: 'コストとして、あなたのマシンにある造花結晶を2つ燃焼済にしても良い。そうした場合、あなたは集中力を1得て、相手は集中力を1失い、相手を畏縮させる。 \nコストとして、集中力を2支払ってもよい。そうした場合、あなたの燃焼済の造花結晶を3つ回復する。' },
    '11-thallya-o-n-7': { megami: 'thallya', name: 'Turbo Switch', ruby: 'ターボスイッチ', baseType: 'normal', types: ['action', 'reaction'], text: '燃焼 \n騎動を行う。' },
    '11-thallya-o-s-1': { megami: 'thallya', name: 'Alpha-Edge', ruby: 'アルファエッジ', baseType: 'special', types: ['attack'], range: '1,3,5,7', damage: '1/1', cost: '1', text: '【即再起】あなたが騎動により間合を変化させる。' },
    '11-thallya-o-s-2': { megami: 'thallya', name: 'Omega-Burst', ruby: 'オメガバースト', baseType: 'special', types: ['action', 'reaction'], cost: '4', text: 'あなたの燃焼済の造花結晶を全て回復する。 \n対応した、オーラへのダメージが「-」またはX以下の《攻撃》を打ち消す。Xはこのカードにより回復した造花結晶の個数に等しい。' },
    '11-thallya-o-s-4': { megami: 'thallya', name: 'Julia\'s BlackBox', ruby: 'ジュリアズ　ブラックボックス', baseType: 'special', types: ['action', 'fullpower'], cost: '0', text: 'あなたのマシンに造花結晶がないならば、あなたのマシンはTransFormし、あなたの燃焼済の造花結晶を2つ回復する。そうでない場合、このカードを未使用に戻す。' },
    'transform-01': { megami: 'thallya', name: 'Form:YAKSHA', ruby: 'フォルム:ヤクシャ', baseType: 'transform', types: ['variable'], text: '【変形時】相手は次の開始フェイズにカードを1枚しか引けない。相手を畏縮させる。\n----\n【常時】あなたのマシンに造花結晶がないならば、あなたは基本動作を行えない。\n----\n【追加基本行動：Beta-Edge】\n「適正距離2,4,6,8、2/1 【攻撃後】騎動を行う」の《攻撃》を行う。' },
    'transform-02': { megami: 'thallya', name: 'Form:NAGA', ruby: 'フォルム:ナーガ', baseType: 'transform', types: ['variable'], text: '【変形時】相手のフレアが3以上ならば、フレアが2になるように桜花結晶をダストへ移動させる。 \n----\n【追加基本行動：Gamma-Ray】\n相手の山札の一番上のカードを相手の捨て札に置く。' },
    'transform-03': { megami: 'thallya', name: 'Form:GARUDA', ruby: 'フォルム:ガルーダ', baseType: 'transform', types: ['variable'], text: '【変形時】カードを2枚引き、このターンの間手札の上限が無くなる。 \n----\n【常時】カードを2枚引き、このターンの間手札の上限が無くなる。 \n----\n【追加基本行動：Delta-Wing】\n現在の間合が7以下ならば、ダスト→間合：1' },
    '12-raira-o-n-1': { megami: 'raira', name: '獣爪', ruby: 'じゅうそう', baseType: 'normal', types: ['attack'], range: '1-2', damage: '3/1', text: '' },
    '12-raira-o-n-2': { megami: 'raira', name: '風雷撃', ruby: 'ふうらいげき', baseType: 'normal', types: ['attack'], range: '2', damage: 'X/2', text: '【常時】Xは風神ゲージと雷神ゲージのうち、小さい方の値である。' },
    '12-raira-o-n-3': { megami: 'raira', name: '流転爪', ruby: 'るてんそう', baseType: 'normal', types: ['attack'], range: '1-2', damage: '2/1', text: '【攻撃後】あなたの捨て札にある《攻撃》カード1枚を選び、山札の一番上に置いてもよい。' },
    '12-raira-o-n-4': { megami: 'raira', name: '風走り', ruby: 'かぜばしり', baseType: 'normal', types: ['action'], text: '現在の間合が3以上ならば、間合→ダスト：2' },
    '12-raira-o-n-5': { megami: 'raira', name: '風雷の知恵', ruby: 'ふうらいのちえ', baseType: 'normal', types: ['action'], text: '風神ゲージと雷神ゲージの合計が4以上ならば、あなたの捨て札にある他のメガミのカード1枚を選び、山札の一番上に置いてもよい。 \n風神ゲージか雷神ゲージを1上げる。' },
    '12-raira-o-n-6': { megami: 'raira', name: '呼び声', ruby: 'よびごえ', baseType: 'normal', types: ['action', 'fullpower'], text: '相手を畏縮させ、以下から1つを選ぶ。\n・風神ゲージと雷神ゲージを1ずつ上げる。\n・手札を全て伏せ札にし、雷神ゲージを2倍にする。' },
    '12-raira-o-n-7': { megami: 'raira', name: '空駆け', ruby: 'そらかけ', baseType: 'normal', types: ['action', 'fullpower'], text: '間合⇔ダスト：3' },
    '12-raira-o-s-1': { megami: 'raira', name: '雷螺風神爪', ruby: 'らいらふうじんそう', baseType: 'special', types: ['attack'], range: '1-2', damage: '2/2', cost: '3', text: '【常時】あなたの雷神ゲージが4以上ならば、この《攻撃》は+1/+0となる。 \n----\n【再起】あなたの風神ゲージが4以上である。' },
    '12-raira-o-s-2': { megami: 'raira', name: '天雷召喚陣', ruby: 'てんらいしょうかんじん', baseType: 'special', types: ['action', 'fullpower'], cost: '6', text: '攻撃『適正距離0-10、1/1』をX回行う。Xは雷神ゲージの半分(切り上げ)に等しい。' },
    '12-raira-o-s-3': { megami: 'raira', name: '風魔招来孔', ruby: 'ふうましょうらいこう', baseType: 'special', types: ['action'], cost: '0', text: '現在の風神ゲージに応じて、以下の切札を追加札から未使用で得る(条件を満たしたものは全て得る)。その後、このカードを取り除く。 \n3以上……風魔旋風 \n6以上……風魔纏廻 \n10以上……風魔天狗道', removable: true },
    '12-raira-o-s-4': { megami: 'raira', name: '円環輪廻旋', ruby: 'えんかんりんかいせん', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '5', cost: '3', text: '【展開中】あなたが《付与》でない通常札を使用した場合、それを捨て札にする代わりに山札の底に置く。' },
    '12-raira-o-s-3-ex1': { megami: 'raira', name: '風魔旋風', ruby: 'ふうませんぷう', extra: true, baseType: 'special', types: ['attack'], range: '1-3', damage: '1/2', cost: '1', text: '' },
    '12-raira-o-s-3-ex2': { megami: 'raira', name: '風魔纏廻', ruby: 'ふうまてんかい', extra: true, baseType: 'special', types: ['action'], cost: '1', text: 'あなたの使用済の切札を1枚選び、それを未使用に戻す。 \n【使用済】あなたの切札の消費は1少なくなる(0未満にはならない)。' },
    '12-raira-o-s-3-ex3': { megami: 'raira', name: '風魔天狗道', ruby: 'ふうまてんぐどう', extra: true, baseType: 'special', types: ['action', 'reaction'], cost: '4', text: 'ダスト⇔間合：5 \nあなたはこの効果で本来より少ない個数の桜花結晶を動かしてもよい。その後、このカードを取り除く。', removable: true },
    '12-utsuro-o-n-1': { megami: 'utsuro', name: '円月', ruby: 'えんげつ', baseType: 'normal', types: ['attack'], range: '6-7', damage: '2/2', text: '【常時】灰塵-ダストが12以上ならば、この《攻撃》のオーラへのダメージは「-」になる。' },
    '12-utsuro-o-n-2': { megami: 'utsuro', name: '黒き波動', ruby: 'くろきはどう', baseType: 'normal', types: ['attack'], range: '4-7', damage: '1/2', text: '【攻撃後】相手が<オーラ>へのダメージを選んだならば、相手の手札を見てその中から1枚を選び、それを捨て札にする。' },
    '12-utsuro-o-n-3': { megami: 'utsuro', name: '刈取り', ruby: 'かりとり', baseType: 'normal', types: ['attack'], range: '4', damage: '-/0', text: '【攻撃後】相手は相手の<オーラ>、<フレア>、<ライフ>のいずれかから桜花結晶を合計2つ<ダスト>へ移動させる。 \n【攻撃後】相手の付与札を1枚選んでもよい。そうした場合、その付与札の上から桜花結晶を2つ<ダスト>へ送る。' },
    '12-utsuro-o-n-4': { megami: 'utsuro', name: '重圧', ruby: 'じゅうあつ', baseType: 'normal', types: ['action'], text: '相手は相手の<オーラ>、<フレア>、<ライフ>のいずれかから桜花結晶を1つ<ダスト>へ移動させる。 \n灰塵-ダストが12以上ならば、相手を畏縮させる。' },
    '12-utsuro-o-n-5': { megami: 'utsuro', name: '影の翅', ruby: 'かげのはね', baseType: 'normal', types: ['action'], text: 'このターン中、現在の<間合>は2増加し、達人の間合は2大きくなる。' },
    '12-utsuro-o-n-6': { megami: 'utsuro', name: '影の壁', ruby: 'かげのかべ', baseType: 'normal', types: ['action', 'reaction'], text: '対応した《攻撃》は+0/-1となる。' },
    '12-utsuro-o-n-7': { megami: 'utsuro', name: '遺灰呪', ruby: 'いかいじゅ', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '2', text: '【展開時】相オーラ→ダスト：3 \n【破棄時】灰塵-<ダスト>が12以上ならば以下を行う。 \nダスト→相オーラ：2、相ライフ→ダスト：1' },
    '12-utsuro-o-s-1': { megami: 'utsuro', name: '灰滅', ruby: 'ヴィミラニエ', baseType: 'special', types: ['action'], cost: '24', text: '【常時】このカードの消費はダストの数だけ少なくなる。 \n相ライフ→ダスト：3 \nこのカードを取り除く。', removable: true },
    '12-utsuro-o-s-2': { megami: 'utsuro', name: '虚偽', ruby: 'ローシェ', baseType: 'special', types: ['enhance', 'reaction'], capacity: '3', cost: '3', text: '【展開中】相手の《攻撃》は距離縮小(近1)を得て、【攻撃後】効果が解決されない。 \n【展開中】相手の《付与》カードは納が1減少し、【破棄時】効果が解決されない。' },
    '12-utsuro-o-s-3': { megami: 'utsuro', name: '終末', ruby: 'カニェッツ', baseType: 'special', types: ['enhance'], capacity: '3', cost: '2', text: '【展開中】あなたに1以上のダメージを与えた《攻撃》の解決後に、このカードの上の桜花結晶を全てをダストに送る。 \n【破棄時】現在のフェイズを終了する。 \n----\n【再起】灰塵-ダストが12以上である。' },
    '12-utsuro-o-s-4': { megami: 'utsuro', name: '魔食', ruby: 'エロージャ', baseType: 'special', types: ['action'], cost: '5', text: '【使用済】あなたの開始フェイズの開始時に相手は以下のどちらかを選ぶ。\n・相オーラ→ダスト：1\n・相フレア→ダスト：2' }
};


/***/ }),

/***/ "./src/sakuraba/socket.ts":
/*!********************************!*\
  !*** ./src/sakuraba/socket.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ServerSocket = /** @class */ (function () {
    function ServerSocket(ioSocket) {
        this.ioSocket = ioSocket;
    }
    // クライアントに送信
    ServerSocket.prototype.emit = function (event, props) {
        console.log("[socket] emit " + event + " server -> client", props);
        this.ioSocket.emit(event, props);
    };
    // 他ユーザーに送信
    ServerSocket.prototype.broadcastEmit = function (tableId, event, props) {
        console.log("[socket] broadcastEmit " + event + " server -> client", props);
        this.ioSocket.broadcast.to(tableId).emit(event, props);
    };
    ServerSocket.prototype.on = function (event, fn) {
        this.ioSocket.on(event, function (props) {
            console.log("[socket] on " + event + " server <- client", props);
            fn(props);
        });
    };
    return ServerSocket;
}());
exports.ServerSocket = ServerSocket;
var ClientSocket = /** @class */ (function () {
    function ClientSocket(ioSocket) {
        this.ioSocket = ioSocket;
    }
    ClientSocket.prototype.emit = function (event, props) {
        console.log("[socket] emit " + event + " client -> server", props);
        this.ioSocket.emit(event, props);
    };
    ClientSocket.prototype.on = function (event, fn) {
        this.ioSocket.on(event, function (props) {
            console.log("[socket] on " + event + " client <- server", props);
            fn(props);
        });
    };
    return ClientSocket;
}());
exports.ClientSocket = ClientSocket;


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

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var sakuraba = __importStar(__webpack_require__(/*! sakuraba */ "./src/sakuraba.ts"));
/** プレイヤーサイドを逆にする */
function flipSide(side) {
    if (side === 'p1')
        return 'p2';
    if (side === 'p2')
        return 'p1';
    return side;
}
exports.flipSide = flipSide;
/** メガミの表示名を取得 */
function getMegamiDispName(megami) {
    var data = sakuraba.MEGAMI_DATA[megami];
    if (data.base !== undefined) {
        return data.name + "(" + data.symbol + ")";
    }
    else {
        return data.name + "(" + data.symbol + ")";
    }
}
exports.getMegamiDispName = getMegamiDispName;
/** ログを表示できるかどうか判定 */
function logIsVisible(log, side) {
    if (log.visibility === 'shown')
        return true;
    if (log.visibility === 'ownerOnly' && log.side === side)
        return true;
    if (log.visibility === 'outerOnly' && log.side !== side)
        return true;
    return false;
}
exports.logIsVisible = logIsVisible;
/** カードの適切な公開状態を判定 */
function judgeCardOpenState(card, handOpenFlag, cardSide, cardRegion) {
    if (cardSide === undefined)
        cardSide = card.side;
    if (cardRegion === undefined)
        cardRegion = card.region;
    var cardData = sakuraba.CARD_DATA[card.cardId];
    if (cardRegion === 'used' || cardRegion === 'on-card' || cardRegion === 'extra' || (cardData.baseType === 'special' && card.specialUsed)) {
        // カードが使用済み領域にある場合か、封印済みか、追加札か、切り札で使用済みフラグがONの場合、公開済み
        return 'opened';
    }
    else if (cardRegion === 'hand') {
        // 手札にあれば、所有者のみ表示可能
        // ただし手札オープンフラグがONの場合は全体公開
        return (handOpenFlag ? 'opened' : 'ownerOnly');
    }
    // 上記以外の場合は裏向き
    return 'hidden';
}
exports.judgeCardOpenState = judgeCardOpenState;
/** カードの説明用ポップアップHTMLを取得する */
function getDescriptionHtml(cardId) {
    var cardData = sakuraba.CARD_DATA[cardId];
    var cardTitleHtml = "<ruby><rb>" + cardData.name + "</rb><rp>(</rp><rt>" + cardData.ruby + "</rt><rp>)</rp></ruby>";
    var html = "<div class='ui header' style='margin-right: 2em;'>" + cardTitleHtml;
    html += "</div><div class='ui content'>";
    if (cardData.baseType === 'special') {
        html += "<div class='ui top right attached label'>\u6D88\u8CBB: " + cardData.cost + "</div>";
    }
    var typeCaptions = [];
    if (cardData.types.indexOf('attack') >= 0)
        typeCaptions.push("<span class='card-type-attack'>攻撃</span>");
    if (cardData.types.indexOf('action') >= 0)
        typeCaptions.push("<span class='card-type-action'>行動</span>");
    if (cardData.types.indexOf('enhance') >= 0)
        typeCaptions.push("<span class='card-type-enhance'>付与</span>");
    if (cardData.types.indexOf('variable') >= 0)
        typeCaptions.push("<span class='card-type-variable'>不定</span>");
    if (cardData.types.indexOf('reaction') >= 0)
        typeCaptions.push("<span class='card-type-reaction'>対応</span>");
    if (cardData.types.indexOf('fullpower') >= 0)
        typeCaptions.push("<span class='card-type-fullpower'>全力</span>");
    html += "" + typeCaptions.join('/');
    if (cardData.range !== undefined) {
        if (cardData.rangeOpened !== undefined) {
            html += "<span style='margin-left: 1em;'>\u9069\u6B63\u8DDD\u96E2 [\u9589]" + cardData.range + " [\u958B]" + cardData.rangeOpened + "</span>";
        }
        else {
            html += "<span style='margin-left: 1em;'>\u9069\u6B63\u8DDD\u96E2" + cardData.range + "</span>";
        }
    }
    html += "<br>";
    if (cardData.types.indexOf('enhance') >= 0) {
        html += "\u7D0D: " + cardData.capacity + "<br>";
    }
    if (cardData.damageOpened !== undefined) {
        // 傘の開閉によって効果が分かれる攻撃カード
        html += "[\u9589] " + cardData.damage + "<br>";
        html += "" + cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
        html += (cardData.text ? '<br>' : '');
        html += "[\u958B] " + cardData.damageOpened + "<br>";
        html += "" + cardData.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
    }
    else if (cardData.textOpened) {
        // 傘の開閉によって効果が分かれる非攻撃カード
        html += "[\u9589] " + cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
        html += (cardData.text ? '<br>' : '');
        html += "[\u958B] " + cardData.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
    }
    else {
        if (cardData.damage !== undefined) {
            html += cardData.damage + "<br>";
        }
        html += "" + cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
    }
    html += "</div>";
    if (cardData.megami === 'kururu') {
        html = html.replace(/<([攻行付対全]+)>/g, function (str, arg) {
            var replaced = arg.replace(/攻+/, function (str2) { return "<span class='card-type-attack'>" + str2 + "</span>"; })
                .replace(/行+/, function (str2) { return "<span class='card-type-action'>" + str2 + "</span>"; })
                .replace(/付+/, function (str2) { return "<span class='card-type-enhance'>" + str2 + "</span>"; })
                .replace(/対+/, function (str2) { return "<span class='card-type-reaction'>" + str2 + "</span>"; })
                .replace(/全+/, function (str2) { return "<span class='card-type-fullpower'>" + str2 + "</span>"; });
            return "<" + replaced + ">";
        });
    }
    return html;
}
exports.getDescriptionHtml = getDescriptionHtml;
/** カードのリージョン名を取得 */
function getCardRegionTitle(selfSide, side, region) {
    var titleBase = "";
    if (region === 'hand') {
        titleBase = "手札";
    }
    if (region === 'hidden-used') {
        titleBase = "伏せ札";
    }
    if (region === 'library') {
        titleBase = "山札";
    }
    if (region === 'special') {
        titleBase = "切り札";
    }
    if (region === 'used') {
        titleBase = "使用済み";
    }
    if (region === 'extra') {
        titleBase = "追加札";
    }
    // 相手側に移動した場合は、「相手の」をつける
    if (selfSide !== side) {
        return "\u76F8\u624B\u306E" + titleBase;
    }
    else {
        return titleBase;
    }
}
exports.getCardRegionTitle = getCardRegionTitle;
/** 桜花結晶のリージョン名を取得 */
function getSakuraTokenRegionTitle(selfSide, side, region, linkedCard) {
    var titleBase = "";
    if (region === 'aura') {
        titleBase = "オーラ";
    }
    if (region === 'life') {
        titleBase = "ライフ";
    }
    if (region === 'flair') {
        titleBase = "フレア";
    }
    if (region === 'distance') {
        titleBase = "間合";
    }
    if (region === 'dust') {
        titleBase = "ダスト";
    }
    if (region === 'machine') {
        titleBase = "マシン";
    }
    if (region === 'burned') {
        titleBase = "燃焼済";
    }
    if (region === 'on-card') {
        var cardData = sakuraba.CARD_DATA[linkedCard.cardId];
        titleBase = "[" + cardData.name + "]\u4E0A";
    }
    // 相手側に移動した場合は、「相手の」をつける
    if (selfSide !== side && side !== null) {
        return "\u76F8\u624B\u306E" + titleBase;
    }
    else {
        return titleBase;
    }
}
exports.getSakuraTokenRegionTitle = getSakuraTokenRegionTitle;


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
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');
    $('#CONFIRM-MODAL .description').html(desc);
    $('#CONFIRM-MODAL')
        .modal({ closable: false, onApprove: yesCallback })
        .modal('show');
}
exports.confirmModal = confirmModal;
/** メッセージを表示する */
function messageModal(desc) {
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');
    $('#MESSAGE-MODAL .description').html(desc);
    $('#MESSAGE-MODAL')
        .modal({ closable: false })
        .modal('show');
}
exports.messageModal = messageModal;
/** 任意のモーダルを表示する */
function showModal(modalSelector) {
    $(modalSelector)
        .modal({ closable: false })
        .modal('show');
}
exports.showModal = showModal;
/** 入力ボックスを表示する */
function userInputModal(desc, decideCallback) {
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');
    $('#INPUT-MODAL .description-body').html(desc);
    $('#INPUT-MODAL')
        .modal({ closable: false, onApprove: decideCallback })
        .modal('show');
}
exports.userInputModal = userInputModal;


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
            watchers: {},
            megamis: { p1: null, p2: null },
            vigors: { p1: null, p2: null },
            witherFlags: { p1: false, p2: false },
            megamiOpenFlags: { p1: false, p2: false },
            firstDrawFlags: { p1: false, p2: false },
            mariganFlags: { p1: false, p2: false },
            handOpenFlags: { p1: false, p2: false },
            handCardOpenFlags: { p1: {}, p2: {} },
            planStatus: { p1: null, p2: null },
            umbrellaStatus: { p1: null, p2: null },
            windGuage: { p1: null, p2: null },
            thunderGuage: { p1: null, p2: null }
        },
        boardHistoryPast: [],
        boardHistoryFuture: [],
        currentWatcherSessionId: null,
        actionLog: [],
        chatLog: [],
        actionLogVisible: false,
        helpVisible: false,
        bgmPlaying: false,
        zoom: 1
    };
    return st;
}
exports.createInitialState = createInitialState;
/** カード1枚を作成 */
function createCard(id, cardId, region, side) {
    return {
        type: 'card',
        id: id,
        cardId: cardId,
        region: region,
        indexOfRegion: 0,
        rotated: false,
        openState: 'opened',
        specialUsed: false,
        linkedCardId: null,
        side: side,
        discharged: false,
        ownerSide: side
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
        group: null,
        groupTokenDraggingCount: null,
        side: side,
        linkedCardId: null,
        ownerSide: null
    };
}
exports.createSakuraToken = createSakuraToken;


/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
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
var socket_1 = __webpack_require__(/*! sakuraba/socket */ "./src/sakuraba/socket.ts");
var utils = __importStar(__webpack_require__(/*! sakuraba/utils */ "./src/sakuraba/utils/index.ts"));
var RedisClient = redis.createClient(process.env.REDIS_URL);
var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, '../index.html');
var MAIN_JS = path.join(__dirname, 'main.js');
var MAIN_JS_MAP = path.join(__dirname, 'main.js.map');
var browserSyncConfigurations = { "files": ["**/*.js"] };
var app = express();
if (process.env.ENVIRONMENT === 'development') {
    var browserSync = __webpack_require__(/*! browser-sync */ "browser-sync");
    var connectBrowserSync = __webpack_require__(/*! connect-browser-sync */ "connect-browser-sync");
    app.use(connectBrowserSync(browserSync(browserSyncConfigurations)));
}
app
    .set('views', __dirname + '/../')
    .set('view engine', 'ejs')
    .use(express.static('public'))
    .use(express.static('node_modules'))
    .get('/dist/main.js', function (req, res) { return res.sendFile(MAIN_JS); })
    .get('/dist/main.js.map', function (req, res) { return res.sendFile(MAIN_JS_MAP); })
    .get('/', function (req, res) { return res.sendFile(INDEX); })
    .get('/play/:key', function (req, res) {
    // キーに対応する情報の取得を試みる
    RedisClient.HGET("sakuraba:player-key-map", req.params.key, function (err, dataJson) {
        if (dataJson !== null) {
            var data = JSON.parse(dataJson);
            res.render('board', { tableId: data.tableId, side: data.side });
        }
        else {
            res.status(404);
            res.end('NotFound : ' + req.path);
        }
    });
})
    .get('/watch/:tableId', function (req, res) {
    res.render('board', { tableId: req.params.tableId, side: 'watcher' });
})
    .post('/tables.create', function (req, res) {
    // 新しい卓番号を採番
    RedisClient.INCR("sakuraba:currentTableNo", function (err, newTableNo) {
        // トランザクションを張る
        var multiClient = RedisClient.multi();
        // 卓を追加
        var state = utils.createInitialState();
        multiClient.SET("sakuraba:tables:" + newTableNo + ":board", JSON.stringify(state.board));
        multiClient.SET("sakuraba:tables:" + newTableNo + ":watchers", JSON.stringify({}));
        // 卓へアクセスするための、プレイヤー1用アクセスキー、プレイヤー2用アクセスキーを生成
        var p1Key = randomstring.generate({
            length: 12,
            readable: true
        });
        var p2Key = randomstring.generate({
            length: 12,
            readable: true
        });
        multiClient.HSET("sakuraba:player-key-map", p1Key, JSON.stringify({ tableId: newTableNo, side: 'p1' }));
        multiClient.HSET("sakuraba:player-key-map", p2Key, JSON.stringify({ tableId: newTableNo, side: 'p2' }));
        multiClient.EXEC(function (err, replies) {
            console.log(JSON.stringify(err));
            console.log(JSON.stringify(replies));
            // 卓にアクセスするためのURLを生成
            var urlBase;
            if (process.env.BASE_URL) {
                urlBase = process.env.BASE_URL;
            }
            else {
                // for development
                urlBase = req.protocol + '://' + req.hostname + ':' + PORT;
            }
            var p1Url = urlBase + "/play/" + p1Key;
            var p2Url = urlBase + "/play/" + p2Key;
            var watchUrl = urlBase + "/watch/" + newTableNo;
            res.json({ p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl });
        });
    });
});
var server = app.listen(PORT, function () { return console.log("Listening on " + PORT); });
var io = socketIO(server);
/** Redis上に保存されたボードデータを取得 */
function getStoredBoard(tableId, callback) {
    // ボード情報を取得
    RedisClient.GET("sakuraba:tables:" + tableId + ":board", function (err, json) {
        var boardData = JSON.parse(json);
        // コールバックを実行
        callback(boardData);
    });
}
/** Redisへボードデータを保存 */
function saveBoard(tableId, board, callback) {
    // ボード情報を保存
    RedisClient.SET("sakuraba:tables:" + tableId + ":board", JSON.stringify(board), function (err, success) {
        // コールバックを実行
        callback();
    });
}
/** Redis上に保存されたアクションログを取得 */
function getStoredActionLogs(tableId, callback) {
    // ログを取得
    RedisClient.LRANGE("sakuraba:tables:" + tableId + ":actionLogs", 0, -1, function (err, jsons) {
        var logs = jsons.map(function (json) { return JSON.parse(json); });
        // コールバックを実行
        callback(logs);
    });
}
/** Redis上に保存されたチャットログを取得 */
function getStoredChatLogs(tableId, callback) {
    // ログを取得
    RedisClient.LRANGE("sakuraba:tables:" + tableId + ":chatLogs", 0, -1, function (err, jsons) {
        var logs = jsons.map(function (json) { return JSON.parse(json); });
        // コールバックを実行
        callback(logs);
    });
}
/** Redisへアクションログデータを追加 */
function appendActionLogs(tableId, logs, callback) {
    // ログをトランザクションで追加
    var commands = [];
    logs.forEach(function (log) {
        commands.push(['RPUSH', "sakuraba:tables:" + tableId + ":actionLogs", JSON.stringify(log)]);
    });
    RedisClient.multi(commands).exec(function (err, success) {
        // コールバックを実行
        console.log('appendActionLogs response: ', success);
        callback(logs);
    });
}
/** Redisへチャットログデータを追加 */
function appendChatLogs(tableId, logs, callback) {
    // ログをトランザクションで追加
    var commands = [];
    logs.forEach(function (log) {
        commands.push(['RPUSH', "sakuraba:tables:" + tableId + ":chatLogs", JSON.stringify(log)]);
    });
    RedisClient.multi(commands).exec(function (err, success) {
        // コールバックを実行
        console.log('appendChatLogs response: ', success);
        callback(logs);
    });
}
io.on('connection', function (ioSocket) {
    var connectedTableId = null;
    var connectedWatcherSessionId = null;
    var socket = new socket_1.ServerSocket(ioSocket);
    console.log("Client connected - " + ioSocket.id);
    ioSocket.on('disconnect', function () {
        console.log("Client disconnect - " + ioSocket.id + ", " + connectedTableId + ", " + connectedWatcherSessionId);
        // もし観戦者が切断したなら、観戦者情報を削除
        if (connectedWatcherSessionId !== null) {
            RedisClient.GET("sakuraba:tables:" + connectedTableId + ":watchers", function (err, json) {
                var watchers = JSON.parse(json);
                // 観戦者情報を更新して、ログイン応答を返す
                if (watchers[connectedWatcherSessionId] !== undefined) {
                    watchers[connectedWatcherSessionId].online = false;
                }
                RedisClient.SET("sakuraba:tables:" + connectedTableId + ":watchers", JSON.stringify(watchers), function (err, json) {
                    socket.emit('onWatcherLoginSuccess', { watchers: watchers });
                    socket.broadcastEmit(connectedTableId, 'onWatcherChanged', { watchers: watchers });
                    connectedWatcherSessionId = connectedWatcherSessionId;
                });
            });
        }
    });
    // 初期情報のリクエスト
    socket.on('requestFirstTableData', function (p) {
        // テーブルIDを記憶
        connectedTableId = p.tableId;
        // roomにjoin
        socket.ioSocket.join(p.tableId);
        // ボード情報を取得
        getStoredBoard(p.tableId, function (board) {
            // アクションログ情報を取得
            getStoredActionLogs(p.tableId, function (actionLogs) {
                // チャットログ情報を取得
                getStoredChatLogs(p.tableId, function (chatLogs) {
                    socket.emit('onFirstTableDataReceived', { board: board, actionLogs: actionLogs, chatLogs: chatLogs, watchers: {} });
                });
            });
        });
    });
    // ボード状態の更新
    socket.on('updateBoard', function (p) {
        // ボード情報を取得
        getStoredBoard(p.tableId, function (board) {
            // 送信されたボード情報を上書き
            saveBoard(p.tableId, p.board, function () {
                // ボードが更新されたイベントを他ユーザーに配信
                socket.broadcastEmit(p.tableId, 'onBoardReceived', { board: p.board, appendedActionLogs: p.appendedActionLogs });
            });
        });
        // ログがあればサーバー側DBにログを追加
        if (p.appendedActionLogs !== null) {
            appendActionLogs(p.tableId, p.appendedActionLogs, function (logs) {
                // 送信成功後は何もしない
            });
        }
    });
    // チャットログ追加
    socket.on('appendChatLog', function (p) {
        appendChatLogs(p.tableId, [p.appendedChatLog], function (logs) {
            // チャットログ追加イベントを他ユーザーに配信
            socket.broadcastEmit(p.tableId, 'onChatLogAppended', { appendedChatLogs: logs });
        });
    });
    // 通知送信
    socket.on('notify', function (p) {
        // ログが追加されたイベントを他ユーザーに配信
        socket.broadcastEmit(p.tableId, 'onNotifyReceived', { senderSide: p.senderSide, message: p.message });
    });
    // 観戦者ログイン
    socket.on('watcherLogin', function (p) {
        // 観戦者情報を取得
        RedisClient.GET("sakuraba:tables:" + p.tableId + ":watchers", function (err, json) {
            var watchers = JSON.parse(json);
            // 送信されたセッションIDに対応する観戦者がいるかどうかで応答を変更
            if (watchers[p.sessionId] !== undefined) {
                // 観戦者情報を更新して、ログイン応答を返す
                watchers[p.sessionId].online = true;
                RedisClient.SET("sakuraba:tables:" + p.tableId + ":watchers", JSON.stringify(watchers), function (err, json) {
                    socket.emit('onWatcherLoginSuccess', { watchers: watchers });
                    socket.broadcastEmit(p.tableId, 'onWatcherChanged', { watchers: watchers });
                    connectedWatcherSessionId = p.sessionId;
                });
            }
            else {
                socket.emit('requestWatcherName', {});
            }
        });
    });
    // 観戦者名決定
    socket.on('watcherNameInput', function (p) {
        // 観戦者情報を取得
        RedisClient.GET("sakuraba:tables:" + p.tableId + ":watchers", function (err, json) {
            var watchers = JSON.parse(json);
            // 観戦者情報を更新して、ログイン応答を返す
            watchers[p.sessionId] = { name: p.name, online: true };
            RedisClient.SET("sakuraba:tables:" + p.tableId + ":watchers", JSON.stringify(watchers), function (err, json) {
                socket.emit('onWatcherLoginSuccess', { watchers: watchers });
                socket.broadcastEmit(p.tableId, 'onWatcherChanged', { watchers: watchers });
                connectedWatcherSessionId = p.sessionId;
            });
        });
    });
});


/***/ }),

/***/ "browser-sync":
/*!*******************************!*\
  !*** external "browser-sync" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("browser-sync");

/***/ }),

/***/ "connect-browser-sync":
/*!***************************************!*\
  !*** external "connect-browser-sync" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("connect-browser-sync");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

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