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
exports.MEGAMI_DATA = {
    'yurina': { name: 'ユリナ', symbol: '刀' }
    //, 'yurina-a': {name: '第一章ユリナ', symbol: '古刀', base: 'yurina'}
    ,
    'saine': { name: 'サイネ', symbol: '薙刀' }
    //, 'saine-a':  {name: '第二章サイネ', symbol: '琵琶', base: 'saine'}
    ,
    'himika': { name: 'ヒミカ', symbol: '銃' }
    //, 'himika-a': {name: '原初ヒミカ', symbol: '炎', base: 'himika'}
    ,
    'tokoyo': { name: 'トコヨ', symbol: '扇' }
    //, 'tokoyo-a': {name: '旅芸人トコヨ', symbol: '笛', base: 'tokoyo'}
    ,
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
exports.CARD_DATA = {
    '01-yurina-o-n-1': { megami: 'yurina', name: '斬', ruby: 'ざん', baseType: 'normal', types: ['attack'], range: "3-4", damage: '3/1', text: '' },
    '01-yurina-o-n-2': { megami: 'yurina', name: '一閃', ruby: 'いっせん', baseType: 'normal', types: ['attack'], range: "3", damage: '2/2', text: '【常時】決死-あなたのライフが3以下ならば、この《攻撃》は+1/+0となる。' },
    '01-yurina-o-n-3': { megami: 'yurina', name: '柄打ち', ruby: 'つかうち', baseType: 'normal', types: ['attack'], range: "1-2", damage: '2/1', text: '【攻撃後】決死-あなたのライフが3以下ならば、このターンにあなたが次に行う《攻撃》は+1/+0となる。' },
    '01-yurina-o-n-4': { megami: 'yurina', name: '居合', ruby: 'いあい', baseType: 'normal', types: ['attack', 'fullpower'], range: "2-4", damage: '4/3', text: '【常時】現在の間合が2以下ならば、この攻撃は-1/-1となる。' },
    '01-yurina-o-n-5': { megami: 'yurina', name: '足捌き', ruby: 'あしさばき', baseType: 'normal', types: ['action'], text: '現在の間合が4以上ならば、間合→ダスト：2\n現在の間合が1以下ならば、ダスト→間合：2' },
    '01-yurina-o-n-6': { megami: 'yurina', name: '圧気', ruby: 'あっき', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙\n【破棄時】攻撃『適正距離1-4、3/-』を行う。' },
    '01-yurina-o-n-7': { megami: 'yurina', name: '気炎万丈', ruby: 'きえんばんじょう', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '2', text: '【展開中】決死-あなたのライフが3以下ならば、あなたの他のメガミによる《攻撃》は+1/+1となるとともに超克を得る。' },
    '01-yurina-o-s-1': { megami: 'yurina', name: '月影落', ruby: 'つきかげおとし', baseType: 'special', cost: '7', types: ['attack'], range: '3-4', damage: '4/4', text: '' },
    '01-yurina-o-s-2': { megami: 'yurina', name: '浦波嵐', ruby: 'うらなみあらし', baseType: 'special', cost: '3', types: ['attack', 'reaction'], range: '0-10', damage: '2/-', text: '【攻撃後】対応した《攻撃》は-2/+0となる。' },
    '01-yurina-o-s-3': { megami: 'yurina', name: '浮舟宿', ruby: 'うきふねやどし', baseType: 'special', cost: '2', types: ['action'], text: 'ダスト→自オーラ：5 \n【即再起】決死-あなたのライフが3以下である。' },
    '01-yurina-o-s-4': { megami: 'yurina', name: '天音揺波の底力', ruby: 'あまねゆりなのそこぢから', baseType: 'special', cost: '5', types: ['attack', 'fullpower'], range: '1-4', damage: '5/5', text: '【常時】決死-あなたのライフが3以下でないと、このカードは使用できない。' },
    '02-saine-o-n-1': { megami: 'saine', name: '八方振り', ruby: 'はっぽうぶり', baseType: 'normal', types: ['attack'], range: "4-5", damage: '2/1', text: '【攻撃後】八相-あなたのオーラが0ならば、攻撃『適正距離4-5、2/1』を行う。' },
    '02-saine-o-n-2': { megami: 'saine', name: '薙斬り', ruby: 'なぎぎり', baseType: 'normal', types: ['attack', 'reaction'], range: "4-5", damage: '3/1', text: '' },
    '02-saine-o-n-3': { megami: 'saine', name: '返し刃', ruby: 'かえしやいば', baseType: 'normal', types: ['attack'], range: "3-5", damage: '1/1', text: '【攻撃後】このカードを対応で使用したならば、攻撃『適正距離3-5、2/1、対応不可』を行う。' },
    '02-saine-o-n-4': { megami: 'saine', name: '見切り', ruby: 'みきり', baseType: 'normal', types: ['action'], text: '【常時】八相-あなたのオーラが0ならば、このカードを《対応》を持つかのように相手の《攻撃》に割り込んで使用できる。\n間合⇔ダスト：1' },
    '02-saine-o-n-5': { megami: 'saine', name: '圏域', ruby: 'けんいき', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開時】ダスト→間合：1\n【展開中】達人の間合は2大きくなる。' },
    '02-saine-o-n-6': { megami: 'saine', name: '衝音晶', ruby: 'しょうおんしょう', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '1', text: '【展開時】対応した《攻撃》は-1/+0となる。 \n【破棄時】攻撃『適正距離0-10、1/-、対応不可』を行う。' },
    '02-saine-o-n-7': { megami: 'saine', name: '無音壁', ruby: 'むおんへき', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '5', text: '【展開中】あなたへのダメージを解決するに際し、このカードの上に置かれた桜花結晶をあなたのオーラにあるかのように扱う。' },
    '02-saine-o-s-1': { megami: 'saine', name: '律動弧戟', ruby: 'りつどうこげき', baseType: 'special', cost: '6', types: ['action'], text: '攻撃『適正距離3-4、1/1』を行う。\n攻撃『適正距離4-5、1/1』を行う。\n攻撃『適正距離3-5、2/2』を行う。' },
    '02-saine-o-s-2': { megami: 'saine', name: '響鳴共振', ruby: 'きょうめいきょうしん', baseType: 'special', cost: '8', types: ['action'], text: '【常時】このカードの消費は相手のオーラの数だけ少なくなる。\n相オーラ→間合：2' },
    '02-saine-o-s-3': { megami: 'saine', name: '音無砕氷', ruby: 'おとなしさいひょう', baseType: 'special', cost: '2', types: ['attack', 'reaction'], range: "0-10", damage: '1/1', text: '対応した《攻撃》は-1/-1となる。\n【再起】八相-あなたのオーラが0である。' },
    '02-saine-o-s-4': { megami: 'saine', name: '氷雨細音の果ての果て', ruby: 'ひさめさいねのはてのはて', baseType: 'special', cost: '5', types: ['attack', 'reaction'], range: '1-5', damage: '5/5', text: '【常時】このカードは切札に対する対応でしか使用できない。' },
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
    '03-himika-o-s-4': { megami: 'himika', name: 'ヴァーミリオンフィールド', ruby: '', baseType: 'special', cost: '2', types: ['action'], text: '連火-このカードがこのターンに使用した3枚目以降のカードならば、ダスト→間合：2\n【再起】あなたの手札が0枚である。' },
    '04-tokoyo-o-n-1': { megami: 'tokoyo', name: '梳流し', ruby: 'すきながし', baseType: 'normal', types: ['attack'], range: '4', damage: '-/1', text: '【攻撃後】境地-あなたの集中力が2ならば、このカードを山札の上に戻す。' },
    '04-tokoyo-o-n-2': { megami: 'tokoyo', name: '雅打ち', ruby: 'みやびうち', baseType: 'normal', types: ['attack'], range: '2-4', damage: '2/1', text: '【攻撃後】境地-あなたの集中力が2ならば、対応した切札でない《攻撃》を打ち消す。' },
    '04-tokoyo-o-n-3': { megami: 'tokoyo', name: '跳ね兎', ruby: 'はねうさぎ', baseType: 'normal', types: ['action'], text: '現在の間合が3以下ならば、ダスト→間合：2' },
    '04-tokoyo-o-n-4': { megami: 'tokoyo', name: '詩舞', ruby: 'しぶ', baseType: 'normal', types: ['action', 'reaction'], text: '集中力を1得て、以下から1つを選ぶ。\n・自フレア→自オーラ：1\n・自オーラ→間合：1' },
    '04-tokoyo-o-n-5': { megami: 'tokoyo', name: '要返し', ruby: 'かなめがえし', baseType: 'normal', types: ['action', 'fullpower'], text: '捨て札か伏せ札からカードを2枚まで選ぶ。それらのカードを好きな順で山札の底に置く。 \nダスト→自オーラ：2' },
    '04-tokoyo-o-n-6': { megami: 'tokoyo', name: '風舞台', ruby: 'かぜぶたい', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時】間合→自オーラ：2 \n【破棄時】自オーラ→間合：2' },
    '04-tokoyo-o-n-7': { megami: 'tokoyo', name: '晴舞台', ruby: 'はれぶたい', baseType: 'normal', types: ['enhance'], capacity: '1', text: '【破棄時】境地-あなたの集中力が2ならば、ダスト→自オーラ：2 \n【破棄時】境地-あなたは集中力を1得る。' },
    '04-tokoyo-o-s-1': { megami: 'tokoyo', name: '久遠ノ花', ruby: 'くおんのはな', baseType: 'special', types: ['attack'], range: '0-10', damage: '-/1', cost: '5', text: '【攻撃後】対応した《攻撃》を打ち消す。' },
    '04-tokoyo-o-s-2': { megami: 'tokoyo', name: '千歳ノ鳥', ruby: 'ちとせのとり', baseType: 'special', types: ['attack'], range: '3-4', damage: '2/2', cost: '2', text: '【攻撃後】山札を再構成する。 \n(その際にダメージは受けない)' },
    '04-tokoyo-o-s-3': { megami: 'tokoyo', name: '無窮ノ風', ruby: 'むきゅうのかぜ', baseType: 'special', types: ['attack'], range: '3-8', damage: '1/1', cost: '1', text: '対応不可 \n【攻撃後】相手は手札から《攻撃》でないカード1枚を捨て札にする。それが行えない場合、相手は手札を公開する。 \n\n【再起】境地-あなたの集中力が2である。' },
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
    '05-oboro-o-s-4': { megami: 'oboro', name: '壬蔓', ruby: 'みかずら', baseType: 'special', types: ['action'], cost: '0', text: '相オーラ→自フレア：1 \n再起：あなたのフレアが0である。' },
    '06-yukihi-o-n-1': { megami: 'yukihi', name: 'しこみばり / ふくみばり', ruby: '', baseType: 'normal', types: ['attack'], range: '4-6', rangeOpened: '0-2', damage: '3/1', damageOpened: '1/2', text: '', textOpened: '' },
    '06-yukihi-o-n-2': { megami: 'yukihi', name: 'しこみび / ねこだまし', ruby: '', baseType: 'normal', types: ['attack'], range: '5-6', rangeOpened: '0-2', damage: '1/1', damageOpened: '1/1', text: '【攻撃後】このカードを手札に戻し、傘の開閉を行う。 ', textOpened: '' },
    '06-yukihi-o-n-3': { megami: 'yukihi', name: 'ふりはらい / たぐりよせ', ruby: '', baseType: 'normal', types: ['attack'], range: '2-5', rangeOpened: '0-2', damage: '1/1', damageOpened: '1/1', text: '【攻撃後】ダスト⇔間合：1 ', textOpened: '【攻撃後】間合→ダスト：2' },
    '06-yukihi-o-n-4': { megami: 'yukihi', name: 'ふりまわし / つきさし', ruby: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '4-6', rangeOpened: '0-2', damage: '5/-', damageOpened: '-/2', text: '', textOpened: '' },
    '06-yukihi-o-n-5': { megami: 'yukihi', name: 'かさまわし', ruby: '', baseType: 'normal', types: ['action'], text: '(このカードは使用しても効果はない) \n【常時】あなたが傘の開閉を行った時、このカードを手札から公開してもよい。そうした場合、 \nダスト→自オーラ：1\n', textOpened: '' },
    '06-yukihi-o-n-6': { megami: 'yukihi', name: 'ひきあし / もぐりこみ', ruby: '', baseType: 'normal', types: ['action', 'reaction'], text: '', textOpened: '' },
    '06-yukihi-o-n-7': { megami: 'yukihi', name: 'えんむすび', ruby: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時】間合→ダスト：1 \n【破棄時】ダスト→間合：1 \n【常時】あなたの傘が開いているならば、このカードの矢印(→)は逆になる。', textOpened: '' },
    '06-yukihi-o-s-1': { megami: 'yukihi', name: 'はらりゆき', ruby: '', baseType: 'special', types: ['attack'], range: '3-5', rangeOpened: '0-1', damage: '3/1', damageOpened: '0/0', cost: '2', text: '【即再起】あなたが傘の開閉を行う。 ', textOpened: '' },
    '06-yukihi-o-s-2': { megami: 'yukihi', name: 'ゆらりび', ruby: '', baseType: 'special', types: ['attack'], range: '4-6', rangeOpened: '0', damage: '0/0', damageOpened: '4/5', cost: '5', text: '', textOpened: '' },
    '06-yukihi-o-s-3': { megami: 'yukihi', name: 'どろりうら', ruby: '', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '7', cost: '3', text: '【展開中】あなたのユキヒの《攻撃》は傘を開いた状態と傘を閉じた状態両方の適正距離を持つ。', textOpened: '' },
    '06-yukihi-o-s-4': { megami: 'yukihi', name: 'くるりみ', ruby: '', baseType: 'special', types: ['action', 'reaction'], cost: '1', text: '傘の開閉を行う。 \nダスト→自オーラ：1', textOpened: '' },
    '09-chikage-o-n-1': { megami: 'chikage', name: '飛苦無', ruby: 'とびくない', baseType: 'normal', types: ['attack'], range: '4-5', damage: '2/2', text: '' },
    '09-chikage-o-n-2': { megami: 'chikage', name: '毒針', ruby: 'どくばり', baseType: 'normal', types: ['attack'], range: '4', damage: '1/1', text: '【攻撃後】毒袋から「麻痺毒」「幻覚毒」「弛緩毒」のいずれか1枚を選び、そのカードを相手の山札の一番上に置く。' },
    '09-chikage-o-n-3': { megami: 'chikage', name: '遁術', ruby: 'とんじゅつ', baseType: 'normal', types: ['attack', 'reaction'], range: '1-3', damage: '1/-', text: '【攻撃後】自オーラ→間合：2 \n【攻撃後】このターン中、全てのプレイヤーは基本動作《前進》を行えない。' },
    '09-chikage-o-n-4': { megami: 'chikage', name: '首切り', ruby: 'くびきり', baseType: 'normal', types: ['attack', 'fullpower'], range: '0-3', damage: '2/3', text: '【攻撃後】相手の手札が2枚以上あるならば、相手は手札を1枚捨て札にする。' },
    '09-chikage-o-n-5': { megami: 'chikage', name: '毒霧', ruby: 'どくぎり', baseType: 'normal', types: ['action'], text: '毒袋から「麻痺毒」「幻覚毒」「弛緩毒」のいずれか1枚を選び、そのカードを相手の手札に加える。' },
    '09-chikage-o-n-6': { megami: 'chikage', name: '抜き足', ruby: 'ぬきあし', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙 \n【展開中】現在の間合は2減少する。 \n(間合は0未満にならない)' },
    '09-chikage-o-n-7': { megami: 'chikage', name: '泥濘', ruby: 'でいねい', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開中】相手は基本動作《後退》と《離脱》を行えない。' },
    '09-chikage-o-s-1': { megami: 'chikage', name: '滅灯の魂毒', ruby: 'ほろびのみたまどく', baseType: 'special', types: ['action'], cost: '3', text: '毒袋から「滅灯毒」を1枚を選び、そのカードを相手の山札の一番上に置く。' },
    '09-chikage-o-s-2': { megami: 'chikage', name: '叛旗の纏毒', ruby: 'はんきのまといどく', baseType: 'special', types: ['enhance', 'reaction'], capacity: '5', cost: '2', text: '【展開中】相手によるオーラへのダメージかライフへのダメージのどちらかが「-」である《攻撃》は打ち消される。' },
    '09-chikage-o-s-3': { megami: 'chikage', name: '流転の霞毒', ruby: 'るてんのかすみどく', baseType: 'special', types: ['attack'], range: '3-7', damage: '1/2', cost: '1', text: '再起：相手の手札が2枚以上ある。' },
    '09-chikage-o-s-4': { megami: 'chikage', name: '闇昏千影の生きる道', ruby: 'やみくらちかげのいきるみち', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '4', cost: '5', text: '【展開中】あなたが1以上のライフへのダメージを受けた時、このカードの上の桜花結晶は全てダストに送られ、このカードは未使用に戻る。 \n(破棄時効果は失敗する) \n【破棄時】あなたの他の切札が全て使用済ならば、あなたは勝利する。' },
    '09-chikage-o-p-1': { megami: 'chikage', name: '麻痺毒', ruby: 'まひどく', baseType: 'extra', types: ['action'], text: '毒（このカードは伏せ札にできない） \n【常時】このターン中にあなたが基本動作を行ったならば、このカードは使用できない。 \nこのカードを相手の毒袋に戻す。その後、このフェイズを終了する。' },
    '09-chikage-o-p-2': { megami: 'chikage', name: '幻覚毒', ruby: 'げんかくどく', baseType: 'extra', types: ['action'], text: '毒（このカードは伏せ札にできない） \nこのカードを相手の毒袋に戻す。 \n自フレア→ダスト：2' },
    '09-chikage-o-p-3': { megami: 'chikage', name: '弛緩毒', ruby: 'しかんどく', baseType: 'extra', types: ['enhance'], capacity: '3', text: '毒（このカードは伏せ札にできない） \n【展開中】あなたは《攻撃》カードを使用できない。 \n【破棄時】このカードを相手の毒袋に戻す。' },
    '09-chikage-o-p-4': { megami: 'chikage', name: '滅灯毒', ruby: 'ほろびどく', baseType: 'extra', types: ['action'], text: '毒（このカードは伏せ札にできない） \n自オーラ→ダスト：3' }
    // , '99-xxx-o-n-1': {megami: 'xxx', name: '　', ruby: '　', baseType: 'normal', types: ['attack'], range: " ", damage: '-/-', text: ''}
    // , '99-xxx-o-s-1': {megami: 'xxx', name: '　', ruby: '　', baseType: 'special', cost: '5', types: ['attack'], range: ' ', damage: '-/-', text: ''}
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
    ServerSocket.prototype.emit = function (event, props) {
        console.log("[socket] emit " + event + " server -> client", props);
        this.ioSocket.emit(event, props);
    };
    ServerSocket.prototype.broadcastEmit = function (event, props) {
        console.log("[socket] broadcastEmit " + event + " server -> client", props);
        this.ioSocket.broadcast.emit(event, props);
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
    return data.name + "(" + data.symbol + ")";
}
exports.getMegamiDispName = getMegamiDispName;
/** ログを表示できるかどうか判定 */
function logIsVisible(log, side) {
    if (log.visibility === 'shown')
        return true;
    if (log.visibility === 'ownerOnly' && log.playerSide === side)
        return true;
    if (log.visibility === 'outerOnly' && log.playerSide !== side)
        return true;
    return false;
}
exports.logIsVisible = logIsVisible;
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
        typeCaptions.push("<span style='color: red; font-weight: bold;'>攻撃</span>");
    if (cardData.types.indexOf('action') >= 0)
        typeCaptions.push("<span style='color: blue; font-weight: bold;'>行動</span>");
    if (cardData.types.indexOf('enhance') >= 0)
        typeCaptions.push("<span style='color: green; font-weight: bold;'>付与</span>");
    if (cardData.types.indexOf('reaction') >= 0)
        typeCaptions.push("<span style='color: purple; font-weight: bold;'>対応</span>");
    if (cardData.types.indexOf('fullpower') >= 0)
        typeCaptions.push("<span style='color: #E0C000; font-weight: bold;'>全力</span>");
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
        html += "[\u9589] " + cardData.damage + "<br>";
        html += "" + cardData.text.replace(/\n/g, '<br>');
        html += (cardData.text ? '<br>' : '');
        html += "[\u958B] " + cardData.damageOpened + "<br>";
        html += "" + cardData.textOpened.replace(/\n/g, '<br>');
    }
    else {
        if (cardData.damage !== undefined) {
            html += cardData.damage + "<br>";
        }
        html += "" + cardData.text.replace(/\n/g, '<br>');
    }
    html += "</div>";
    return html;
}
exports.getDescriptionHtml = getDescriptionHtml;
/** リージョン名を取得 */
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
    // 相手側に移動した場合は、「相手の」をつける
    if (selfSide !== side) {
        return "\u76F8\u624B\u306E" + titleBase;
    }
    else {
        return titleBase;
    }
}
exports.getCardRegionTitle = getCardRegionTitle;


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
/** メッセージを表示する */
function messageModal(desc) {
    $('#MESSAGE-MODAL .description').html(desc);
    $('#MESSAGE-MODAL')
        .modal({ closable: false })
        .modal('show');
}
exports.messageModal = messageModal;
/** 入力ボックスを表示する */
function userInputModal(desc, decideCallback) {
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
            megamis: { p1: null, p2: null },
            vigors: { p1: null, p2: null },
            witherFlags: { p1: false, p2: false },
            megamiOpenFlags: { p1: false, p2: false },
            firstDrawFlags: { p1: false, p2: false },
            mariganFlags: { p1: false, p2: false }
        },
        boardHistoryPast: [],
        boardHistoryFuture: [],
        actionLog: [],
        messageLog: [],
        actionLogVisible: false,
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
        side: side
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
var browserSync = __webpack_require__(/*! browser-sync */ "browser-sync");
var connectBrowserSync = __webpack_require__(/*! connect-browser-sync */ "connect-browser-sync");
var socket_1 = __webpack_require__(/*! sakuraba/socket */ "./src/sakuraba/socket.ts");
var utils = __importStar(__webpack_require__(/*! sakuraba/utils */ "./src/sakuraba/utils/index.ts"));
var RedisClient = redis.createClient(process.env.REDIS_URL);
var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, '../index.html');
var MAIN_JS = path.join(__dirname, 'main.js');
var MAIN_JS_MAP = path.join(__dirname, 'main.js.map');
var browserSyncConfigurations = { "files": ["**/*.js"] };
var server = express()
    .use(connectBrowserSync(browserSync(browserSyncConfigurations)))
    .set('views', __dirname + '/../')
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
    var state = utils.createInitialState();
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
        // コールバックを実行
        callback(boardData);
    });
}
/** Redisへボードデータを保存 */
function saveBoard(boardId, board, callback) {
    // ボード情報を保存
    RedisClient.HSET('boards', boardId, JSON.stringify(board), function (err, success) {
        // コールバックを実行
        callback();
    });
}
/** Redis上に保存されたアクションログを取得 */
function getStoredActionLogs(boardId, callback) {
    // ログを取得
    RedisClient.LRANGE("actionLogs:" + boardId, 0, -1, function (err, jsons) {
        var logs = jsons.map(function (json) { return JSON.parse(json); });
        // コールバックを実行
        callback(logs);
    });
}
/** Redisへアクションログデータを追加 */
function appendActionLogs(boardId, logs, callback) {
    // ログをトランザクションで追加
    var commands = [];
    logs.forEach(function (log) {
        commands.push(['RPUSH', "actionLogs:" + boardId, JSON.stringify(log)]);
    });
    RedisClient.multi(commands).exec(function (err, success) {
        // コールバックを実行
        console.log('appendActionLogs response: ', success);
        callback(logs);
    });
}
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
    // ボード状態の更新
    socket.on('updateBoard', function (p) {
        // ボード情報を取得
        getStoredBoard(p.boardId, function (board) {
            // 送信されたボード情報を上書き
            saveBoard(p.boardId, p.board, function () {
                // ボードが更新されたイベントを他ユーザーに配信
                socket.broadcastEmit('onBoardReceived', { board: p.board, appendedActionLogs: p.appendedActionLogs });
            });
        });
        // ログがあればサーバー側DBにログを追加
        if (p.appendedActionLogs !== null) {
            appendActionLogs(p.boardId, p.appendedActionLogs, function (logs) {
                // 送信成功後は何もしない
            });
        }
    });
    // アクションログ情報のリクエスト
    socket.on('requestFirstActionLogs', function (p) {
        // アクションログ情報を取得
        getStoredActionLogs(p.boardId, function (logs) {
            socket.emit('onFirstActionLogsReceived', { logs: logs });
        });
    });
    // 通知送信
    socket.on('notify', function (p) {
        // ログが追加されたイベントを他ユーザーに配信
        socket.broadcastEmit('onNotifyReceived', { senderSide: p.senderSide, message: p.message });
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