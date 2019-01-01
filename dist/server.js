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

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(__webpack_require__(/*! lodash */ "lodash"));
// 領域ごとの桜花結晶最大数
exports.SAKURA_TOKEN_MAX = {
    aura: 5,
    life: 99,
    flair: 99,
    distance: 10,
    dust: 99,
    'on-card': 99,
    machine: 5,
    burned: 5,
    'out-of-game': 99
};
var MEGAMI_DATA_BASE = {
    'yurina': { name: 'ユリナ', nameZh: '摇波', nameEn: 'Yurina', symbol: '刀', symbolZh: '刀', symbolEn: 'Katana', tarotNo: '01' },
    'yurina-a1': { name: '第一章ユリナ', nameZh: '第一章摇波', nameEn: 'First Chapter Yurina', symbol: '古刀', symbolZh: '古刀', symbolEn: 'Kotō', base: 'yurina', anotherID: 'A1', tarotNo: '01' },
    'saine': { name: 'サイネ', nameZh: '细音', nameEn: 'Saine', symbol: '薙刀', symbolZh: '薙刀', symbolEn: 'Naginata', tarotNo: '02' },
    'saine-a1': { name: '第二章サイネ', nameZh: '第二章细音', nameEn: 'Second Chapter Saine', symbol: '琵琶', symbolZh: '琵琶', symbolEn: 'Biwa', base: 'saine', anotherID: 'A1', tarotNo: '02' },
    'himika': { name: 'ヒミカ', nameZh: '绯弥香', nameEn: 'Himika', symbol: '銃', symbolZh: '火枪', symbolEn: 'Arquebus', tarotNo: '03' },
    'himika-a1': { name: '原初ヒミカ', nameZh: '原初绯弥香', nameEn: 'Originally Himika', symbol: '炎', symbolZh: '炎', symbolEn: 'Flame', base: 'himika', anotherID: 'A1', tarotNo: '03' },
    'tokoyo': { name: 'トコヨ', nameZh: '常世', nameEn: 'Tokoyo', symbol: '扇', symbolZh: '扇', symbolEn: 'Fan', tarotNo: '04' },
    'tokoyo-a1': { name: '旅芸人トコヨ', nameZh: '旅艺人常世', nameEn: 'Bard Tokoyo', symbol: '笛', symbolZh: '笛', symbolEn: 'Flute', base: 'tokoyo', anotherID: 'A1', tarotNo: '04' },
    'oboro': { name: 'オボロ', nameZh: '胧', nameEn: 'Oboro', symbol: '忍', symbolZh: '忍', symbolEn: 'Ninjutsu', tarotNo: '05' },
    'oboro-a1': { name: '第三章オボロ', nameZh: '第三章胧', nameEn: 'Third Chapter Oboro', symbol: '戦略', symbolZh: '战略', symbolEn: 'Strategy', base: 'oboro', anotherID: 'A1', notExistCardSets: ['na-s2'], tarotNo: '05' },
    'yukihi': { name: 'ユキヒ', nameZh: '雪灯', nameEn: 'Yukihi', symbol: '傘/簪', symbolZh: '伞/簪', symbolEn: 'Umbrella/Hairpin', tarotNo: '06' },
    'shinra': { name: 'シンラ', nameZh: '森罗', nameEn: 'Shinra', symbol: '書', symbolZh: '书', symbolEn: 'Scroll', tarotNo: '07' },
    'hagane': { name: 'ハガネ', nameZh: '破钟', nameEn: 'Hagane', symbol: '槌', symbolZh: '锤', symbolEn: 'Hammer', tarotNo: '08' },
    'chikage': { name: 'チカゲ', nameZh: '千影', nameEn: 'Chikage', symbol: '毒', symbolZh: '毒', symbolEn: 'Poison', tarotNo: '09' },
    'chikage-a1': { name: '第四章チカゲ', nameZh: '第四章千影', nameEn: 'Fourth Chapter Chikage', symbol: '絆', symbolZh: '绊', symbolEn: 'Kizuna', base: 'chikage', anotherID: 'A1', notExistCardSets: ['na-s2'], tarotNo: '09' },
    'kururu': { name: 'クルル', nameZh: '枢', nameEn: 'Kururu', symbol: '絡繰', symbolZh: '机械', symbolEn: 'Karakuri', tarotNo: '10' },
    'thallya': { name: 'サリヤ', nameZh: '萨莉娅', nameEn: 'Thallya', symbol: '乗騎', symbolZh: '车', symbolEn: 'Mount', tarotNo: '11' },
    'raira': { name: 'ライラ', nameZh: '雷螺', nameEn: 'Raira', symbol: '爪', symbolZh: '爪', symbolEn: 'Claw', tarotNo: '12' },
    'utsuro': { name: 'ウツロ', nameZh: '虚', nameEn: 'Utsuro', symbol: '鎌', symbolZh: '镰', symbolEn: 'Scythe', tarotNo: '13' },
    'utsuro-a1': { name: '終章ウツロ', nameZh: '终章虚', nameEn: 'Final Chapter Utsuro', symbol: '塵', symbolZh: '尘', symbolEn: 'Dust', base: 'utsuro', anotherID: 'A1', notExistCardSets: ['na-s2'], tarotNo: '13' },
    'honoka': { name: 'ホノカ', nameZh: '穗乃香', nameEn: 'Honoka', symbol: '旗', symbolZh: '旗', symbolEn: 'Flag', notExistCardSets: ['na-s2'], tarotNo: '14' }
};
exports.MEGAMI_DATA = MEGAMI_DATA_BASE;
exports.CARD_SETS = ['na-s2', 'na-s3'];
exports.CARD_DATA = {};
exports.CARD_DATA['na-s2'] = {
    '01-yurina-o-n-1': { megami: 'yurina', name: '斬', nameEn: 'Slash', nameZh: '斩', ruby: 'ざん', rubyEn: '', baseType: 'normal', types: ['attack'], range: '3-4', damage: '3/1', text: '', textZh: '', textEn: '' },
    '01-yurina-A1-n-1': { megami: 'yurina', anotherID: 'A1', replace: '01-yurina-o-n-1', name: '乱打', nameEn: 'Wild Swing', nameZh: '乱打', ruby: 'らんだ', rubyEn: '', baseType: 'normal', types: ['attack'], range: '2', damage: '2/1', text: '【常時】決死-あなたのライフが3以下ならば、この《攻撃》は+0/+2となり、対応不可を得る。', textZh: '【常时】决死-如果你的命在3或者以下，那么此《攻击》获得+0/+2和不可被对应。', textEn: 'Forced: Resolve - If your Life is 3 or less, this attack gains +0/+2 and No Reactions.' },
    '01-yurina-o-n-2': { megami: 'yurina', name: '一閃', nameEn: 'Brandish', nameZh: '一闪', ruby: 'いっせん', rubyEn: '', baseType: 'normal', types: ['attack'], range: '3', damage: '2/2', text: '【常時】決死-あなたのライフが3以下ならば、この《攻撃》は+1/+0となる。', textZh: '【常时】决死-如果你的命在3或者以下，那么此《攻击》获得+1/+0', textEn: 'Forced: Resolve - This attack gains +1/+0 if your Life is 3 or less.' },
    '01-yurina-o-n-3': { megami: 'yurina', name: '柄打ち', nameEn: 'Hilt Strike', nameZh: '剑柄打击', ruby: 'つかうち', rubyEn: '', baseType: 'normal', types: ['attack'], range: '1-2', damage: '2/1', text: '【攻撃後】決死-あなたのライフが3以下ならば、このターンにあなたが次に行う《攻撃》は+1/+0となる。', textZh: '【攻击后】决死-如果你的命在3或者以下，这个回合你的下一次《攻击》获得+1/+0', textEn: 'After Attack: Resolve - The next attack you make this turn gains +1/+0 if your Life is 3 or less.' },
    '01-yurina-o-n-4': { megami: 'yurina', name: '居合', nameEn: 'Art of Drawing', nameZh: '居合斩', ruby: 'いあい', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '2-4', damage: '4/3', text: '【常時】現在の間合が2以下ならば、この攻撃は-1/-1となる。', textZh: '【常时】如果现在的距在2以下，那么此攻击获得-1/-1', textEn: 'Forced: If the current Distance is 2 or less, this attack gets -1/-1.' },
    '01-yurina-o-n-5': { megami: 'yurina', name: '足捌き', nameEn: 'Footwork', nameZh: '疾跑', ruby: 'あしさばき', rubyEn: '', baseType: 'normal', types: ['action'], text: '現在の間合が4以上ならば、間合→ダスト：2\n現在の間合が1以下ならば、ダスト→間合：2', textZh: '如果现在的距在4或者以上，那么距（2）→虚。 \n如果现在的距在1或者以下，那么虚（2）→距。', textEn: 'If the current Distance is 4 or more:\nDistance (2)→ Shadow\n\nIf the current Distance is 1 or less:\nShadow (2)→ Distance' },
    '01-yurina-o-n-6': { megami: 'yurina', name: '圧気', nameEn: 'Overawe', nameZh: '气和斩', ruby: 'あっき', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '隙\n【破棄時】攻撃『適正距離1-4、3/-』を行う。', textZh: '破绽\n【破弃时】进行一次“攻击距离1-4 伤害3/-”的攻击', textEn: 'Unguarded\nDisenchant: You attack with "Range: 1-4, Damage: 3/-".' },
    '01-yurina-A1-n-6': { megami: 'yurina', anotherID: 'A1', replace: '01-yurina-o-n-6', name: '癇癪玉', nameEn: 'Outrage', nameZh: '发脾气', ruby: 'かんしゃくだま ', rubyEn: '', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '１', text: '【破棄時】攻撃『適正距離0-4、1/-、対応不可、【攻撃後】相手を畏縮させる』を行う。', textZh: '【破弃时】进行一次“攻击距离0-4 伤害1/- 不可被对应 、【攻击后】对手畏缩”的攻击', textEn: 'Disenchant: You attack with "Range: 0-4, Damage: 1/-, No Reactions, After Attack: Flinch your opponent."' },
    '01-yurina-o-n-7': { megami: 'yurina', name: '気炎万丈', nameEn: 'Spirit of Fire', nameZh: '气焰万丈', ruby: 'きえんばんじょう', rubyEn: '', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '4', text: '【展開中】決死-あなたのライフが3以下ならば、あなたの他のメガミによる《攻撃》は+1/+1となるとともに超克を得る。', textZh: '【展开中】决死-如果你的命在3或者以下，那么你的另一柱女武神的《攻击》获得+1/+1和超克。', textEn: 'Ongoing: Resolve - All your other Megami\'s attacks gain +1/+1 and Overwhelm if your Life is 3 or less.' },
    '01-yurina-o-s-1': { megami: 'yurina', name: '月影落', nameEn: 'Tsukikage Crush', nameZh: '月影落', ruby: 'つきかげおとし', rubyEn: '', baseType: 'special', types: ['attack'], range: '3-4', damage: '4/4', cost: '7', text: '', textZh: '', textEn: '' },
    '01-yurina-o-s-2': { megami: 'yurina', name: '浦波嵐', nameEn: 'Uranami Storm', nameZh: '浦波岚', ruby: 'うらなみあらし', rubyEn: '', baseType: 'special', types: ['attack', 'reaction'], range: '0-10', damage: '2/-', cost: '3', text: '【攻撃後】対応した《攻撃》は-2/+0となる。', textZh: '【攻击后】对应的《攻击》获得-2/-0', textEn: 'After Attack: The attack this card was played as a Reaction to gets -2/+0.' },
    '01-yurina-A1-s-2': { megami: 'yurina', anotherID: 'A1', replace: '01-yurina-o-s-2', name: '不完全浦波嵐', nameEn: 'Imperfect Uranami Storm', nameZh: '不完全浦波岚', ruby: 'ふかんぜんうらなみあらし', rubyEn: '', baseType: 'special', types: ['attack', 'reaction'], range: '0-10', damage: '3/-', cost: '5', text: '【攻撃後】対応した《攻撃》は-3/+0となる。', textZh: '【攻击后】对应的《攻击》获得-3/-0', textEn: 'After Attack: The attack this card was played as a Reaction to gets -3/+0.' },
    '01-yurina-o-s-3': { megami: 'yurina', name: '浮舟宿', nameEn: 'Ukifune Serene', nameZh: '浮舟宿', ruby: 'うきふねやどし', rubyEn: '', baseType: 'special', types: ['action'], cost: '2', text: 'ダスト→自オーラ：5 \n----\n【即再起】決死-あなたのライフが3以下になる。', textZh: '虚（5）→自装 \n----\n【即再起】：决死-当你的命小于等于3时。', textEn: 'Shadow (5)→ Your Aura\n----\nImmediate Resurgence: Resolve - Your Life becomes 3 or less (from 4 or more).' },
    '01-yurina-o-s-4': { megami: 'yurina', name: '天音揺波の底力', nameEn: 'Yurina\'s Final Blow', nameZh: '天音摇波的底力', ruby: 'あまねゆりなのそこぢから', rubyEn: '', baseType: 'special', types: ['attack', 'fullpower'], range: '1-4', damage: '5/5', cost: '5', text: '【常時】決死-あなたのライフが3以下でないと、このカードは使用できない。', textZh: '【常时】非决死-你的命小于等于3时不能使用。', textEn: 'Forced: Resolve - You can\'t play this card unless your Life is 3 or less.' },
    '02-saine-o-n-1': { megami: 'saine', name: '八方振り', nameEn: 'Swing Rush', nameZh: '八面斩', ruby: 'はっぽうぶり', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4-5', damage: '2/1', text: '【攻撃後】八相-あなたのオーラが0ならば、攻撃『適正距離4-5、2/1』を行う。', textZh: '【攻击后】八相-如果你的装中没有樱花结晶，进行一次“攻击距离4-5 伤害2/1”的攻击。', textEn: 'After Attack: Idea - You attack with "Range: 4-5, Damage: 2/1" if you have no Sakura tokens on your Aura.' },
    '02-saine-o-n-2': { megami: 'saine', name: '薙斬り', nameEn: 'Cut Down', nameZh: '薙刀斩', ruby: 'なぎぎり', rubyEn: '', baseType: 'normal', types: ['attack', 'reaction'], range: '4-5', damage: '3/1', text: '', textZh: '', textEn: '' },
    '02-saine-o-n-3': { megami: 'saine', name: '返し刃', nameEn: 'Cut In', nameZh: '反身斩', ruby: 'かえしやいば', rubyEn: '', baseType: 'normal', types: ['attack', 'reaction'], range: '3-5', damage: '1/1', text: '【攻撃後】このカードを対応で使用したならば、攻撃『適正距離3-5、2/1、対応不可』を行う。', textZh: '【攻击后】如果这张牌当作对应打出，那么进行一次“攻击距离3-5 伤害2/1 、对应不可”的攻击。', textEn: 'After Attack: If this card was played as a Reaction, you attack with "Range: 3-5, Damage: 2/1, No Reactions".' },
    '02-saine-A1-n-3': { megami: 'saine', anotherID: 'A1', replace: '02-saine-o-n-3', name: '氷の音', nameEn: 'Sound of Ice', nameZh: '冰之音', ruby: 'ひのね', rubyEn: '', baseType: 'normal', types: ['action', 'reaction'], text: '相オーラ→ダスト：1\nこのカードを対応で使用したならば、さらに\n相オーラ→ダスト：1', textZh: '敌装（1）→虚。 \n如果这张牌当作对应打出，那么再次敌装（1）→虚', textEn: 'Opponent\'s Aura (1)→ Shadow\nIf this card was played as a Reaction:\nOpponent\'s Aura (1)→ Shadow (again)' },
    '02-saine-o-n-4': { megami: 'saine', name: '見切り', nameEn: 'Outclass', nameZh: '识破', ruby: 'みきり', rubyEn: '', baseType: 'normal', types: ['action'], text: '【常時】八相-あなたのオーラが0ならば、このカードを《対応》を持つかのように相手の《攻撃》に割り込んで使用できる。\n間合⇔ダスト：1', textZh: '【常时】八相-如果你的装中没有樱花结晶，那么可以把此卡视为具有《对应》词条在对手的攻击结算前打出。\n距（1） ⇔ 虚', textEn: 'Forced: Idea - You may play this card as if it were a Reaction if you have no Sakura tokens on your Aura.\n\nDistance (1)⇔ Shadow' },
    '02-saine-o-n-5': { megami: 'saine', name: '圏域', nameEn: 'Space for Master', nameZh: '圈域', ruby: 'けんいき', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開時】ダスト→間合：1\n【展開中】達人の間合は2大きくなる。', textZh: '【展开时】虚（1）→距 \n【展开中】达人间合的值+2', textEn: 'Initialize: Shadow (1)→ Distance.\n\nOngoing: Increase the size of the Mastery Zone by 2.' },
    '02-saine-o-n-6': { megami: 'saine', name: '衝音晶', nameEn: 'Wavering Crystal', nameZh: '冲音晶', ruby: 'しょうおんしょう', rubyEn: '', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '1', text: '【展開時】対応した《攻撃》は-1/+0となる。\n【破棄時】攻撃『適正距離0-10、1/-、対応不可』を行う。', textZh: '【展开时】对应的攻击获得-1/-0 \n【破弃时】进行一次“攻击距离0-10 伤害1/- 不可被对应”的攻击。', textEn: 'Initialize: The attack you played this card as a Reaction to gets -1/+0.\n\nDisenchant: You attack with "Range: 0-10, Damage: 1/-, No Reactions".' },
    '02-saine-A1-n-6': { megami: 'saine', anotherID: 'A1', replace: '02-saine-o-n-6', name: '伴奏', nameEn: 'Accompaniment', nameZh: '伴奏', ruby: 'ばんそう', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '4', text: '【展開中】あなたの他のメガミの切札が1枚以上使用済ならば、各ターンの最初の相手の《攻撃》は-1/+0となる。\n【展開中】あなたのサイネの切札が1枚以上使用済ならば、各ターンにあなたが最初に使用する切札の消費は1少なくなる(0未満にはならない)。', textZh: '【展开中】如果你有其他女武神的1张或以上王牌处于使用后状态，那么每个回合对手最初的《攻击》获得 -1/+0 \n【展开中】如果你有细音的1张或以上王牌处于使用后状态，那么每个回合你最先使用的王牌消费减少1（不会低于0）', textEn: 'Ongoing: If at least one of your other Megami\'s Special cards is Devoted, the first attack your opponent makes each turn gets -1/+0.\n\nOngoing: If at least one of your Saine\'s Special cards is Devoted, the first Special you play each turn costs 1 less to play.' },
    '02-saine-o-n-7': { megami: 'saine', name: '無音壁', nameEn: 'Silent Wall', nameZh: '无音壁', ruby: 'むおんへき', rubyEn: '', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '5', text: '【展開中】あなたへのダメージを解決するに際し、このカードの上に置かれた桜花結晶をあなたのオーラにあるかのように扱う。', textZh: '【展开中】当你要结算对装的伤害时，必须移除这张卡上的樱花结晶来代替。', textEn: 'Ongoing: Treat Sakura tokens on this card as if they were on your Aura whenever you are dealt damage.' },
    '02-saine-o-s-1': { megami: 'saine', name: '律動弧戟', nameEn: 'Rhythmic Arc', nameZh: '律动弧戟', ruby: 'りつどうこげき', rubyEn: '', baseType: 'special', types: ['action'], cost: '6', text: '攻撃『適正距離3-4、1/1』を行う。\n攻撃『適正距離4-5、1/1』を行う。\n攻撃『適正距離3-5、2/2』を行う。', textZh: '按顺序分别执行“攻击距离3-4 伤害1/1”“攻击距离4-5 伤害1/1”“攻击距离3-5 伤害2/2”的三次攻击。', textEn: 'You attack with\n"Range: 3-4, Damage: 1/1", \n"Range: 4-5, Damage: 1/1", and \n"Range: 3-5, Damage: 2/2" \nin this order.' },
    '02-saine-o-s-2': { megami: 'saine', name: '響鳴共振', nameEn: 'Resonant Beat', nameZh: '响鸣共振', ruby: 'きょうめいきょうしん', rubyEn: '', baseType: 'special', types: ['action'], cost: '8', text: '【常時】このカードの消費は相手のオーラの数だけ少なくなる。\n相オーラ→間合：2', textZh: '【常时】这张卡的消费减少X。X为对手的装中樱花结晶的个数。 \n敌装（2）→距', textEn: 'Forced: This card costs 1 less for each Sakura token on your opponent\'s Aura.\nOpponent\'s Aura (2)→ Distance' },
    '02-saine-A1-s-2': { megami: 'saine', anotherID: 'A1', replace: '02-saine-o-s-2', name: '二重奏:弾奏氷瞑', nameEn: 'Duet: Chilling Tranquility', nameZh: '二重奏：弹奏冰瞑', ruby: 'にじゅうそう:だんそうひょうめい', rubyEn: '', baseType: 'special', types: ['action'], cost: '2', text: '現在のフェイズを終了する。\n【使用済】あなたの他のメガミによる《攻撃》は+0/+1となる。\n----\n【即再起】あなたが再構成以外でライフに1以上のダメージを受ける。', textZh: '结束当前阶段。\n【使用后】你的另一柱女武神的攻击获得+0/+1\n----\n【即再起】你受到1点以上的重铸牌库以外的命伤。', textEn: 'End the current phase.\n\nDevoted: All your other Megami\'s attacks gain +0/+1.\n----\nImmediate Resurgence: You take 1 or more damage to your Life, excluding reshuffle damage.' },
    '02-saine-o-s-3': { megami: 'saine', name: '音無砕氷', nameEn: 'Silent Icebreaker', nameZh: '音无碎冰', ruby: 'おとなしさいひょう', rubyEn: '', baseType: 'special', types: ['attack', 'reaction'], range: '0-10', damage: '1/1', cost: '2', text: '【攻撃後】対応した《攻撃》は-1/-1となる。\n----\n【再起】八相-あなたのオーラが0である。', textZh: '【攻击后】对应的《攻击》获得-1/-1 \n----\n【再起】：八相-你的装中樱花结晶的数量为0', textEn: 'After Attack: The attack you played this card as a Reaction to gets -1/-1.\n----\nResurgence: Idea - You have no Sakura tokens on your Aura.' },
    '02-saine-o-s-4': { megami: 'saine', name: '氷雨細音の果ての果て', nameEn: 'Saine\'s Final Stage', nameZh: '冰雨细音的终焉', ruby: 'ひさめさいねのはてのはて', rubyEn: '', baseType: 'special', types: ['attack', 'reaction'], range: '1-5', damage: '5/5', cost: '5', text: '【常時】このカードは切札に対する対応でしか使用できない。', textZh: '【常时】非对应王牌时不能打出。', textEn: 'Forced: This can only be played as a Reaction to a Special card.' },
    '03-himika-o-n-1': { megami: 'himika', name: 'シュート', nameEn: 'Shoot', nameZh: '射击', ruby: '', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4-10', damage: '2/1', text: '', textZh: '', textEn: '' },
    '03-himika-o-n-2': { megami: 'himika', name: 'ラピッドファイア', nameEn: 'Quick Shot', nameZh: '速射', ruby: '', rubyEn: '', baseType: 'normal', types: ['attack'], range: '7-8', damage: '2/1', text: '【常時】連火-このカードがこのターンに使用した3枚目以降のカードならば、この《攻撃》は+1/+1となる。', textZh: '【常时】连火-若你这个回合使用的牌已达2张，那么此《攻击》获得+1/+1', textEn: 'Forced: Inferno - This attack gains +1/+1 if this is the third or later card you\'ve played this turn.' },
    '03-himika-A1-n-2': { megami: 'himika', anotherID: 'A1', replace: '03-himika-o-n-2', name: '火炎流', nameEn: 'Path of Flame', nameZh: '火炎流', ruby: 'かえんりゅう', rubyEn: '', baseType: 'normal', types: ['attack'], range: '1-3', damage: '2/1', text: '【常時】連火-このカードがこのターンに使用した3枚目以降のカードならば、この《攻撃》は+0/+1となる。', textZh: '【常时】连火-若你这个回合使用的牌已达2张，那么此《攻击》获得+0/+1', textEn: 'Forced: Inferno - This attack gains +0/+1 if this is the third or later card you\'ve played this turn.' },
    '03-himika-o-n-3': { megami: 'himika', name: 'マグナムカノン', nameEn: 'Magnum', nameZh: '麦林加农炮', ruby: '', rubyEn: '', baseType: 'normal', types: ['attack'], range: '5-8', damage: '3/2', text: '【攻撃後】自ライフ→ダスト：1', textZh: '【攻击后】自命（1）→虚', textEn: 'After Attack:\nYour Life (1)→ Shadow' },
    '03-himika-o-n-4': { megami: 'himika', name: 'フルバースト', nameEn: 'Barrage', nameZh: '完全爆破', ruby: '', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '5-9', damage: '3/1', text: '【常時】この《攻撃》がダメージを与えるならば、相手は片方を選ぶのではなく両方のダメージを受ける。', textZh: '【常时】对方结算伤害时，装和命需要同时结算。', textEn: 'Forced: This attack deals Damage to both Aura and Life.' },
    '03-himika-o-n-5': { megami: 'himika', name: 'バックステップ', nameEn: 'Backstep', nameZh: '后跳', ruby: '', rubyEn: '', baseType: 'normal', types: ['action'], text: 'カードを1枚引く。 \nダスト→間合：1', textZh: '抽1张牌。 \n虚（1）→距', textEn: 'Draw a card.\n\nShadow (1)→ Distance' },
    '03-himika-A1-n-5': { megami: 'himika', anotherID: 'A1', replace: '03-himika-o-n-5', name: '殺意', nameEn: 'Killing Intent', nameZh: '杀意', ruby: 'さつい', rubyEn: '', baseType: 'normal', types: ['action'], text: 'あなたの手札が0枚ならば、相オーラ→ダスト：2', textZh: '如果你的手牌为0，那么敌装（2）→虚。', textEn: 'If you have no cards in your hand:\nOpponent\'s Aura (2)→ Shadow' },
    '03-himika-o-n-6': { megami: 'himika', name: 'バックドラフト', nameEn: 'Backdraft', nameZh: '回燃', ruby: '', rubyEn: '', baseType: 'normal', types: ['action'], text: '相手を畏縮させる。\n連火-このカードがこのターンに使用した3枚目以降のカードならば、このターンにあなたが次に行う他のメガミによる《攻撃》を+1/+1する。', textZh: '对手畏缩。\n连火-若你这个回合使用的牌已达2张，这个回合你的下一次其他女武神的攻击获得+1/+1', textEn: 'Flinch your opponent.\n\nInferno - If this is the third or later card you\'ve played this turn, the next attack from your other Megami that you make this turn gains +1/+1.' },
    '03-himika-o-n-7': { megami: 'himika', name: 'スモーク', nameEn: 'Smoke', nameZh: '迷烟', ruby: '', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開中】カードの矢印(→)により間合にある桜花結晶は移動しない。', textZh: '【展开中】距中的樱花结晶不会因卡牌效果中的箭头(→)而移动。', textEn: 'Ongoing: Cards cannot move Sakura tokens from Distance using arrows (→).' },
    '03-himika-o-s-1': { megami: 'himika', name: 'レッドバレット', nameEn: 'Red Bullet', nameZh: '真红凶弹', ruby: '', rubyEn: '', baseType: 'special', types: ['attack'], range: '5-10', damage: '3/1', cost: '0', text: '', textZh: '', textEn: '' },
    '03-himika-o-s-2': { megami: 'himika', name: 'クリムゾンゼロ', nameEn: 'Crimson Zero', nameZh: '绯红零时', ruby: '', rubyEn: '', baseType: 'special', types: ['attack'], range: '0-2', damage: '2/2', cost: '5', text: '【常時】この《攻撃》がダメージを与えるならば、相手は片方を選ぶのではなく両方のダメージを受ける。\n【常時】現在の間合が0ならば、この《攻撃》は対応不可を得る。', textZh: '【常时】对方结算伤害时，装和命需要同时结算。\n【常时】如果现在的距为0，那么此《攻击》获得不可被对应。', textEn: 'Forced: This attack deals Damage to both Aura and Life.\n\nForced: If the current Distance is 0, this attack gains No Reactions.' },
    '03-himika-A1-s-2': { megami: 'himika', anotherID: 'A1', replace: '03-himika-o-s-2', name: '炎天・紅緋弥香', nameEn: 'Blazing Sun - Crimson Himika', nameZh: '炎天·红绯弥香', ruby: 'えんてん・くれないひみか', rubyEn: '', baseType: 'special', types: ['attack', 'fullpower'], range: '0-6', damage: 'X/X', cost: '7', text: '対応不可 \n【常時】Xは7から現在の間合を引いた値に等しい。 \n【攻撃後】あなたは敗北する。', textZh: '不可被对应。\n【常时】X等于7减去现在的距。\n【攻击后】你输掉这场游戏。', textEn: 'No Reactions\n\nForced: X is equal to 7 minus the current Distance.\n\nAfter Attack: You lose the game.' },
    '03-himika-o-s-3': { megami: 'himika', name: 'スカーレットイマジン', nameEn: 'Scarlet Visions', nameZh: '猩红狂想', ruby: '', rubyEn: '', baseType: 'special', types: ['action'], cost: '3', text: 'カードを2枚引く。その後、あなたは手札を1枚伏せ札にする。', textZh: '抽2张牌，然后，将你的一张手牌盖伏。', textEn: 'Draw two cards, then discard a card.' },
    '03-himika-o-s-4': { megami: 'himika', name: 'ヴァーミリオンフィールド', nameEn: 'Vermillion Field', nameZh: '真红领域', ruby: '', rubyEn: '', baseType: 'special', types: ['action'], cost: '2', text: '連火-このカードがこのターンに使用した3枚目以降のカードならば、ダスト→間合：2\n----\n【再起】あなたの手札が0枚である。', textZh: '连火-若你这个回合使用的牌已达2张，那么虚（2）→距\n----\n【再起】：你的手牌为0', textEn: 'Inferno - If this is the third or later card you\'ve played this turn:\nShadow (2)→ Distance\n----\nResurgence: You have no cards in your hand.' },
    '04-tokoyo-o-n-1': { megami: 'tokoyo', name: '梳流し', nameEn: 'Glancing Strike', nameZh: '梳流', ruby: 'すきながし', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4', damage: '-/1', text: '【攻撃後】境地-あなたの集中力が2ならば、このカードを山札の上に戻す。', textZh: '【攻击后】境地-若你的集中力为2，这张卡回到牌堆顶。', textEn: 'After Attack: Artistic - Put this card on the top of your deck if your Vigor is 2.' },
    '04-tokoyo-A1-n-1': { megami: 'tokoyo', anotherID: 'A1', replace: '04-tokoyo-o-n-1', name: '奏流し', nameEn: 'Entrancing Strike', nameZh: '奏流', ruby: 'かなでながし', rubyEn: '', baseType: 'normal', types: ['attack'], range: '5', damage: '-/1', text: '【常時】あなたのトコヨの切札が1枚以上使用済ならば、この《攻撃》は対応不可を得る。 \n【攻撃後】境地-あなたの集中力が2かつ、あなたの他のメガミの切札が1枚以上使用済ならば、このカードを山札の上に置く。', textZh: '【常时】如果你有常世的1张或以上王牌处于使用后状态，那么此《攻击》获得不可被对应。\n【攻击后】境地-如果你的集中力为2，且如果你有其他女武神的1张或以上王牌处于使用后状态，这张牌回到牌堆顶。', textEn: 'Forced: If at least one of your Tokoyo\'s Special cards is Devoted, this attack gains No Reactions.\n\nAfter Attack: Artistic - If your Vigor is 2 and at least one of your other Megami\'s Special cards is Devoted, put this card on the top of your deck.' },
    '04-tokoyo-o-n-2': { megami: 'tokoyo', name: '雅打ち', nameEn: 'Polite Return', nameZh: '雅击', ruby: 'みやびうち', rubyEn: '', baseType: 'normal', types: ['attack', 'reaction'], range: '2-4', damage: '2/1', text: '【攻撃後】境地-あなたの集中力が2ならば、対応した切札でない《攻撃》を打ち消す。', textZh: '【攻击后】境地-若你的集中力为2，打消对应的王牌以外的《攻击》。', textEn: 'After Attack: Artistic - Cancel the non-Special attack you played this card as a Reaction to if your Vigor is 2.' },
    '04-tokoyo-o-n-3': { megami: 'tokoyo', name: '跳ね兎', nameEn: 'Rabbit Step', nameZh: '脱兔', ruby: 'はねうさぎ', rubyEn: '', baseType: 'normal', types: ['action'], text: '現在の間合が3以下ならば、ダスト→間合：2', textZh: '如果现在的距为3或者以下，那么虚（2）→距', textEn: 'If the current Distance is 3 or less:\nShadow (2)→ Distance' },
    '04-tokoyo-o-n-4': { megami: 'tokoyo', name: '詩舞', nameEn: 'Song and Dance', nameZh: '诗舞', ruby: 'しぶ', rubyEn: '', baseType: 'normal', types: ['action', 'reaction'], text: '集中力を1得て、以下から1つを選ぶ。\n・自フレア→自オーラ：1\n・自オーラ→間合：1', textZh: '获得1点集中力，选择以下1项：\n自气（1）→自装\n自装（1）→距', textEn: 'Gain 1 Vigor. Choose one:\n・Your Flare (1)→ Your Aura\n・Your Aura (1)→ Distance' },
    '04-tokoyo-o-n-5': { megami: 'tokoyo', name: '要返し', nameEn: 'Break Point', nameZh: '扇回旋', ruby: 'かなめがえし', rubyEn: '', baseType: 'normal', types: ['action', 'fullpower'], text: '捨て札か伏せ札からカードを2枚まで選ぶ。それらのカードを好きな順で山札の底に置く。 \nダスト→自オーラ：2', textZh: '选择你弃牌堆和盖牌堆的两张牌，按你喜欢的顺序置于牌堆底。 \n虚（2）→自装', textEn: 'Choose up to two cards in your discard or played piles. Put those cards on the bottom of your deck in any order.\n\nShadow (2)→ Your Aura.' },
    '04-tokoyo-o-n-6': { megami: 'tokoyo', name: '風舞台', nameEn: 'Windy Stage', nameZh: '风舞台', ruby: 'かぜぶたい', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時】間合→自オーラ：2 \n【破棄時】自オーラ→間合：2', textZh: '【展开时】距（2）→自装 \n【破弃时】自装（2）→距', textEn: 'Initialize:\nDistance (2)→ Your Aura\n\nDisenchant:\nYour Aura (2)→ Distance' },
    '04-tokoyo-o-n-7': { megami: 'tokoyo', name: '晴舞台', nameEn: 'Sunny Stage', nameZh: '晴舞台', ruby: 'はれぶたい', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '1', text: '【破棄時】境地-あなたの集中力が2ならば、ダスト→自オーラ：2 \n【破棄時】境地-あなたは集中力を1得る。', textZh: '【破弃时】境地-若你集中力为2，那么虚（2）→自装。 \n【破弃时】你获得1点集中力。', textEn: 'Disenchant: Artistic - If your Vigor is 2:\nShadow (2)→ Your Aura\n\nDisenchant: Gain 1 Vigor.' },
    '04-tokoyo-A1-n-7': { megami: 'tokoyo', anotherID: 'A1', replace: '04-tokoyo-o-n-7', name: '陽の音', nameEn: 'Sound of Sun', nameZh: '阳之音', ruby: 'ひのね', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時/展開中】展開時、およびあなたが《対応》カードを使用した時、その解決後にダスト→自オーラ：1 \n【展開中】相手のターンにこのカードの上の桜花結晶は移動しない。', textZh: '【展开时】虚（1）→自装\n【展开中】每当你打出对应卡牌时，在效果结算后，虚（1）→自装\n【展开中】在对手的回合，这张牌上的樱花结晶不会被移除。', textEn: 'Initialize/Ongoing: When you play this, or you play a Reaction while this is in play, after that card resolves:\nShadow (1)→ Your Aura\n\nOngoing: Sakura tokens cannot leave this card on your opponent\'s turn.' },
    '04-tokoyo-o-s-1': { megami: 'tokoyo', name: '久遠ノ花', nameEn: 'Immortal Flower', nameZh: '久远之花', ruby: 'くおんのはな', rubyEn: '', baseType: 'special', types: ['attack', 'reaction'], range: '0-10', damage: '-/1', cost: '5', text: '【攻撃後】対応した《攻撃》を打ち消す。', textZh: '【攻击后】打消对应的《攻击》。 ', textEn: 'After Attack: Cancel the attack you played this card as a Reaction to.' },
    '04-tokoyo-o-s-2': { megami: 'tokoyo', name: '千歳ノ鳥', nameEn: 'Eternal Migrant', nameZh: '千岁之鸟', ruby: 'ちとせのとり', rubyEn: '', baseType: 'special', types: ['attack'], range: '3-4', damage: '2/2', cost: '2', text: '【攻撃後】山札を再構成する。 \n(その際にダメージは受けない)', textZh: '【攻击后】重铸牌库（不会受到伤害）', textEn: 'After Attack: Reshuffle your deck (without taking Damage to your Life).' },
    '04-tokoyo-A1-s-2': { megami: 'tokoyo', anotherID: 'A1', replace: '04-tokoyo-o-s-2', name: '二重奏:吹弾陽明', nameEn: 'Duet: Radiant Luminosity', nameZh: '二重奏：吹弹阳明', ruby: 'にじゅうそう：すいだんようめい', rubyEn: '', baseType: 'special', types: ['action'], cost: '1', text: '【使用済】あなたの開始フェイズの開始時に捨て札または伏せ札からカード1枚を選び、それを山札の底に置いてもよい。 \n----\n【即再起】あなたが再構成以外でライフに1以上のダメージを受ける。', textZh: '【使用后】你的准备阶段开始时，可以选择盖牌区或者弃牌区的一张卡，将它置于牌堆底。\n----\n【即再起】你受到重铸牌库以外的1点以上命伤。', textEn: 'Devoted: At the beginning of your turn, you may put a card from your discard pile or your played pile on the bottom of your deck.\n----\nImmediate Resurgence: You take 1 or more damage to your Life, excluding reshuffle damage.' },
    '04-tokoyo-o-s-3': { megami: 'tokoyo', name: '無窮ノ風', nameEn: 'Perpetual Wind', nameZh: '无穷之风', ruby: 'むきゅうのかぜ', rubyEn: '', baseType: 'special', types: ['attack'], range: '3-8', damage: '1/1', cost: '1', text: '対応不可 \n【攻撃後】相手は手札から《攻撃》でないカード1枚を捨て札にする。それが行えない場合、相手は手札を公開する。 \n----\n【再起】境地-あなたの集中力が2である。', textZh: '不可被对应。\n【攻击后】对手将手牌中的一张非攻击卡舍弃入弃牌堆。不能执行这个效果的场合，对手的手牌需公开。 \n----\n【再起】境地-你的集中力为2', textEn: 'No Reactions\n\nAfter Attack: Your opponent puts a non-Attack card from their hand into their played pile. If they can\'t, they must reveal their hand.\n----\nResurgence: Artistic - Your Vigor is 2.' },
    '04-tokoyo-o-s-4': { megami: 'tokoyo', name: '常世ノ月', nameEn: 'Eternal Moon', nameZh: '常世之月', ruby: 'とこよのつき', rubyEn: '', baseType: 'special', types: ['action'], cost: '2', text: 'あなたの集中力は2になり、相手の集中力は0になり、相手を畏縮させる。', textZh: '你的集中力变为2，对手的集中力变为0，对手畏缩。', textEn: 'Your Vigor becomes 2. Your opponent\'s Vigor becomes 0. Flinch your opponent.' },
    '05-oboro-o-n-1': { megami: 'oboro', name: '鋼糸', nameEn: 'Steel Strings', nameZh: '钢丝', ruby: 'こうし', rubyEn: '', baseType: 'normal', types: ['attack'], range: '3-4', damage: '2/2', text: '設置', textZh: '设置', textEn: 'Trap' },
    '05-oboro-o-n-2': { megami: 'oboro', name: '影菱', nameEn: 'Caltrops', nameZh: '影菱', ruby: 'かげびし', rubyEn: '', baseType: 'normal', types: ['attack'], range: '2', damage: '2/1', text: '設置　対応不可\n【攻撃後】このカードを伏せ札から使用したならば、相手の手札を見てその中から1枚を選び、それを伏せ札にする。', textZh: '设置 不可被对应 \n【常时】从盖牌区中使用这张卡时，察看对手的手牌，从中选择一张盖伏。', textEn: 'Trap    No Reactions\n\nAfter Attack: If this card was played from your discard pile, look at your opponent\'s hand. Choose one of those cards and put it into their discard pile.' },
    '05-oboro-o-n-3': { megami: 'oboro', name: '斬撃乱舞', nameEn: 'Rush of Blades', nameZh: '斩击乱舞', ruby: 'ざんげきらんぶ', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '2-4', damage: '3/2', text: '【常時】相手がこのターン中にオーラへのダメージを受けているならば、この《攻撃》は+1/+1となる。', textZh: '【常时】如果对手在这回合内，装受到过伤害，那么此《攻击》获得+1/+1', textEn: 'Forced: This attack gains +1/+1 if your opponent has taken damage to their Aura this turn.' },
    '05-oboro-o-n-4': { megami: 'oboro', name: '忍歩', nameEn: 'Ninpo-Walk', nameZh: '忍步', ruby: 'にんぽ', rubyEn: '', baseType: 'normal', types: ['action'], text: '設置 \n間合⇔ダスト：1 \nこのカードを伏せ札から使用したならば、伏せ札から設置を持つカードを1枚使用してもよい。', textZh: '设置\n距 (1)⇔ 虚\n如果这张牌从盖牌区使用，可以再从盖牌区中选择一张带有设置关键字的卡牌使用。', textEn: 'Trap\n\nDistance (1)⇔ Shadow\n\nIf this card was played from your discard pile, you may play a card with Trap from your discard pile.' },
    '05-oboro-o-n-5': { megami: 'oboro', name: '誘導', nameEn: 'Induce', nameZh: '诱导', ruby: 'ゆうどう', rubyEn: '', baseType: 'normal', types: ['action', 'reaction'], text: '設置\n以下から１つを選ぶ。\n・間合→相オーラ：1\n・相オーラ→相フレア：1', textZh: '设置 选择以下一项：\n距（1）→敌装\n敌装（1）→敌气', textEn: 'Trap\n\nChoose one:\n・Distance (1)→ Opponent\'s Aura\n・Opponent\'s Aura (1)→ Opponent\'s Flare' },
    '05-oboro-o-n-6': { megami: 'oboro', name: '分身の術', nameEn: 'Shadow Cloning', nameZh: '分身术', ruby: 'ぶんしんのじゅつ', rubyEn: '', baseType: 'normal', types: ['action', 'fullpower'], text: '伏せ札から《全力》でないカードを1枚選び、そのカードを使用する。その後、そのカードが捨て札にあるならば捨て札からもう1回使用する。《攻撃》カードが使用されたならばそれらの《攻撃》は対応不可を得る（2回ともに対応不可を得る）。', textZh: '选择盖牌区一张《全力》以外的卡使用。那之后，如果该卡因结算进入弃牌堆的话、再使用一次。如果选择的卡是《攻击》卡，这张《攻击》还会获得不可被对应。（2次都获得）', textEn: 'Reveal a non-Throughout card in your discard pile and play it. Then play it again if it is in your played pile. If the played card is an Attack card, it gains No Reactions (both times).' },
    '05-oboro-o-n-7': { megami: 'oboro', name: '生体活性', nameEn: 'Revitalize', nameZh: '生物活性', ruby: 'せいたいかっせい', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙　設置 \n【破棄時】あなたの使用済の切札を1枚選び、それを未使用に戻す。', textZh: '破绽 设置 \n【破弃时】选择一张你的使用后的王牌，将其设置为未使用状态。', textEn: 'Unguarded    Trap\n\nDisenchant: Choose one of your Devoted Special cards and turn it face-down.' },
    '05-oboro-o-s-1': { megami: 'oboro', name: '熊介', nameEn: 'Kuma-Suke', nameZh: '熊介', ruby: 'くますけ', rubyEn: '', baseType: 'special', types: ['attack', 'fullpower'], range: '3-4', damage: '2/2', cost: '4', text: '【攻撃後】攻撃『適正距離3-4、2/2』をX回行う。Xはあなたの伏せ札の枚数に等しい。', textZh: '【攻击后】进行X次“攻击距离3-4 伤害2/2”的攻击。X等同于盖牌区中的卡牌数量。 ', textEn: 'After Attack: You attack with "Range: 3-4, Damage: 2/2" X times, where X is the number of cards in your discard pile.' },
    '05-oboro-o-s-2': { megami: 'oboro', name: '鳶影', nameEn: 'Tobi-Kage', nameZh: '鸢影', ruby: 'とびかげ', rubyEn: '', baseType: 'special', types: ['action', 'reaction'], cost: '3', text: '伏せ札から《全力》でないカードを1枚選び、そのカードを使用してもよい。この際、このカードが対応している《攻撃》があるならば、使用されたカードはそれに対応しているものと扱う。', textZh: '选择盖牌区一张《全力》以外的卡使用。在这时，如果这张牌是对应《攻击》打出的话，那么你翻出的那张卡视为对应了那个攻击。', textEn: 'Reveal a non-Throughout card in your discard pile and play it. If this card was played as a Reaction to an attack, treat that card as if it were played as a Reaction to that attack.' },
    '05-oboro-o-s-3': { megami: 'oboro', name: '虚魚', nameEn: 'Uro-Uo', nameZh: '虚鱼', ruby: 'うろうお', rubyEn: '', baseType: 'special', types: ['action'], cost: '4', text: '【使用済】あなたは1回の再構成に対して、設置を持つカードを任意の枚数、任意の順で使用できる。', textZh: '【使用后】当你重铸牌库时，你可以以任意顺序使用任意张的带有设置关键字的卡牌。', textEn: 'Devoted: You may play any number of cards with Trap from your discard pile in the order of your choosing just before you reshuffle your deck.' },
    '05-oboro-o-s-4': { megami: 'oboro', name: '壬蔓', nameEn: 'Mi-Kazura', nameZh: '壬蔓', ruby: 'みかずら', rubyEn: '', baseType: 'special', types: ['action'], cost: '0', text: '相オーラ→自フレア：1 \n----\n【再起】あなたのフレアが0である。', textZh: '敌装（1）→自气 \n----\n【再起】自气为0', textEn: 'Opponent\'s Aura (1)→ Your Flare\n----\nResurgence: There are no Sakura tokens on your Flare.' },
    '06-yukihi-o-n-1': { megami: 'yukihi', name: 'しこみばり / ふくみばり', nameEn: 'Hidden Needles / Kept Needles', nameZh: '藏针/含针', ruby: '', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4-6', rangeOpened: '0-2', damage: '3/1', damageOpened: '1/2', text: '', textZh: '', textEn: '', textOpened: '', textOpenedZh: '', textOpenedEn: '' },
    '06-yukihi-o-n-2': { megami: 'yukihi', name: 'しこみび / ねこだまし', nameEn: 'Preparation / Fake Out', nameZh: '匍匐/猫跳', ruby: '', rubyEn: '', baseType: 'normal', types: ['attack'], range: '5-6', rangeOpened: '0-2', damage: '1/1', damageOpened: '1/1', text: '【攻撃後】このカードを手札に戻し、傘の開閉を行う。 ', textZh: '【攻击后】这张卡回到手牌中，进行伞的开合操作。', textEn: 'After Attack: Put this card into your hand. Open your umbrella.\n', textOpened: '', textOpenedZh: '', textOpenedEn: '' },
    '06-yukihi-o-n-3': { megami: 'yukihi', name: 'ふりはらい / たぐりよせ', nameEn: 'Hidden Power / Chain Reel', nameZh: '拒/引', ruby: '', rubyEn: '', baseType: 'normal', types: ['attack'], range: '2-5', rangeOpened: '0-2', damage: '1/1', damageOpened: '1/1', text: '【攻撃後】ダスト⇔間合：1 ', textZh: '【攻击后】距（1）⇔ 虚 ', textEn: 'After Attack: \nDistance (1)⇔ Shadow', textOpened: '【攻撃後】間合→ダスト：2', textOpenedZh: '【攻击后】距（2）→虚', textOpenedEn: 'fter Attack:\nDistance (2)→ Shadow' },
    '06-yukihi-o-n-4': { megami: 'yukihi', name: 'ふりまわし / つきさし', nameEn: 'Swing / Pierce', nameZh: '挥舞/突刺', ruby: '', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '4-6', rangeOpened: '0-2', damage: '5/-', damageOpened: '-/2', text: '', textZh: '', textEn: '', textOpened: '', textOpenedZh: '', textOpenedEn: '' },
    '06-yukihi-o-n-5': { megami: 'yukihi', name: 'かさまわし', nameEn: 'Wield', nameZh: '伞飞转', ruby: '', rubyEn: '', baseType: 'normal', types: ['action'], text: '(このカードは使用しても効果はない) \n【常時】あなたが傘の開閉を行った時、このカードを手札から公開してもよい。そうした場合、 \nダスト→自オーラ：1\n', textZh: '（这张牌使用没有任何效果）\n【常时】当你进行伞的开合操作时，你可以公开手卡中的这张牌，那之后虚（1）→自装', textEn: '(Nothing happens if you play this card.)\n\nForced: Whenever you open or close your umbrella, you may reveal this card from your hand and:\nShadow (1)→ Your Aura' },
    '06-yukihi-o-n-6': { megami: 'yukihi', name: 'ひきあし / もぐりこみ', nameEn: 'Pull Back / Advance', nameZh: '闪回/潜进', ruby: '', rubyEn: '', baseType: 'normal', types: ['action', 'reaction'], text: 'ダスト→間合：1 ', textZh: '虚（1）→距', textEn: 'Shadow (1)→ Distance' },
    '06-yukihi-o-n-7': { megami: 'yukihi', name: 'えんむすび', nameEn: 'Bind', nameZh: '结缘', ruby: '', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時】間合→ダスト：1 \n【破棄時】ダスト→間合：1 \n【常時】あなたの傘が開いているならば、このカードの矢印(→)は逆になる。', textZh: '【展开时】距（1）→虚 \n【破弃时】虚（1）→距 \n【常时】如果你现在是开伞状态，那么这张卡上的所有箭头变为反向。', textEn: 'Initialize:\nDistance (1)→ Shadow\n\nDisenchant:\nShadow (1)→ Distance\n\nForced: If your umbrella is open, the arrows on this card are reversed.' },
    '06-yukihi-o-s-1': { megami: 'yukihi', name: 'はらりゆき', nameEn: 'Gentle Snow', nameZh: '纷扬如雪', ruby: '', rubyEn: '', baseType: 'special', types: ['attack'], range: '3-5', rangeOpened: '0-1', damage: '3/1', damageOpened: '0/0', cost: '2', text: '', textZh: '', textEn: '', textOpened: '----\n【即再起】あなたが傘の開閉を行う。 ', textOpenedZh: '----\n【即再起】进行伞的开合操作', textOpenedEn: '----\nImmediate Resurgence: You open or close your umbrella.' },
    '06-yukihi-o-s-2': { megami: 'yukihi', name: 'ゆらりび', nameEn: 'Swaying Flame', nameZh: '明灭如灯', ruby: '', rubyEn: '', baseType: 'special', types: ['attack'], range: '4-6', rangeOpened: '0', damage: '0/0', damageOpened: '4/5', cost: '5', text: '', textZh: '', textEn: '', textOpened: '', textOpenedZh: '', textOpenedEn: '' },
    '06-yukihi-o-s-3': { megami: 'yukihi', name: 'どろりうら', nameEn: 'Soft Heart', nameZh: '无常其心', ruby: '', rubyEn: '', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '7', cost: '3', text: '【展開中】あなたのユキヒの《攻撃》は傘を開いた状態と傘を閉じた状態両方の適正距離を持つ。', textZh: '【展开中】你的雪灯的攻击牌视为同时持有开伞与闭伞两边的攻击距离。', textEn: 'Ongoing: The Range of your attacks from Yukihi\'s cards are their Open and Closed Ranges combined.' },
    '06-yukihi-o-s-4': { megami: 'yukihi', name: 'くるりみ', nameEn: 'Abrupt Transformation', nameZh: '复返其身', ruby: '', rubyEn: '', baseType: 'special', types: ['action', 'reaction'], cost: '1', text: '傘の開閉を行う。 \nダスト→自オーラ：1', textZh: '进行伞的开合操作。\n虚（1）→自装', textEn: 'Open or close your umbrella.\n\nShadow (1)→ Your Aura' },
    '07-shinra-o-n-1': { megami: 'shinra', name: '立論', nameEn: 'Argue', nameZh: '立论', ruby: 'りつろん', rubyEn: '', baseType: 'normal', types: ['attack'], range: '2-7', damage: '2/-', text: '【常時】相手の山札に2枚以上のカードがあるならば、この《攻撃》はダメージを与える代わりに山札の上から2枚を伏せ札にする。', textZh: '【常时】如果对手的牌库中有两张以上的卡牌，那么作为造成伤害的代替，盖伏对方牌堆顶的两张牌。', textEn: 'Forced: If your opponent\'s deck has 2 or more cards, this attack puts the top 2 cards of your opponent\'s deck into their discard pile instead of dealing damage.' },
    '07-shinra-o-n-2': { megami: 'shinra', name: '反論', nameEn: 'Protest', nameZh: '反论', ruby: 'はんろん', rubyEn: '', baseType: 'normal', types: ['attack', 'reaction'], range: '2-7', damage: '1/-', text: '【攻撃後】対応した切札でなく、オーラへのダメージが3以上である《攻撃》のダメージを打ち消す。 \n【攻撃後】相手はカードを1枚引く。', textZh: '【攻击后】打消对应的王牌以外的对装造成3点伤害以上的攻击的伤害（攻击后依然生效）。\n【攻击后】对手抽一张牌。', textEn: 'After Attack: Cancel the damage of the non-Special attack you played this card as a Reaction to if that attack has 3 or more Damage to Aura.\n\nAfter Attack: Your opponent draws a card.' },
    '07-shinra-o-n-3': { megami: 'shinra', name: '詭弁', nameEn: 'Sophism', nameZh: '诡辩', ruby: 'きべん', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '3-8', damage: '-/1', text: '【攻撃後】計略を実行し、次の計略を準備する。 \n[神算] 相手の山札の上から3枚を伏せ札にする。 \n[鬼謀] 相手の捨て札にあるカードを1枚選び、それを使用してもよい。', textZh: '【攻击后】实行计略、准备下个计略。 \n神算：盖伏对手牌顶的三张牌。 \n鬼谋：你可以选择对手弃牌堆的一张卡并使用。', textEn: 'After Attack: Enact your current Plan, then prepare your next one.\n\nDivine - Put the top 3 cards of your opponent\'s deck into their discard pile.\n\nDevious - You may choose and play a card in your opponent\'s played pile.' },
    '07-shinra-o-n-4': { megami: 'shinra', name: '引用', nameEn: 'Replicate', nameZh: '引用', ruby: 'いんよう', rubyEn: '', baseType: 'normal', types: ['action'], text: '相手の手札を見て、《攻撃》カードを1枚選んでもよい。そうした場合、そのカードを使用するか伏せ札にする。その後、そのカードが《全力》を持つならば現在のフェイズを終了する。', textZh: '察看对手的手牌，你可以选择其中的一张攻击牌。然后要么使用它、要么将它设置为盖牌。如果选择的是全力卡，在结算完毕后结束当前阶段。', textEn: 'Look at your opponent\'s hand. You may choose an Attack card from it and either play it or put it into their discard pile. If you chose a Throughout card this way, end the current phase.' },
    '07-shinra-o-n-5': { megami: 'shinra', name: '煽動', nameEn: 'Agitate', nameZh: '煽动', ruby: 'せんどう', rubyEn: '', baseType: 'normal', types: ['action', 'reaction'], text: '計略を実行し、次の計略を準備する。 \n[神算] ダスト→間合：1 \n[鬼謀] 間合→相オーラ：1', textZh: '实行计略、准备下个计略。神算：虚（1）→距 鬼谋：距（1）→敌装', textEn: 'Enact your current Plan, then prepare your next one.\n\nDivine -\nShadow (1)→ Distance\n\nDevious -\nDistance (1)→ Opponent\'s Aura' },
    '07-shinra-o-n-6': { megami: 'shinra', name: '壮語', nameEn: 'Eloquence', nameZh: '壮语', ruby: 'そうご', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【破棄時】計略を実行し、次の計略を準備する。 \n[神算] あなたの集中力は1増加し、このカードを山札の一番上に置く。 \n[鬼謀] 相手は手札が2枚以上ならば、手札を1枚になるまで捨て札にする。相手の集中力は0になる。', textZh: '【破弃时】实行计略、准备下个计略。\n神算：你的集中力增加1，把这张牌置于牌堆顶。\n鬼谋：如果对手的手牌在两张以上、舍弃到对手只剩一张牌。对手的集中力变为0.', textEn: 'Disenchant: Enact your current Plan, then prepare your next one.\n\nDivine - Gain 1 Vigor. Put this card on the top of your deck.\n\nDevious - Your opponent\'s Vigor becomes 0. If they have 2 or more cards in hand, they must put cards from their hand into their played pile until they have 1 card in hand.' },
    '07-shinra-o-n-7': { megami: 'shinra', name: '論破', nameEn: 'Confuse', nameZh: '论破', ruby: 'ろんぱ', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '4', text: '【展開時】相手の捨て札にあるカード1枚を選び、このカードの下に封印する。 \n【破棄時】このカードに封印されたカードを相手の捨て札に戻す。', textZh: '【展开时】选择对手弃牌堆的一张卡，面朝上封印在该牌下。 \n【破弃时】归还被封印的卡到对手的弃牌堆。', textEn: 'Initialize: Choose a card in your opponent\'s played pile. Seal it.\n\nDisenchant: Put the sealed card in your opponent\'s played pile.', sealable: true },
    '07-shinra-o-s-1': { megami: 'shinra', name: '完全論破', nameEn: 'Shake the Mind', nameZh: '完全论破', ruby: 'かんぜんろんぱ', rubyEn: '', baseType: 'special', types: ['action'], cost: '4', text: '相手の捨て札にあるカード1枚を選び、このカードの下に封印する。 \n(ゲーム中に戻ることはない)', textZh: '选择对手弃牌堆的一张卡，面朝上封印在该牌下。（本局游戏不再归还）', textEn: 'Choose a card in your opponent\'s played pile. Seal it.', sealable: true },
    '07-shinra-o-s-2': { megami: 'shinra', name: '皆式理解', nameEn: 'Infer the Totality', nameZh: '诸式理解', ruby: 'かいしきりかい', rubyEn: '', baseType: 'special', types: ['action'], cost: '2', text: '計略を実行し、次の計略を準備する。 \n[神算] あなたの捨て札または使用済の切札から、消費を支払わずに《付与》カード1枚を使用する。そのカードが《全力》ならば現在のフェイズを終了する。 \n[鬼謀] 切札でない相手の付与札を1枚選ぶ。その上の桜花結晶全てをダストに送る。', textZh: '实行计略、准备下个计略。\n神算：选择1张你的弃牌区的付与牌或者使用后的王牌付与牌，不需要支付费用地使用它。如果选择的卡是全力牌，那么结束当前阶段。\n鬼谋：选择对手1张王牌以外的付与卡，将它上面的樱花结晶全部置入虚。', textEn: 'Enact your current Plan, then prepare your next one.\n\nDivine - Choose an Enhancement in your played pile, or one of your Devoted Special Enhancements. Play that card without paying its cost. If that card is Throughout, end the current phase.\n\nDevious - Choose one of your opponent\'s non-Special Enhancements. Move all Sakura tokens on it to Shadow.' },
    '07-shinra-o-s-3': { megami: 'shinra', name: '天地反駁', nameEn: 'Refute the World', nameZh: '天地反驳', ruby: 'てんちはんぱく', rubyEn: '', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '5', cost: '2', text: '【展開中】あなたの《攻撃》のオーラへのダメージとライフへのダメージを入れ替える。 \n（ダメージの入れ替えは、ダメージの増減より先に適用される）', textZh: '【展开中】交换你的攻击牌的甲和命的伤害值。（如果有修正的话，先结算交换）', textEn: 'Ongoing: Your attacks that deal damage to Aura(Life) deal damage to Life(Aura) instead.\n(This takes effect before any modifier to Damage is applied.)' },
    '07-shinra-o-s-4': { megami: 'shinra', name: '森羅判証', nameEn: 'Prove the Nature', nameZh: '森罗判证', ruby: 'しんらばんしょう', rubyEn: '', baseType: 'special', types: ['enhance'], capacity: '6', cost: '6', text: '【展開時】ダスト→自ライフ：2 \n【展開中】あなたの他の付与札が破棄された時、相手のライフに1ダメージを与える。 \n【破棄時】あなたは敗北する。', textZh: '【展开时】虚（2）→自命 \n【展开中】你的其他付与牌破弃时，给予对方1点命伤。\n 【破弃时】你输掉这局游戏。', textEn: 'Initialize:\nShadow (2)→ Your Life\n\nOngoing: Your other Enhancements gain "Disenchant: Deal 1 damage to your opponent\'s Life".\n\nDisenchant: You lose the game.' },
    '08-hagane-o-n-1': { megami: 'hagane', name: '遠心撃', nameEn: 'Centrifugal Swing', nameZh: '远心击', ruby: 'えんしんげき', rubyEn: '', baseType: 'normal', types: ['attack'], range: '2-6', damage: '5/3', text: '遠心 \n【攻撃後】現在のターンがあなたのターンならば、あなたと相手の手札を全て伏せ札にし、あなたの集中力は0になり、現在のフェイズを終了する。', textZh: '远心 \n【攻击后】如果现在的回合是你的回合的话，将你和对手的手牌全部盖伏，你的集中力变为0，结束当前阶段。', textEn: 'Centrifuge\n\nAfter Attack: If it is currently your turn, discard both players\' hands, your Vigor becomes 0, and end the current phase.' },
    '08-hagane-o-n-2': { megami: 'hagane', name: '砂風塵', nameEn: 'Scatter to the Winds', nameZh: '砂风尘', ruby: 'さふうじん', rubyEn: '', baseType: 'normal', types: ['attack'], range: '0-6', damage: '1/-', text: '【攻撃後】現在の間合がターン開始時の間合から2以上変化しているならば、相手の手札を1枚無作為に選び、それを捨て札にする。', textZh: '【攻击后】如果距离相比于回合开始时发生2以上的变化，对手随机弃一张手牌。', textEn: 'After Attack: If the difference between the current Distance and the Distance at the beginning of this turn is 2 or more, your opponent puts a random card from their hand into their played pile.' },
    '08-hagane-o-n-3': { megami: 'hagane', name: '大地砕き', nameEn: 'Earthshatter', nameZh: '大地碎击', ruby: 'だいちくだき', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '0-3', damage: '2/-', text: '対応不可 \n【攻撃後】相手の集中力は0になり、相手を畏縮させる。', textZh: '不可被对应 \n【攻击后】对手集中力变为0，对手畏缩。', textEn: 'No Reactions\n\nAfter Attack: Your opponent\'s Vigor becomes 0. Flinch your opponent.' },
    '08-hagane-o-n-4': { megami: 'hagane', name: '超反発', nameEn: 'Repulsion', nameZh: '超反发', ruby: 'ちょうはんぱつ', rubyEn: '', baseType: 'normal', types: ['action'], text: '現在の間合が4以下ならば、相フレア→間合：1', textZh: '如果当前的距离小于等于4，敌气（1）→距', textEn: 'If the current Distance is 4 or less:\nOpponent\'s Flare (1)→ Distance' },
    '08-hagane-o-n-5': { megami: 'hagane', name: '円舞錬', nameEn: 'Waltz of Steel', nameZh: '圆舞链', ruby: 'えんぶれん', rubyEn: '', baseType: 'normal', types: ['action'], text: '遠心 \n相手のフレアが3以上ならば、相フレア→自オーラ：2', textZh: '远心 如果敌人的气大于等于3，那么敌气（2）→自装', textEn: 'Centrifuge\n\nIf your opponent has 3 or more Sakura tokens on their Flare:\nOpponent\'s Flare (2)→ Your Aura' },
    '08-hagane-o-n-6': { megami: 'hagane', name: '鐘鳴らし', nameEn: 'Sound the Bell', nameZh: '大鸣钟', ruby: 'かねならし', rubyEn: '', baseType: 'normal', types: ['action'], text: '遠心 \n以下から１つを選ぶ。\n・このターンにあなたが次に行う《攻撃》は対応不可を得る。\n・このターンにあなたが次に行う《攻撃》はオーラへのダメージが3以上ならば+0/+1、そうでないならば+2/+0となる。', textZh: '远心 选择一下一项执行：\n1.本回合中，你的下一次攻击获得不可被对应\n2.本回合中，你的下一次攻击如果你对敌装造成大于等于3点的伤害，则+0/+1，否则+2/+0', textEn: 'Centrifuge\n\nChoose one:\n・Your next attack this turn gains No Reactions.\n・Your next attack this turn gains +0/+1 if it has 3 or more Damage to Aura. Otherwise, it gains +2/+0.' },
    '08-hagane-o-n-7': { megami: 'hagane', name: '引力場', nameEn: 'Gravity Well', nameZh: '引力场', ruby: 'いんりょくば', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '4', text: '【展開時】間合→ダスト：1 \n【展開中】達人の間合は1小さくなる。', textZh: '【展开时】距（1）→虚\n【展开中】达人距离的值减少1', textEn: 'Initialize:\nDistance (1)→ Shadow\n\nOngoing: Decrease the size of the Mastery Zone by 1.' },
    '08-hagane-o-s-1': { megami: 'hagane', name: '大天空クラッシュ', nameEn: 'Grand Firmament Crash', nameZh: '大天空·破限', ruby: 'だいてんくうクラッシュ', rubyEn: '', baseType: 'special', types: ['attack'], range: '0-10', damage: 'X/Y', cost: '5', text: '超克 \n【常時】Xは現在の間合がターン開始時の間合からどれだけ変化しているかに等しい。YはXの半分(切り上げ)に等しい。', textZh: '超克 \n【常时】X为本回合距离变化量，Y为二分之X（向上取整）', textEn: 'Overwhelm\n\nForced: X is the difference between the current Distance and the Distance at the beginning of this turn. Y is half of X, rounded up.' },
    '08-hagane-o-s-2': { megami: 'hagane', name: '大破鐘メガロベル', nameEn: 'Grand Bourdon Peal', nameZh: '大破钟·断限', ruby: 'だいはがねメガロベル', rubyEn: '', baseType: 'special', types: ['action'], cost: '2', text: 'あなたの他の切札が全て使用済ならば、ダスト→自ライフ：2', textZh: '如果你的其他王牌全部使用完，那么虚（2）→自命', textEn: 'If all your other Special cards are Devoted:\nShadow (2)→ Your Life' },
    '08-hagane-o-s-3': { megami: 'hagane', name: '大重力アトラクト', nameEn: 'Grand Gravity Attract', nameZh: '大重力·无限', ruby: 'だいじゅうりょくアトラクト', rubyEn: '', baseType: 'special', types: ['action'], cost: '5', text: '間合→自フレア：3 \n----\n【再起】このターンにあなたが遠心を持つカードを使用しており、このカードを使用していない。', textZh: '距离（3）→自气\n----\n【再起】这个回合内你使用了持有远心关键字的卡牌，并且没有使用这张牌。', textEn: 'Distance (3)→ Your Flare\n\nResurgence: You played a card with Centrifuge this turn.' },
    '08-hagane-o-s-4': { megami: 'hagane', name: '大山脈リスペクト', nameEn: 'Grand Sierra Respect', nameZh: '大山脉·转限', ruby: 'だいさんみゃくリスペクト', rubyEn: '', baseType: 'special', types: ['action'], cost: '4', text: '遠心 \nあなたの捨て札にある異なる《全力》でないカードを2枚まで選び、任意の順番で使用する。', textZh: '远心 \n选择你弃牌堆里至多两张不含有《全力》关键字的卡牌、以任意的顺序使用它们。', textEn: 'Centrifuge\n\nChoose up to two non-Throughout cards in your played pile. Play the chosen cards in any order.' },
    '09-chikage-o-n-1': { megami: 'chikage', name: '飛苦無', nameEn: 'Kunai Throw', nameZh: '飞苦无', ruby: 'とびくない', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4-5', damage: '2/2', text: '', textZh: '', textEn: '' },
    '09-chikage-o-n-2': { megami: 'chikage', name: '毒針', nameEn: 'Poison Needle', nameZh: '毒针', ruby: 'どくばり', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4', damage: '1/1', text: '【攻撃後】毒袋から「麻痺毒」「幻覚毒」「弛緩毒」のいずれか1枚を選び、そのカードを相手の山札の一番上に置く。', textZh: '【攻击后】从毒袋中选取麻痹毒、幻觉毒、迟缓毒中的一张置于对手的牌堆顶。', textEn: 'After Attack: Choose a "Numbing Agent", "Hallucinogen", or "Muscle Relaxant" in your pouch. Put it on top of your opponent\'s deck.' },
    '09-chikage-o-n-3': { megami: 'chikage', name: '遁術', nameEn: 'Concealment', nameZh: '遁术', ruby: 'とんじゅつ', rubyEn: '', baseType: 'normal', types: ['attack', 'reaction'], range: '1-3', damage: '1/-', text: '【攻撃後】自オーラ→間合：2 \n【攻撃後】このターン中、全てのプレイヤーは基本動作《前進》を行えない。', textZh: '【攻击后】自装（2）→距\n【攻击后】本回合内所有玩家都不能使用基本动作：《前进》', textEn: 'After Attack:\nYour Aura (2)→ Distance\n\nAfter Attack: Neither player can perform the Forward Movement basic action for the rest of the turn.' },
    '09-chikage-o-n-4': { megami: 'chikage', name: '首切り', nameEn: 'Behead', nameZh: '割喉', ruby: 'くびきり', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '0-3', damage: '2/3', text: '【攻撃後】相手の手札が2枚以上あるならば、相手は手札を1枚捨て札にする。', textZh: '【攻击后】如果对手的手牌数在2张及以上，对手选择一张弃置。', textEn: 'After Attack: If your opponent has 2 or more cards in their hand, they must put one of them into their played pile.' },
    '09-chikage-o-n-5': { megami: 'chikage', name: '毒霧', nameEn: 'Miasma', nameZh: '毒雾', ruby: 'どくぎり', rubyEn: '', baseType: 'normal', types: ['action'], text: '毒袋から「麻痺毒」「幻覚毒」「弛緩毒」のいずれか1枚を選び、そのカードを相手の手札に加える。', textZh: '在麻痹毒、幻觉毒、迟缓毒中选择一张置于对手的手牌中。', textEn: 'Choose a "Numbing Agent", "Hallucinogen", or "Muscle Relaxant" in your pouch. Put it into your opponent\'s hand.' },
    '09-chikage-o-n-6': { megami: 'chikage', name: '抜き足', nameEn: 'Silent Approach', nameZh: '奔跑', ruby: 'ぬきあし', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙 \n【展開中】現在の間合は2減少する。 \n(間合は0未満にならない)', textZh: '破绽\n【展开中】现在的距减少2（不会低于0）', textEn: 'Unguarded\n\nOngoing: Decrease the current Distance by 2 (to a minimum of 0).' },
    '09-chikage-o-n-7': { megami: 'chikage', name: '泥濘', nameEn: 'Quagmire', nameZh: '泥泞', ruby: 'でいねい', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開中】相手は基本動作《後退》と《離脱》を行えない。', textZh: '【展开中】对手不能使用基本动作：后退和离脱', textEn: 'Ongoing: Your opponent cannot perform the Backward Movement or Retreat basic actions.' },
    '09-chikage-o-s-1': { megami: 'chikage', name: '滅灯の魂毒', nameEn: 'Ruinous Soultoxin', nameZh: '灭灯的魂毒', ruby: 'ほろびのみたまどく', rubyEn: '', baseType: 'special', types: ['action'], cost: '3', text: '毒袋から「滅灯毒」を1枚を選び、そのカードを相手の山札の一番上に置く。', textZh: '将一张灭灯毒置于对手的牌堆顶', textEn: 'Choose a "Fading Light Toxin" in your pouch. Put it on top of your opponent\'s deck.' },
    '09-chikage-o-s-2': { megami: 'chikage', name: '叛旗の纏毒', nameEn: 'Treacherous Spiritquell', nameZh: '叛旗的缠毒', ruby: 'はんきのまといどく', rubyEn: '', baseType: 'special', types: ['enhance', 'reaction'], capacity: '5', cost: '2', text: '【展開中】相手によるオーラへのダメージかライフへのダメージのどちらかが「-」である《攻撃》は打ち消される。', textZh: '【展开中】打消对手使用的攻击力带有“-”的牌', textEn: 'Ongoing: Your opponent\'s attacks that have "-" Damage to Aura or Life are automatically cancelled.' },
    '09-chikage-o-s-3': { megami: 'chikage', name: '流転の霞毒', nameEn: 'Amorphous Mistbane', nameZh: '流转的霞毒', ruby: 'るてんのかすみどく', rubyEn: '', baseType: 'special', types: ['attack'], range: '3-7', damage: '1/2', cost: '1', text: '【再起】相手の手札が2枚以上ある。', textZh: '【再起】对手手牌大于等于2', textEn: 'Resurgence: Your opponent has 2 or more cards in their hand.' },
    '09-chikage-o-s-4': { megami: 'chikage', name: '闇昏千影の生きる道', nameEn: 'Chikage\'s Grim Path', nameZh: '暗昏千影的生存之道', ruby: 'やみくらちかげのいきるみち', rubyEn: '', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '4', cost: '5', text: '【展開中】あなたが1以上のライフへのダメージを受けた時、このカードの上の桜花結晶は全てダストに送られ、このカードは未使用に戻る。 \n(破棄時効果は失敗する) \n【破棄時】あなたの他の切札が全て使用済ならば、あなたは勝利する。', textZh: '【展开中】如果你受到大于等于1点的生命伤害，那么将此牌上的樱花结晶全部置入虚，并将它翻回为未使用状态。 （不产生破弃时效果）\n【破弃时】如果你的其它王牌均为已使用状态，那么你赢得这场游戏。', textEn: 'Ongoing: If you take 1 or more damage to your Life, move all Sakura tokens on this card to Shadow, then turn this card face-down. (Do not resolve its Disenchant effect.)\n\nDisenchant: If all your other Special cards are Devoted, you win the game.' },
    '09-chikage-o-p-1': { megami: 'chikage', name: '麻痺毒', nameEn: 'Numbing Agent', nameZh: '麻痹毒', ruby: 'まひどく', rubyEn: '', baseType: 'normal', extra: true, poison: true, types: ['action'], text: '毒（このカードは伏せ札にできない） \n【常時】このターン中にあなたが基本動作を行ったならば、このカードは使用できない。 \nこのカードを相手の毒袋に戻す。その後、このフェイズを終了する。', textZh: '【常时】如果本回合中你执行过基本动作，那么不能使用此牌。\n此牌使用后返回对手的毒袋。当前阶段立即结束。', textEn: 'Poison\n\nForced: You cannot play this card if you have performed any basic actions this turn.\n\nReturn this card to its pouch. End the current phase.' },
    '09-chikage-o-p-2': { megami: 'chikage', name: '幻覚毒', nameEn: 'Hallucinogen', nameZh: '幻觉毒', ruby: 'げんかくどく', rubyEn: '', baseType: 'normal', extra: true, poison: true, types: ['action'], text: '毒（このカードは伏せ札にできない） \nこのカードを相手の毒袋に戻す。 \n自フレア→ダスト：2', textZh: '此牌使用后返回对手的毒袋。 自气（2）→虚', textEn: 'Poison\n\nReturn this card to its pouch.\n\nYour Flare (2)→ Shadow' },
    '09-chikage-o-p-3': { megami: 'chikage', name: '弛緩毒', nameEn: 'Muscle Relaxant', nameZh: '迟缓毒', ruby: 'しかんどく', rubyEn: '', baseType: 'normal', extra: true, poison: true, types: ['enhance'], capacity: '3', text: '毒（このカードは伏せ札にできない） \n【展開中】あなたは《攻撃》カードを使用できない。 \n【破棄時】このカードを相手の毒袋に戻す。', textZh: '【展开中】你不能使用《攻击》卡。 \n【破弃时】返回对手的毒袋。', textEn: 'Poison\n\nOngoing: You cannot play Attack cards.\n\nDisenchant: Return this card to its pouch.' },
    '09-chikage-o-p-4': { megami: 'chikage', name: '滅灯毒', nameEn: 'Fading Light Toxin', nameZh: '灭灯毒', ruby: 'ほろびどく', rubyEn: '', baseType: 'normal', extra: true, poison: true, types: ['action'], text: '毒（このカードは伏せ札にできない） \n自オーラ→ダスト：3', textZh: '自装（3）→虚', textEn: 'Poison\n\nYour Aura (3)→ Shadow' },
    '10-kururu-o-n-1': { megami: 'kururu', name: 'えれきてる', nameEn: 'Elekiter', nameZh: '电气疗法', ruby: '', rubyEn: '', baseType: 'normal', types: ['action'], text: '----\n<行行行対対> 相手のライフに1ダメージを与える。 ', textZh: '机巧：蓝蓝蓝紫紫 对敌命造成1点伤害', textEn: 'Mechanism (ACT ACT ACT REA REA) - Deal 1 damage to your opponent\'s Life.' },
    '10-kururu-o-n-2': { megami: 'kururu', name: 'あくせらー', nameEn: 'Acceler', nameZh: '加束效应', ruby: '', rubyEn: '', baseType: 'normal', types: ['action'], text: '----\n<行行付> あなたの手札から《全力》カードを1枚選び、そのカードを使用してもよい。 \n(フェイズは終了しない) ', textZh: '机巧：蓝蓝绿 你可以从你的手牌中选择并使用一张《全力》牌（本阶段不会因此而结束）', textEn: 'Mechanism (ENH ACT ACT) - You may choose a Throughout card in your hand and play it.' },
    '10-kururu-o-n-3': { megami: 'kururu', name: 'くるるーん', nameEn: 'Kururu~n', nameZh: '枢噜噜～', ruby: '', rubyEn: '', baseType: 'normal', types: ['action', 'reaction'], text: '【常時】このカードは対応でしか使用できない。 \n以下から2つまでを選び、任意の順に行う。 \n(同じものを2回選ぶことはできない)\n・カードを1枚引く。\n・伏せ札1枚を山札の底に置く。\n・相手は手札を1枚捨て札にする。', textZh: '【常时】 非对应情况不能使用此卡。\n选择至多两项，以任意顺序进行（不能选择同一项2次）：\n抽1张牌。\n将一张盖牌置于牌堆底。\n对手选择一张手牌丢弃。', textEn: 'Forced: This card cannot be played except as a Reaction to an attack.\n\nChoose up to two. You may choose the same option more than once:\n・Draw a card.\n・Put a card from your discard pile to the bottom of your deck.\n・Your opponent puts a card from their hand into their played pile.' },
    '10-kururu-o-n-4': { megami: 'kururu', name: 'とるねーど', nameEn: 'Tornaydo', nameZh: '大龙卷轰', ruby: '', rubyEn: '', baseType: 'normal', types: ['action', 'fullpower'], text: '----\n<攻攻> 相手のオーラに5ダメージを与える。 \n----\n<付付> 相手のライフに1ダメージを与える。', textZh: '机巧：红红 对敌装造成5点伤害 \n机巧：绿绿 对敌命造成1点伤害', textEn: 'Mechanism (ATK ATK) - Deal 5 damage to your opponent\'s Aura.\n\n----------\n\nMechanism (ENH ENH) - Deal 1 damage to your opponent\'s Life.' },
    '10-kururu-o-n-5': { megami: 'kururu', name: 'りげいなー', nameEn: 'Regainah', nameZh: '回嗖利用', ruby: '', rubyEn: '', baseType: 'normal', types: ['action', 'fullpower'], text: '----\n<攻対> あなたの使用済の切札を1枚選んでもよい。そのカードを消費を支払わずに使用する。(《全力》カードでもよい) \n----\nあなたの集中力は0になる。', textZh: '机巧：红紫 你可以选择一张你的使用过的王牌，然后不需任何费用地使用它。（全力也可选） \n然后，你的集中力变为0。', textEn: 'Mechanism (ATK REA) - You may choose one of your Devoted Special cards. Play that card without paying its cost.\n\n----------\n\nYour Vigor becomes 0.' },
    '10-kururu-o-n-6': { megami: 'kururu', name: 'もじゅるー', nameEn: 'Mozule', nameZh: '模块化', ruby: '', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開中】あなたが《行動》カードを使用した時、その解決後に基本動作を1回行ってもよい。', textZh: '【展开中】当你使用完行动卡时，可以执行一次基础行动。', textEn: 'Ongoing: Whenever you play an Action card, you may perform a basic action after it resolves.' },
    '10-kururu-o-n-7': { megami: 'kururu', name: 'りふれくた', nameEn: 'Reflecta', nameZh: '反射', ruby: '', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '0', text: '----\n<攻対> 【展開時】このカードの上に桜花結晶を4個ダストから置く。 \n----\n【展開中】各ターンにおける相手の2回目の《攻撃》は打ち消される。\n', textZh: '机巧：红紫 从虚中拿取4个樱花结晶指示物放在这张卡上面。\n【展开中】 无效每回合中对手的第二次攻击。', textEn: 'Mechanism (ATK REA) - Initialize: Move 4 Sakura tokens from Shadow to this card.\n\n----------\n\nOngoing: Your opponent\'s second attack each turn is automatically cancelled.' },
    '10-kururu-o-s-1': { megami: 'kururu', name: 'どれーんでびる', nameEn: 'Drain Devil', nameZh: '魔能吸收', ruby: '', rubyEn: '', baseType: 'special', types: ['action', 'reaction'], cost: '2', text: '相オーラ→自オーラ：1 \n【使用済】あなたの使用済の切札が未使用に戻った時、このカードを消費を支払わずに使用してもよい。', textZh: '敌装（1）→自装 \n【使用后】当你使用过的王牌翻回未使用时，你可以使用这张牌，并且不需要支付费用。', textEn: 'Opponent\'s Aura (1)→ Your Aura\n\nDevoted: Whenever one of your Devoted Special cards is turned face-down, you may play this card without paying its cost.' },
    '10-kururu-o-s-2': { megami: 'kururu', name: 'びっぐごーれむ', nameEn: 'Big Golem', nameZh: '大魔像', ruby: '', rubyEn: '', baseType: 'special', types: ['action'], cost: '4', text: '----\n<対全全> 【使用済】あなたの終了フェイズに相手のライフに1ダメージを与えてもよい。そうした場合、山札を再構成する。 \n----\n【使用済】あなたが《全力》カードを使用した時、その解決後に基本動作を1回行ってもよい。\n', textZh: '机巧：黄黄紫 【使用后】当你回合结束时，你可以对敌命造成1点伤害。\n然后牌库重置。（不受到伤害）\n【使用后】当你使用全力牌后，可以进行一次基本动作。', textEn: 'Mechanism (REA THR THR) - Devoted: At the end of your turn, you may deal 1 damage to your opponent\'s Life. If you do, reshuffle your deck.\n\n----------\n\nDevoted: Whenever you play a Throughout card, you may perform a basic action after it resolves.' },
    '10-kururu-o-s-3': { megami: 'kururu', name: 'いんだすとりあ', nameEn: 'Industria', nameZh: '复自黏贴', ruby: '', rubyEn: '', baseType: 'special', types: ['action'], cost: '1', text: 'このカードにカードが封印されていないならば、あなたの手札から《付与》でないカードを1枚選び、そのカードをこのカードの下に表向きで封印してもよい。 \nあなたの追加札から「でゅーぷりぎあ」を山札の底に1枚置く(最大で合計3枚)。 \n----\n【即再起】あなたが山札を再構成する(再構成の後に未使用に戻る)。', textZh: '如果此牌下面没有封印牌，那么选择一张你手牌中的一张非付与牌正面朝上封印于此牌底。\n之后，将一张复制品齿轮牌置于牌堆底。（最多3张）\n【即再起】重铸牌库', textEn: 'If no card is sealed under this card, you may choose a non-Enhancement card in your hand and seal it under this card, face-up.\n\nPut one of your set aside "Dupligear" on the bottom of your deck.\n\nImmediate Resurgence: You reshuffle your deck.', sealable: true },
    '10-kururu-o-s-4': { megami: 'kururu', name: '神渉装置:枢式', nameEn: 'Godly Intervention Simulator: Kururu-Type', nameZh: '神涉装置：枢式', ruby: 'かんしょうそうち　くるるしき', rubyEn: '', baseType: 'special', types: ['action'], cost: '3', text: '----\n<攻攻行行行付付> 相手の切札を見て、その中から1枚選び、それを使用済にしてもよい。\n----\n相手の使用済の切札1枚を選んでもよい。そのカードを消費を支払わずに使用する(《全力》カードでもよい)。その後、このカードを取り除く。', textZh: '机巧：红红蓝蓝蓝绿绿 查看敌人的王牌，从中选择1张，将其变为使用后状态。 \n你可以选择并免费使用一张敌人已经使用过的王牌。（包括全力）那之后，将这张牌移出游戏。（效果不再生效）', textEn: 'Mechanism (ATK ATK ACT ACT ACT ENH ENH) - Look at your opponent\'s Special cards. You may choose one. That card becomes Devoted.\n\n----------\n\nYou may choose one of your oppponent\'s Devoted Special cards. Play that card without paying its cost. Remove this card from the game.', removable: true },
    '10-kururu-o-s-3-ex1': { megami: 'kururu', name: 'でゅーぷりぎあ', nameEn: 'Dupligear', nameZh: '复制品齿轮', ruby: '', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '10-kururu-o-s-4', types: ['variable'], text: '(カードタイプが不定のカードは使用できない) \n【常時】このカードはあなたの「いんだすとりあ」に封印されたカードの複製となる。但し、名前は変更されない。 \n(「いんだすとりあ」が未使用なら複製とならないので、使用できない)', textZh: '【常时】此牌是封印在复自黏贴下的衍生牌。当它未使用时，此牌不可使用。\n使用后，此卡变成被封印卡牌的同名卡，所有卡牌描述视为与原卡牌相同。', textEn: 'Forced: This card is a copy of the card sealed under your "Industria", except its name is still "Dupligear".\n(If your "Industria" is face-down, this does not copy anything and cannot be played.)' },
    '11-thallya-o-n-1': { megami: 'thallya', name: 'Burning Steam', nameEn: 'Burning Steam', nameZh: 'Burning Steam', ruby: 'バーニングスチーム', rubyEn: '', baseType: 'normal', types: ['attack'], range: '3-5', damage: '2/1', text: '【攻撃後】騎動を行う。', textZh: '【攻击后】骑动 ', textEn: 'After Attack: Maneuver.' },
    '11-thallya-o-n-2': { megami: 'thallya', name: 'Waving Edge', nameEn: 'Waving Edge', nameZh: 'Waving Edge', ruby: 'ウェービングエッジ', rubyEn: '', baseType: 'normal', types: ['attack'], range: '1-3', damage: '3/1', text: '燃焼 \n【攻撃後】騎動を行う。', textZh: ' 燃烧\n【攻击后】骑动', textEn: 'Combust\n\nAfter Attack: Maneuver.' },
    '11-thallya-o-n-3': { megami: 'thallya', name: 'Shield Charge', nameEn: 'Shield Charge', nameZh: 'Shield Charge', ruby: 'シールドチャージ', rubyEn: '', baseType: 'normal', types: ['attack'], range: '1', damage: '3/2', text: '燃焼 \n【常時】この《攻撃》のダメージにより移動する桜花結晶は、ダストやフレアでなく間合に動かす。', textZh: ' 燃烧\n【常时】因此牌的攻击造成伤害而移动樱花结晶时，将其移动至距。', textEn: 'Combust\n\nForced: Damage dealt by this attack moves Sakura tokens to Distance instead of to Shadow or to Flare.' },
    '11-thallya-o-n-4': { megami: 'thallya', name: 'Steam Cannon', nameEn: 'Steam Cannon', nameZh: 'Steam Cannon', ruby: 'スチームカノン', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '2-8', damage: '3/3', text: '燃焼', textZh: '燃烧', textEn: 'Combust' },
    '11-thallya-o-n-5': { megami: 'thallya', name: 'Stunt', nameEn: 'Stunt', nameZh: 'Stunt', ruby: 'スタント', rubyEn: '', baseType: 'normal', types: ['action'], text: '相手を畏縮させる。 \n自オーラ→自フレア：2', textZh: '自装（2）→自气 \n对手畏缩', textEn: 'Flinch your opponent.\n\nYour Aura (2)→ Your Flare' },
    '11-thallya-o-n-6': { megami: 'thallya', name: 'Roaring', nameEn: 'Roaring', nameZh: 'Roaring', ruby: 'ロアリング', rubyEn: '', baseType: 'normal', types: ['action'], text: 'コストとして、あなたのマシンにある造花結晶を2つ燃焼済にしても良い。そうした場合、あなたは集中力を1得て、相手は集中力を1失い、相手を畏縮させる。 \nコストとして、集中力を2支払ってもよい。そうした場合、あなたの燃焼済の造花結晶を3つ回復する。', textZh: '你可以燃烧两点造花结晶。若你这么做，则获得1点集中力，敌人失去1点集中力。对手畏缩。\n你可以支付2点集中力。若你这么做，则回复3点造花结晶。\n（这么描述的原因是，这卡可以空放，即不支付Cost，可以给枢妹子+1蓝指示物，而且因为不是抉择，所以可以两个都选）', textEn: 'You may burn 2 Artificial Sakura tokens on your machine. If you do, gain 1 Vigor, your opponent loses 1 Vigor, and flinch your opponent.\n\nYou may spend 2 Vigor. If you do, recover 3 burned Artificial Sakura tokens.' },
    '11-thallya-o-n-7': { megami: 'thallya', name: 'Turbo Switch', nameEn: 'Turbo Switch', nameZh: 'Turbo Switch', ruby: 'ターボスイッチ', rubyEn: '', baseType: 'normal', types: ['action', 'reaction'], text: '燃焼 \n騎動を行う。', textZh: '燃烧\n骑动', textEn: 'Combust\n\nManeuver.' },
    '11-thallya-o-s-1': { megami: 'thallya', name: 'Alpha-Edge', nameEn: 'Alpha-Edge', nameZh: 'Alpha-Edge', ruby: 'アルファエッジ', rubyEn: '', baseType: 'special', types: ['attack'], range: '1,3,5,7', damage: '1/1', cost: '1', text: '【即再起】あなたが騎動により間合を変化させる。', textZh: '【即再起】当你通过骑动使距离变化时', textEn: 'Immediate Resurgence: Your Maneuver changes the Distance.' },
    '11-thallya-o-s-2': { megami: 'thallya', name: 'Omega-Burst', nameEn: 'Omega-Burst', nameZh: 'Omega-Burst', ruby: 'オメガバースト', rubyEn: '', baseType: 'special', types: ['action', 'reaction'], cost: '4', text: 'あなたの燃焼済の造花結晶を全て回復する。 \n対応した、オーラへのダメージが「-」またはX以下の《攻撃》を打ち消す。Xはこのカードにより回復した造花結晶の個数に等しい。', textZh: '回复你所有燃烧过的造花结晶。取消对自装造成的“-”或小于等于X点伤害的攻击。\nX等于因此效果而回复的造花结晶个数。', textEn: 'Recover all your burned Artificial Sakura tokens.\n\nCancel the attack you played this as a Reaction to if its Damage to Aura is "-", or if its Damage to Aura is X or less. X is the number of Artificial Sakura tokens recovered by this card.' },
    '11-thallya-o-s-4': { megami: 'thallya', name: 'Julia\'s BlackBox', nameEn: 'Julia\'s BlackBox', nameZh: 'Julia\'s BlackBox', ruby: 'ジュリアズ　ブラックボックス', rubyEn: '', baseType: 'special', types: ['action', 'fullpower'], cost: '0', text: 'あなたのマシンに造花結晶がないならば、あなたのマシンはTransFormし、あなたの燃焼済の造花結晶を2つ回復する。そうでない場合、このカードを未使用に戻す。', textZh: '当你造花结晶为0时，TRANSFORM。然后回复两点造花结晶。不满足条件的场合，将这张卡设置回未使用状态。', textEn: 'If there are no Artificial Sakura tokens on your machine, TransForm it and recover 2 burned Artificial Sakura tokens. Otherwise, turn this card face-down.' },
    'transform-01': { megami: 'thallya', name: 'Form: YAKSHA', nameEn: 'Form: YAKSHA', nameZh: '亚克夏形态', ruby: 'フォルム:ヤクシャ', rubyEn: '', baseType: 'transform', types: ['transform'], text: '【変形時】相手は次の開始フェイズにカードを1枚しか引けない。相手を畏縮させる。\n----\n【常時】あなたのマシンに造花結晶がないならば、あなたは基本動作を行えない。\n----\n【追加基本行動：Beta-Edge】\n「適正距離2,4,6,8、2/1 【攻撃後】騎動を行う」の《攻撃》を行う。', textZh: '【变形时】对手的下个开始阶段少抽1张牌，对手畏缩。\n【常时】如果你没有造花结晶，那么你不可以执行基本动作。\n【追加基本动作】Beta-Edge：执行攻击『距离2,4,6,8、伤害2/1 【攻击后】骑动』', textEn: 'TransForm: Your opponent only draws 1 card during their next start of turn phase. Flinch your opponent.\n\nForced: You cannot perform basic actions if there are no Artificial Sakura tokens on your machine.\n\nAdditional basic action ("Beta-Edge"): You attack with "Range: 2, 4, 6, 8, Damage: 2/1, After Attack: Maneuver."' },
    'transform-02': { megami: 'thallya', name: 'Form: NAGA', nameEn: 'Form: NAGA', nameZh: '娜迦形态', ruby: 'フォルム:ナーガ', rubyEn: '', baseType: 'transform', types: ['transform'], text: '【変形時】相手のフレアが3以上ならば、フレアが2になるように桜花結晶をダストへ移動させる。\n----\n【追加基本行動：Gamma-Ray】\n相手の山札の一番上のカードを相手の捨て札に置く。', textZh: '【变形时】如果对手的气在3以上，将其中的樱花结晶移动至虚直至对手的气为2。\n【追加基本动作】Gamma-Ray：将敌人的牌堆顶置入弃牌堆。', textEn: 'TransForm: If your opponent has 3 or more Sakura tokens on their Flare, move all but 2 of them to Shadow.\n\nAdditional basic action ("Gamma-Ray"): Put the top card of your opponent\'s deck into their played pile.' },
    'transform-03': { megami: 'thallya', name: 'Form: GARUDA', nameEn: 'Form: GARUDA', nameZh: '迦楼达形态', ruby: 'フォルム:ガルーダ', rubyEn: '', baseType: 'transform', types: ['transform'], text: '【変形時】カードを2枚引き、このターンの間手札の上限が無くなる。\n----\n【常時】カードを2枚引き、このターンの間手札の上限が無くなる。\n----\n【追加基本行動：Delta-Wing】\n現在の間合が7以下ならば、ダスト→間合：1', textZh: '【变形时】抽两张牌。这个回合，手牌数没有上限。\n【追加基本动作】Delta-Wing：如果现在的距是7或者以下：虚（1）→距', textEn: 'TransForm: Draw two cards. You have no maximum hand size this turn.\n\nAdditional basic action ("Delta-Wing"): If the current Distance is 7 or less:\nShadow (1)→ Distance' },
    '12-raira-o-n-1': { megami: 'raira', name: '獣爪', nameEn: 'Bestial Claw', nameZh: '兽爪', ruby: 'じゅうそう', rubyEn: '', baseType: 'normal', types: ['attack'], range: '1-2', damage: '3/1', text: '', textZh: '', textEn: '' },
    '12-raira-o-n-2': { megami: 'raira', name: '風雷撃', nameEn: 'Wind and Thunder', nameZh: '风雷击', ruby: 'ふうらいげき', rubyEn: '', baseType: 'normal', types: ['attack'], range: '2', damage: 'X/2', text: '【常時】Xは風神ゲージと雷神ゲージのうち、小さい方の値である。', textZh: '【常时】X等于风神槽或者雷神槽中，数值较小的那个值。', textEn: 'Forced: X is equal to the lower of your Wind and Thunder God gauges.' },
    '12-raira-o-n-3': { megami: 'raira', name: '流転爪', nameEn: 'Claw of Regrowth', nameZh: '流转爪', ruby: 'るてんそう', rubyEn: '', baseType: 'normal', types: ['attack'], range: '1-2', damage: '2/1', text: '【攻撃後】あなたの捨て札にある《攻撃》カード1枚を選び、山札の一番上に置いてもよい。', textZh: '【攻击后】你可以选择一张你的弃牌堆里的攻击卡，将其置于牌堆顶。', textEn: 'After Attack: You may put an Attack card from your played pile on top of your deck.' },
    '12-raira-o-n-4': { megami: 'raira', name: '風走り', nameEn: 'Windrun', nameZh: '疾风步', ruby: 'かぜばしり', rubyEn: '', baseType: 'normal', types: ['action'], text: '現在の間合が3以上ならば、間合→ダスト：2', textZh: '如果当前的距离大于等于3，距（2）→虚', textEn: 'If the current Distance is 3 or more:\nDistance (2)→ Shadow' },
    '12-raira-o-n-5': { megami: 'raira', name: '風雷の知恵', nameEn: 'Wisdom of the Gods', nameZh: '风雷的知慧', ruby: 'ふうらいのちえ', rubyEn: '', baseType: 'normal', types: ['action'], text: '風神ゲージと雷神ゲージの合計が4以上ならば、あなたの捨て札にある他のメガミのカード1枚を選び、山札の一番上に置いてもよい。 \n風神ゲージか雷神ゲージを1上げる。', textZh: '如果风神槽和雷神槽的合计数值在4以上、你可以选择你弃牌堆中其他女神的一张卡，将其置于牌堆顶。选择风神槽或雷神槽上升1', textEn: 'If the total of your Wind and Thunder God gauges is 4 or more, you may put one of your other Megami\'s cards from your played pile on top of your deck.\n\nIncrease your Wind God or Thunder God gauge by 1.' },
    '12-raira-o-n-6': { megami: 'raira', name: '呼び声', nameEn: 'Roar', nameZh: '召唤之声', ruby: 'よびごえ', rubyEn: '', baseType: 'normal', types: ['action', 'fullpower'], text: '相手を畏縮させ、以下から1つを選ぶ。\n・風神ゲージと雷神ゲージを1ずつ上げる。\n・手札を全て伏せ札にし、雷神ゲージを2倍にする。', textZh: '对手畏缩。选择以下1项：\n风神槽和雷神槽各上升1\n将手牌全部盖伏，雷神槽变成2倍。', textEn: 'Flinch your opponent. Choose one:\n・Increase your Wind and Thunder God gauges by 1 each.\n・Discard your hand. Double your Thunder God gauge.' },
    '12-raira-o-n-7': { megami: 'raira', name: '空駆け', nameEn: 'Pounce', nameZh: '驭空术', ruby: 'そらかけ', rubyEn: '', baseType: 'normal', types: ['action', 'fullpower'], text: '間合⇔ダスト：3', textZh: '距（3）⇔ 虚', textEn: 'Distance (3)⇔ Shadow' },
    '12-raira-o-s-1': { megami: 'raira', name: '雷螺風神爪', nameEn: 'Stormcharged Claw', nameZh: '雷螺风神爪', ruby: 'らいらふうじんそう', rubyEn: '', baseType: 'special', types: ['attack'], range: '1-2', damage: '2/2', cost: '3', text: '【常時】あなたの雷神ゲージが4以上ならば、この《攻撃》は+1/+0となる。 \n----\n【再起】あなたの風神ゲージが4以上である。', textZh: '【常时】如果雷神槽在4以上，此攻击获得+1/+0 再起：风神槽在4以上', textEn: 'Forced: This attack gains +1/+0 if your Thunder God gauge is 4 or more.\n\nResurgence: Your Wind God gauge is 4 or more.' },
    '12-raira-o-s-2': { megami: 'raira', name: '天雷召喚陣', nameEn: 'Thundercall Ritual', nameZh: '天雷召唤阵', ruby: 'てんらいしょうかんじん', rubyEn: '', baseType: 'special', types: ['action', 'fullpower'], cost: '6', text: '攻撃『適正距離0-10、1/1』をX回行う。Xは雷神ゲージの半分(切り上げ)に等しい。', textZh: '进行X次“攻击距离0-10 1/1”的攻击。 X等于雷神槽的一半（向上取整）', textEn: 'You attack with "Range: 0-10, Damage: 1/1" X times, where X is equal to half your Thunder God gauge, rounded up.' },
    '12-raira-o-s-3': { megami: 'raira', name: '風魔招来孔', nameEn: 'Windbeast Invocation', nameZh: '风魔招来孔', ruby: 'ふうましょうらいこう', rubyEn: '', baseType: 'special', types: ['action'], cost: '0', text: '現在の風神ゲージに応じて、以下の切札を追加札から未使用で得る(条件を満たしたものは全て得る)。その後、このカードを取り除く。 \n3以上……風魔旋風 \n6以上……風魔纏廻 \n10以上……風魔天狗道', textZh: '根据现在的风神槽的值，以未使用状态获得以下追加卡（满足条件的卡都可以获得），那之后，把这张卡移出游戏。\n3以上……风魔旋风\n6以上……风魔缠回\n10以上……风魔天狗道', textEn: 'Based on your Wind God gauge, add your set aside "Windbeast" cards to your Special cards, face-down. Remove this card from the game.\n3 or more: Windbeast Manifestation\n6 or more: Windbeast Reincarnation\n10 or more: Windbeast Perdition\n(Add all cards you meet the requirement for.)', removable: true },
    '12-raira-o-s-4': { megami: 'raira', name: '円環輪廻旋', nameEn: 'Death and Rebirth', nameZh: '圆环轮回旋', ruby: 'えんかんりんかいせん', rubyEn: '', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '5', cost: '3', text: '【展開中】あなたが《付与》でない通常札を使用した場合、それを捨て札にする代わりに山札の底に置く。', textZh: '你使用付与牌以外的通常卡后，作为代替将其置于牌堆底而不是弃牌堆。', textEn: 'Ongoing: Whenever you play a non-Special, non-Enhancement card, put that card on the bottom of your deck instead of into your played pile after it resolves.' },
    '12-raira-o-s-3-ex1': { megami: 'raira', name: '風魔旋風', nameEn: 'Windbeast Manifestation', nameZh: '风魔旋风', ruby: 'ふうませんぷう', rubyEn: '', baseType: 'special', extra: true, extraFrom: '12-raira-o-s-3', types: ['attack'], range: '1-3', damage: '1/2', cost: '1', text: '', textZh: '', textEn: '' },
    '12-raira-o-s-3-ex2': { megami: 'raira', name: '風魔纏廻', nameEn: 'Windbeast Reincarnation', nameZh: '风魔缠回', ruby: 'ふうまてんかい', rubyEn: '', baseType: 'special', extra: true, extraFrom: '12-raira-o-s-3', types: ['action'], cost: '1', text: 'あなたの使用済の切札を1枚選び、それを未使用に戻す。 \n【使用済】あなたの切札の消費は1少なくなる(0未満にはならない)。', textZh: '选择一张你的使用后的王牌，将其设置为未使用状态。【使用后】你的王牌的消费减少1（不会少于0）', textEn: 'Turn one of your Devoted Special cards face-down.\n\nDevoted: Your Special cards cost 1 less Flare (to a minimum of 0).' },
    '12-raira-o-s-3-ex3': { megami: 'raira', name: '風魔天狗道', nameEn: 'Windbeast Perdition', nameZh: '风魔天狗道', ruby: 'ふうまてんぐどう', rubyEn: '', baseType: 'special', extra: true, extraFrom: '12-raira-o-s-3', types: ['action', 'reaction'], cost: '4', text: 'ダスト⇔間合：5 \nあなたはこの効果で本来より少ない個数の桜花結晶を動かしてもよい。その後、このカードを取り除く。', textZh: '距(5)⇔ 虚\n你可以移动比记述于这张卡上的樱花结晶少的任意个数的樱花结晶。\n那之后，将这张卡移出游戏。', textEn: 'Distance (5)⇔ Shadow\nYou may choose to move fewer than 5 Sakura tokens with this effect.\n\nRemove this card from the game.', removable: true },
    '13-utsuro-o-n-1': { megami: 'utsuro', name: '円月', nameEn: 'Full Moon', nameZh: '圆月', ruby: 'えんげつ', rubyEn: '', baseType: 'normal', types: ['attack'], range: '6-7', damage: '2/2', text: '【常時】灰塵-ダストが12以上ならば、この《攻撃》のオーラへのダメージは「-」になる。', textZh: '【常时】灰尘 这张牌对装的伤害视为“-”', textEn: 'Forced: Ashen - If there are 12 or more Sakura tokens on Shadow, this attack\'s Damage to Aura becomes "-".' },
    '13-utsuro-o-n-2': { megami: 'utsuro', name: '黒き波動', nameEn: 'Dark Pulse', nameZh: '黑之波动', ruby: 'くろきはどう', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4-7', damage: '1/2', text: '【攻撃後】相手がオーラへのダメージを選んだならば、相手の手札を見てその中から1枚を選び、それを捨て札にする。', textZh: '【攻击后】若对手对于这次攻击选择由装承受伤害，察看对手的手牌，选择其中一张丢弃。', textEn: 'After Attack: If your opponent chose to take damage to Aura, look at their hand. Choose a card from it and put it into their played pile.' },
    '13-utsuro-o-n-3': { megami: 'utsuro', name: '刈取り', nameEn: 'Reap', nameZh: '收割', ruby: 'かりとり', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4', damage: '-/0', text: '【攻撃後】相手は相手のオーラ、フレア、ライフのいずれかから桜花結晶を合計2つダストへ移動させる。 \n【攻撃後】相手の付与札を1枚選んでもよい。そうした場合、その付与札の上から桜花結晶を2つダストへ送る。', textZh: '【攻击后】对手从对手的装、气、命三个区域中选择合计2个樱花结晶移动到虚。\n【攻击后】选择对手的一张付与牌，移除其上的两个樱花结晶。', textEn: 'After Attack: Your opponent moves a total of 2 Sakura tokens from their Aura, Flare, and Life to Shadow, in any combination.\n\nAfter Attack: You may choose one of your opponent\'s Enhancements. If you do, move 2 Sakura tokens from it to Shadow.' },
    '13-utsuro-o-n-4': { megami: 'utsuro', name: '重圧', nameEn: 'Pressure', nameZh: '重压', ruby: 'じゅうあつ', rubyEn: '', baseType: 'normal', types: ['action'], text: '相手は相手のオーラ、フレア、ライフのいずれかから桜花結晶を1つダストへ移動させる。 \n灰塵-ダストが12以上ならば、相手を畏縮させる。', textZh: '对手从对手的装、气、命三个区域中选择1个樱花结晶移动到虚。 灰尘-若虚中有12个樱花结晶，对手畏缩。', textEn: 'Your opponent moves 1 Sakura token from their Aura, Flare, or Life to Shadow.\n\nAshen - If there are 12 or more Sakura tokens on Shadow, flinch your opponent.' },
    '13-utsuro-o-n-5': { megami: 'utsuro', name: '影の翅', nameEn: 'Shadow Wing', nameZh: '影之翅', ruby: 'かげのはね', rubyEn: '', baseType: 'normal', types: ['action'], text: 'このターン中、現在の間合は2増加し、達人の間合は2大きくなる。', textZh: '这个回合内，现在的距增加2，达人间合增加2.', textEn: 'For the rest of the turn, the current Distance is increased by 2, and the size of the Mastery Zone is increased by 2.' },
    '13-utsuro-o-n-6': { megami: 'utsuro', name: '影の壁', nameEn: 'Shadow Wall', nameZh: '影之壁', ruby: 'かげのかべ', rubyEn: '', baseType: 'normal', types: ['action', 'reaction'], text: '対応した《攻撃》は+0/-1となる。', textZh: '对应的攻击获得-0/-1', textEn: 'The attack this card was played as a Reaction to gets +0/-1.' },
    '13-utsuro-o-n-7': { megami: 'utsuro', name: '遺灰呪', nameEn: 'Curse of Ashes', nameZh: '遗灰咒', ruby: 'いかいじゅ', rubyEn: '', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '2', text: '【展開時】相オーラ→ダスト：3 \n【破棄時】灰塵-ダストが12以上ならば以下を行う。 \nダスト→相オーラ：2、相ライフ→ダスト：1', textZh: '【展开时】敌装（3）→虚 \n【破弃时】灰尘 虚（2）→敌装 敌命（1）→虚', textEn: 'Initialize: Opponent\'s Aura (3)→ Shadow\n\nDisenchant: Ashen - If there are 12 or more Sakura tokens on Shadow:\nShadow (3)→ Opponent\'s Aura\nOpponent\'s Life (1)→ Shadow' },
    '13-utsuro-o-s-1': { megami: 'utsuro', name: '灰滅', nameEn: 'вымирание', nameZh: '灰灭', ruby: 'ヴィミラニエ', rubyEn: 'vymiraniye', baseType: 'special', types: ['action'], cost: '24', text: '【常時】このカードの消費はダストの数だけ少なくなる。 \n相ライフ→ダスト：3 \nこのカードを取り除く。', textZh: '【常时】这张卡的消费减去当前的虚中樱花结晶的数量 敌命（3）→虚 然后将这张卡除外。', textEn: 'Forced: This card costs 1 less for each Sakura token on Shadow.\n\nOpponent\'s Life (3)→ Shadow\n\nRemove this card from the game.', removable: true },
    '13-utsuro-o-s-2': { megami: 'utsuro', name: '虚偽', nameEn: 'Ложь', nameZh: '虚伪', ruby: 'ローシェ', rubyEn: 'Lozh\'', baseType: 'special', types: ['enhance', 'reaction'], capacity: '3', cost: '3', text: '【展開中】相手の《攻撃》は距離縮小(近1)を得て、【攻撃後】効果が解決されない。 \n【展開中】相手の《付与》カードは納が1減少し、【破棄時】効果が解決されない。', textZh: '【展开中】对手的攻击获得距离缩小（近1），并且不结算攻击后效果。\n【展开中】对手的付与牌减少1点纳，并且不结算破弃时效果。', textEn: 'Ongoing: All your opponent\'s attacks have their Ranges reduced by 1 in the close direction, and lose their After Attack effects.\n\nOngoing: All your opponent\'s Enhancements have their Charges reduced by 1, and lose their Disenchant effects.' },
    '13-utsuro-o-s-3': { megami: 'utsuro', name: '終末', nameEn: 'Конец', nameZh: '终末', ruby: 'カニェッツ', rubyEn: 'Konets', baseType: 'special', types: ['enhance'], capacity: '3', cost: '2', text: '【展開中】あなたに1以上のダメージを与えた《攻撃》の解決後に、このカードの上の桜花結晶を全てをダストに送る。 \n【破棄時】現在のフェイズを終了する。 \n----\n【再起】灰塵-ダストが12以上である。', textZh: '【展开中】对你造成大于等于1点伤害的攻击被处理后，将此牌上所有的樱花结晶置入虚。\n【破弃时】强制结束当前阶段\n【再起】灰尘', textEn: 'Ongoing: When you are dealt 1 or more damage from an attack, move all Sakura tokens on this card to Shadow.\n\nDisenchant: End the current phase.\n\nResurgence: Ashen - There are 12 or more Sakura tokens on Shadow.' },
    '13-utsuro-o-s-4': { megami: 'utsuro', name: '魔食', nameEn: 'Эрозия', nameZh: '魔食', ruby: 'エロージャ', rubyEn: 'Eroziya', baseType: 'special', types: ['action'], cost: '5', text: '【使用済】あなたの開始フェイズの開始時に相手は以下のどちらかを選ぶ。\n・相オーラ→ダスト：1\n・相フレア→ダスト：2', textZh: '【使用后】在你的回合开始时，敌人选择一下之一执行：\n1.敌装（1）→虚\n2.敌气（2）→虚', textEn: 'Devoted: At the beginning of your turn, your opponent chooses one:\n・Opponent\'s Aura (1)→ Shadow\n・Opponent\'s Flare (2)→ Shadow' }
};
// シーズン3
exports.S3_UPDATED_CARD_DATA = {
    '02-saine-o-n-3': { megami: 'saine', name: '石突き', nameEn: 'Hilt Slam', nameZh: '岩突', ruby: 'いしづき', rubyEn: '', baseType: 'normal', types: ['attack', 'reaction'], range: '2-3', damage: '2/1', text: '【攻撃後】八相-あなたのオーラが0ならば、ダスト→間合：1', textZh: '【攻击后】八相-如果你的装中没有樱花结晶，那么虚（1）→距', textEn: 'After Attack: Idea - If you have Sakura tokens on your Aura:\n\nShadow (1)→ Distance' },
    '02-saine-o-n-6': { megami: 'saine', name: '衝音晶', nameEn: 'Wavering Crystal', nameZh: '冲音晶', ruby: 'しょうおんしょう', rubyEn: '', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '1', text: '【展開時】対応した《攻撃》は-1/+0となる。\n【破棄時】攻撃『適正距離0-10、1/-、対応不可』を行い、ダスト→間合：1', textZh: '【展开时】对应的攻击获得-1/-0 \n【破弃时】进行一次“攻击距离0-10 伤害1/- 不可被对应”的攻击。然后虚（1）→距', textEn: 'Initialize: The attack you played this card as a Reaction to gets -1/+0.\n\nDisenchant: You attack with "Range: 0-10, Damage: 1/-, No Reactions". Then:\nShadow (1)→ Distance.' },
    '04-tokoyo-A1-n-7': null,
    '04-tokoyo-A1-n-5': { megami: 'tokoyo', anotherID: 'A1', replace: '04-tokoyo-o-n-5', name: '陽の音', nameEn: 'Sound of Sun', nameZh: '阳之音', ruby: 'ひのね', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開中】あなたが《対応》カードを使用した時、その解決後にダスト→自オーラ：1 \n【展開中】相手のターンにこのカードの上の桜花結晶は移動しない。', textZh: '【展开中】每当你打出对应卡牌时，在效果结算后，虚（1）→自装\n【展开中】在对手的回合，这张牌上的樱花结晶不会被移除。', textEn: 'Ongoing: Whenever you play a Reaction card, after that card resolves:\nShadow (1)→ Your Aura\n\nOngoing: Sakura tokens cannot leave this card on your opponent\'s turn.' },
    '04-tokoyo-A1-s-2': { megami: 'tokoyo', anotherID: 'A1', replace: '04-tokoyo-o-s-2', name: '二重奏:吹弾陽明', nameEn: 'Duet: Radiant Luminosity', nameZh: '二重奏：吹弹阳明', ruby: 'にじゅうそう：すいだんようめい', rubyEn: '', baseType: 'special', types: ['action'], cost: '1', text: '【使用済】あなたの開始フェイズの開始時に以下のどちらかを行ってもよい。\n・あなたの伏せ札からカード1枚を選び、山札の底に置く。 \n・あなたの捨て札から《行動》カード1枚を選び、山札の底に置く。 \n----\n【即再起】あなたが再構成以外でライフに1以上のダメージを受ける。', textZh: '【使用后】在你的回合开始阶段开始时，选择以下一项执行：\n·选择你盖牌区中的一张牌，将其置于牌堆底。\n·选择你弃牌区的一张行动牌，将其置于牌堆底。\n----\n【即再起】你受到牌库重置以外的1点伤害。', textEn: 'Devoted: At the beginning of your turn, you may choose one:\n・Put a card from your discard pile on the bottom of your deck.\n・Put an Action card from your played pile on the bottom of your deck.\n----\nImmediate Resurgence: You take 1 or more damage to your Life, excluding reshuffle damage.' },
    '05-oboro-o-n-4': { megami: 'oboro', name: '忍歩', nameEn: 'Ninpo-Walk', nameZh: '忍步', ruby: 'にんぽ', rubyEn: '', baseType: 'normal', types: ['action'], text: '設置 \nダスト→間合：1 \nこのカードを伏せ札から使用したならば、伏せ札から設置を持つカードを1枚使用してもよい。', textZh: '设置\n虚 (1)→ 距\n如果这张牌从盖牌区使用，可以再从盖牌区中选择一张带有设置关键字的卡牌使用。', textEn: 'Trap\n\nShadow (1)→ Distance\n\nIf this card was played from your discard pile, you may play a card with Trap from your discard pile.' },
    '05-oboro-o-s-2': { megami: 'oboro', name: '鳶影', nameEn: 'Tobi-Kage', nameZh: '鸢影', ruby: 'とびかげ', rubyEn: '', baseType: 'special', types: ['action', 'reaction'], cost: '4', text: '伏せ札から《全力》でないカードを1枚選び、そのカードを使用してもよい。この際、このカードが対応している《攻撃》があるならば、使用されたカードはそれに対応しているものと扱う。', textZh: '选择盖牌区一张《全力》以外的卡使用。在这时，如果这张牌是对应《攻击》打出的话，那么你翻出的那张卡视为对应了那个攻击。', textEn: 'Reveal a non-Throughout card in your discard pile and play it. If this card was played as a Reaction to an attack, treat that card as if it were played as a Reaction to that attack.' },
    '05-oboro-o-s-4': { megami: 'oboro', name: '壬蔓', nameEn: 'Mi-Kazura', nameZh: '壬蔓', ruby: 'みかずら', rubyEn: '', baseType: 'special', types: ['attack'], range: '3-7', damage: '1/1', cost: '0', text: 'ダスト→自フレア：1 \n----\n【再起】あなたのフレアが0である。', textZh: '虚（1）→自气 \n----\n【再起】自气为0', textEn: 'After Attack: Shadow (1)→ Your Flare\n----\nResurgence: There are no Sakura tokens on your Flare.' },
    '07-shinra-o-n-6': { megami: 'shinra', name: '壮語', nameEn: 'Eloquence', nameZh: '壮语', ruby: 'そうご', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【破棄時】計略を実行し、次の計略を準備する。 \n[神算] あなたは集中力を1得て、このカードを山札の一番上に置く。 \n[鬼謀] 相手の手札が1枚以下ならば、相手を畏縮させ、相手はカードを3枚引き、相手は手札を2枚捨て札にする。', textZh: '【破弃时】实行计略、准备下个计略。\n[神算]你获得1点集中力，将这张卡置于牌堆顶。\n[鬼谋]如果对手的手牌在1张以下，那么对手畏缩，对手抽3张牌，然后舍弃其中两张。', textEn: 'Disenchant: Enact your current Plan, then prepare your next one.\n\nDivine - Gain 1 Vigor. Put this card on the top of your deck.\n\nDevious - If your opponent has 1 or fewer cards in hand, flinch them, they draw 3 cards, then they discard 2 cards.' },
    '11-thallya-o-s-3': { megami: 'thallya', name: 'Thallya\'s Masterpiece', nameEn: 'Thallya\'s Masterpiece', nameZh: 'Thallya\'s Masterpiece', ruby: 'サリヤズ　マスターピース', rubyEn: '', baseType: 'special', types: ['action'], cost: '1', text: '【使用済】あなたのターンに、あなたが基本動作以外の方法で騎動を行い、間合を変化させるたびに\nダスト⇔間合：1 \nを行ってもよい。', textZh: '【使用后】在你的回合内，你使用基本动作以外的方法骑动改变距离时，可以选择：\n虚（1）⇔ 距', textEn: 'Devoted: During your turn, whenever your non-basic action Maneuver changes the Distance, you may:\nShadow (1)⇔ Distance' },
    '11-thallya-o-s-4': { megami: 'thallya', name: 'Julia\'s BlackBox', nameEn: 'Julia\'s BlackBox', nameZh: 'Julia\'s BlackBox', ruby: 'ジュリアズ　ブラックボックス', rubyEn: '', baseType: 'special', types: ['action', 'fullpower'], cost: '2', text: 'あなたのマシンに造花結晶がないならば、あなたのマシンはTransFormし、あなたの燃焼済の造花結晶を2つ回復する。そうでない場合、このカードを未使用に戻す。', textZh: '当你造花结晶为0时，TRANSFORM。然后回复两点造花结晶。不满足条件的场合，将这张卡设置回未使用状态。', textEn: 'If there are no Artificial Sakura tokens on your machine, TransForm it and recover 2 burned Artificial Sakura tokens. Otherwise, turn this card face-down.' },
    '05-oboro-A1-n-2': { megami: 'oboro', anotherID: 'A1', replace: '05-oboro-o-n-2', name: '手裏剣', nameEn: 'Shuriken', nameZh: '手里剑', ruby: 'しゅりけん', rubyEn: '', baseType: 'normal', types: ['attack'], range: '3-5', damage: '2/1', text: '【常時】あなたの終了フェイズに両者の伏せ札が合計5枚以上あるならば、このカードを捨て札から手札に戻してもよい。', textZh: '【常时】在你的回合结束阶段，如果双方的盖牌区的卡的数量在5张以上，则你可以将这张牌从弃牌堆中置入手牌。', textEn: 'Forced: At the end of your turn, if there are 5 or more cards in both players\' discard piles combined, you may return this card from your played pile to your hand.' },
    '05-oboro-A1-n-3': { megami: 'oboro', anotherID: 'A1', replace: '05-oboro-o-n-3', name: '不意打ち', nameEn: 'Sneak Attack', nameZh: '不意之击', ruby: 'ふいうち', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '1-4', damage: '4/3', text: '対応不可（通常札） \n【常時】この《攻撃》は-X/+0となる。Xは相手の伏せ札の枚数に等しい。', textZh: '不可被对应（通常卡）\n【常时】此《攻击》获得-X/+0.X等同于对手的盖牌区的卡的数量。', textEn: 'No Reactions (Normal)\n\nForced: This attack gets -X/+0. X is the number of cards in your opponent\'s discard pile.' },
    '05-oboro-A1-s-4': { megami: 'oboro', anotherID: 'A1', replace: '05-oboro-o-s-4', name: '神代枝', nameEn: 'Twig of the Sacred Sakura', nameZh: '神代枝', ruby: 'かみしろのえ', rubyEn: '', baseType: 'special', exchangableTo: '05-oboro-A1-s-4-ex1', types: ['action', 'fullpower'], cost: '0', text: 'ゲーム外→自オーラ：1 \nゲーム外→自フレア：1 \nこのカードを取り除き、切札「最後の結晶」を追加札から未使用で得る。', textZh: '游戏外（1）→自装\n游戏外（1）→自气\n然后将这张牌从游戏中除外，将追加卡“最后的结晶”以未使用状态获得。', textEn: 'Out-of-Game (1)→ Your Aura\nOut-of-Game (1)→ Your Flare\n\nRemove this card from the game. Add your set aside "The Final Petal" to your Special cards, face-down.', removable: true },
    '05-oboro-A1-s-4-ex1': { megami: 'oboro', anotherID: 'A1', replace: '', name: '最後の結晶', nameEn: 'The Final Petal', nameZh: '最后的结晶', ruby: 'さいごのけっしょう', rubyEn: '', baseType: 'special', extra: true, extraFrom: '05-oboro-A1-s-4', types: ['action'], cost: '2', text: '【常時】このカードは通常の方法では使用できない。あなたが初めて敗北するならば、代わりにこのカードを使用してもよい(消費は支払う)。 \nダスト→自ライフ：1', textZh: '【常时】这张牌不能以通常方法使用。当你第一次输掉这场游戏时，作为败北的代替可以使用这张牌。（需要支付费用）\n虚（1）→自命', textEn: 'Forced: This card has no effect when played normally. When you would lose the game for the first time, instead you may play this card (paying its cost).\n\nShadow (1)→ Your Life' },
    '09-chikage-A1-n-5': { megami: 'chikage', anotherID: 'A1', replace: '09-chikage-o-n-5', name: '仕掛け番傘', nameEn: 'Disguised Blade', nameZh: '油伞突刺', ruby: 'しかけばんがさ', rubyEn: '', baseType: 'normal', types: ['attack'], range: '4', damage: '2/1', text: '不可避 \n【常時】相手の手札が2枚以上あるならば、この《攻撃》は距離拡大(近2)と距離拡大(遠2)を得る。 \n(他に何もなければ、適正距離は2-6になる)', textZh: '不可被闪避\n【常时】如果对手的手牌在2张以上，此攻击获得距离扩大（近2、远2）', textEn: 'Unavoidable\n\nForced: If your opponent has 2 or more cards in hand, increase the Range of this attack by 2 in both the near and distant directions.' },
    '09-chikage-A1-n-6': { megami: 'chikage', anotherID: 'A1', replace: '09-chikage-o-n-6', name: '奮迅', nameEn: 'Surge of Vitality', nameZh: '奋迅', ruby: 'ふんじん', rubyEn: '', baseType: 'normal', types: ['action'], text: '相手の手札が2枚以上あるならば、あなたは集中力を1得る。 \n間合⇔ダスト：1', textZh: '如果对手的手牌在2张以上，你获得1点集中力。\n距（1）⇔虚', textEn: 'If your opponent has 2 or more cards in hand, gain 1 Vigor.\n\nDistance (1)⇔ Shadow' },
    '09-chikage-A1-s-4': { megami: 'chikage', anotherID: 'A1', replace: '09-chikage-o-s-4', name: '残滓の絆毒', nameEn: 'Vestigial Bondrot', nameZh: '残渣的绊毒', ruby: 'ざんしのきずなどく', rubyEn: '', baseType: 'special', types: ['attack'], range: '0-1', damage: '4/X', cost: '5', text: '【常時】Xは相手の手札にあるカードの枚数の2倍に等しい。', textZh: '【常时】X等同于对手手牌数量的两倍。', textEn: 'Forced: X is twice the number of cards in your opponent\'s hand.' },
    '13-utsuro-A1-n-2': { megami: 'utsuro', anotherID: 'A1', replace: '13-utsuro-o-n-2', name: '蝕みの塵', nameEn: 'Gnawing Dust', nameZh: '侵蚀之尘', ruby: 'むしばみのちり', rubyEn: '', baseType: 'normal', types: ['attack'], range: '3-6', damage: '2/0', text: '【攻撃後】相手がライフへのダメージを選んだならば、相フレア→ダスト：2', textZh: '【攻击后】对手若选择以命承受伤害，敌气（2）→虚', textEn: 'After Attack: If your opponent chose to take damage to Life:\n\nOpponent\'s Flare (2)→ Shadow' },
    '13-utsuro-A1-s-1': { megami: 'utsuro', anotherID: 'A1', replace: '13-utsuro-o-s-1', name: '残響装置:枢式', nameEn: 'Reverberation Device: Kururu-Type', nameZh: '残响装置：枢式', ruby: 'ざんきょうそうち　くるるしき', rubyEn: '', baseType: 'special', types: ['action'], cost: '2', text: '相手のライフが8以上ならば、相ライフ→ダスト：1 \n【使用済】あなたか相手の終了フェイズにダストが13以上ならば、終焉の影が蘇る。その後、このカードを取り除き、あなたの追加札から切札「望我」を使用済で得て、カードを1枚引く。', textZh: '若对手的命在8以上，敌命（1）→虚\n【使用后】在双方的回合结束阶段，如果虚中的樱花结晶在13个以上，终焉之影苏醒。那之后，将这张牌从游戏中除外，以使用后状态获得追加卡“欲望”，并抽1张牌。', textEn: 'If your opponent\'s Life is 8 or more:\nOpponent\'s Life (1)→ Shadow\n\nDevoted: At the end of each player\'s turn, if there are 13 or more Sakura tokens on Shadow, the end is nigh. Remove this card from the game. Add your set aside "желание" to your Special cards, face-up (Devoted). Draw a card.', removable: true },
    '13-utsuro-A1-s-1-ex1': { megami: 'utsuro', anotherID: 'A1', replace: '', name: '望我', nameEn: 'желание', nameZh: '欲望', ruby: 'ジェラーニエ', rubyEn: 'zhelaniye', baseType: 'special', extra: true, extraFrom: '13-utsuro-A1-s-1', types: ['action'], cost: '6', text: '【使用済】あなたはダメージを受けない。 \n----\n【即再起】あなたのメインフェイズが開始する。', textZh: '【使用后】你不会受到伤害。\n----\n【即再起】你的主要阶段开始时。', textEn: 'Devoted: You cannot take damage.\n----\nImmediate Resurgence: Your main phase begins.' },
    '13-utsuro-A1-s-1-ex2': { megami: 'utsuro', anotherID: 'A1', replace: '', name: '万象乖ク殲滅ノ影', nameEn: 'Shadow of Annihilation That Opposes All Creation', nameZh: '万象乖离残灭之影', ruby: 'ばんしょうそむくせんめつのかげ', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '13-utsuro-A1-s-1', types: ['attack', 'fullpower'], range: '0-3', damage: '-/0', text: '対応不可 \n【攻撃後】相手は相手のオーラ、フレア、ライフのいずれかから桜花結晶を合計6つダストへ移動させる。', textZh: '不可被对应\n【攻击后】对手从对手的装、命、气三个区域中选择合计6个樱花结晶将其移动到虚。', textEn: 'No Reactions\n\nAfter Attack: Your opponent moves a total of 6 Sakura tokens from their Aura, Flare, and Life to Shadow, in any combination.' },
    '13-utsuro-A1-s-1-ex3': { megami: 'utsuro', anotherID: 'A1', replace: '', name: '我ヲ亡クシテ静寂ヲ往ク', nameEn: 'Perish the Self and Haunt the Silence', nameZh: '自灭往寂', ruby: 'われをなくしてせいじゃくをゆく', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '13-utsuro-A1-s-1', types: ['action', 'fullpower'], text: 'あなたは《前進》以外の基本動作を5回まで行ってもよい。 \n攻撃「適正距離4-10、3/2」を行う。 \n攻撃「適正距離5-10、1/1」を行う。 \n攻撃「適正距離6-10、1/1」を行う。', textZh: '你可以进行5次《前进》以外的基本动作。然后按顺序执行：\n“攻击距离4-10 伤害3/2”的攻击。\n“攻击距离5-10 伤害1/1”的攻击。\n“攻击距离6-10 伤害1/1”的攻击。', textEn: 'Perform up to 5 basic actions other than Forward Movement. Then, you attack with\n"Range: 4-10, Damage: 3/2", \n"Range: 5-10, Damage: 1/1", and \n"Range: 6-10, Damage: 1/1" in this order.' },
    '13-utsuro-A1-s-1-ex4': { megami: 'utsuro', anotherID: 'A1', replace: '', name: '終焉、来タレ', nameEn: 'The End Cometh', nameZh: '末日来临', ruby: 'しゅうえん、きたれ', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '13-utsuro-A1-s-1', types: ['enhance'], capacity: '2', text: '【破棄時】相手は手札と山札をすべて捨て札にする。相手の集中力は0になる。相手を畏縮させる。', textZh: '【破弃时】对手把手牌和牌库的牌全部置入弃牌堆。对手的集中力变为0，对手畏缩。', textEn: 'Disenchant: Put all cards in your opponent\'s hand and deck into their played pile. Their Vigor becomes 0. Flinch them.' },
    '14-honoka-o-n-1': { megami: 'honoka', name: '精霊式', nameEn: 'Spirit Rite', nameZh: '精灵式', ruby: 'せいれいしき', rubyEn: '', baseType: 'normal', exchangableTo: '14-honoka-o-n-1-ex1', types: ['attack'], range: '3-4', damage: '1/1', text: '対応不可 \n【攻撃後】開花-この「精霊式」を追加札の「守護霊式」と交換してもよい。そうした場合、その「守護霊式」を山札の底に置いてもよい。', textZh: '不可被对应\n【攻击后】开花-将这张“精灵式”和追加卡中的“守护灵式”交换。这样做的场合，那张“守护灵式”可以放在牌堆底。', textEn: 'No Reactions\n\nAfter Attack: Bloom - You may exchange this card with your set aside "Guardian Spirit Rite". If you do, you may put that card on the bottom of your deck.' },
    '14-honoka-o-n-1-ex1': { megami: 'honoka', name: '守護霊式', nameEn: 'Guardian Spirit Rite', nameZh: '守护灵式', ruby: 'しゅごれいしき', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '14-honoka-o-n-1', exchangableTo: '14-honoka-o-n-1-ex2', types: ['attack', 'reaction'], range: '2-3', damage: '2/1', text: '【攻撃後】ダスト→自オーラ：1 \n【攻撃後】開花-この「守護霊式」を追加札の「突撃霊式」と交換してもよい。そうした場合、その「突撃霊式」を山札の底に置いてもよい。', textZh: '【攻击后】虚（1）→自装\n【攻击后】开花-将这张“守护灵式”和追加卡中的“突击灵式”交换。这样做的场合，那张“突击灵式”可以放在牌堆底。', textEn: 'After Attack: Shadow (1)→ Your Aura\n\nAfter Attack: Bloom - You may exchange this card with your set aside "Destructive Spirit Rite". If you do, you may put that card on the bottom of your deck.' },
    '14-honoka-o-n-1-ex2': { megami: 'honoka', name: '突撃霊式', nameEn: 'Destructive Spirit Rite', nameZh: '突击灵式', ruby: 'とつげきれいしき', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '14-honoka-o-n-1-ex1', exchangableTo: '14-honoka-o-n-1-ex3', types: ['attack'], range: '5', damage: '3/2', text: '不可避 \n【攻撃後】開花-この「突撃霊式」を追加札の「神霊ヲウカ」と交換してもよい。そうした場合、その「神霊ヲウカ」を山札の底に置いてもよい。', textZh: '不可被闪避\n【攻击后】开花-将这张“突击灵式”和追加卡中的“神灵奥华”狡猾。这样做的场合，那张“神灵奥华”可以放在牌堆底。', textEn: 'Unavoidable\n\nAfter Attack: Bloom - You may exchange this card with your set aside "Divine Spirit: Ouka". If you do, you may put that card on the bottom of your deck.' },
    '14-honoka-o-n-1-ex3': { megami: 'honoka', name: '神霊ヲウカ', nameEn: 'Divine Spirit: Ouka', nameZh: '神灵奥华', ruby: 'しんれいをうか', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '14-honoka-o-n-1-ex2', types: ['attack', 'fullpower'], range: '1-4', damage: '4/3', text: '対応不可 \n【攻撃後】ダスト→自オーラ：2', textZh: '不可被对应\n【攻击后】虚（2）→自装', textEn: 'No Reactions\n\nAfter Attack: Shadow (2)→ Your Aura' },
    '14-honoka-o-n-2': { megami: 'honoka', name: '桜吹雪', nameEn: 'Petal Storm', nameZh: '樱吹雪', ruby: 'さくらふぶき', rubyEn: '', baseType: 'normal', types: ['attack'], range: '1-5', damage: '2/1', text: '【攻撃後】相手は以下のどちらかを選ぶ。\n・間合→ダスト：1\n・ダスト→間合：1', textZh: '【攻击后】对手选择一下1项：\n·距（1）→虚\n·虚（1）→距', textEn: 'After Attack: Your opponent chooses one:\n・Distance (1)→ Shadow\n・Shadow (1)→ Distance' },
    '14-honoka-o-n-3': { megami: 'honoka', name: '義旗共振', nameEn: 'Resonant Flag of Virtue', nameZh: '义旗共振', ruby: 'ぎききょうしん', rubyEn: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '2-9', damage: '2/2', text: '【攻撃後】カードを１枚引いてもよい。 \n【攻撃後】あなたは手札を1枚選び、それを山札の底に置いてもよい。 \n【攻撃後】このカードを山札の底に置いてもよい。', textZh: '【攻击后】可以抽1张牌。\n【攻击后】可以选择手牌中1张卡将其置于牌堆底。\n【攻击后】可以将这张牌置于牌堆底。', textEn: 'After Attack: You may draw a card.\n\nAfter Attack: You may choose a card in your hand and put it on the bottom of your deck.\n\nAfter Attack: You may put this card on the bottom of your deck.' },
    '14-honoka-o-n-4': { megami: 'honoka', name: '桜の翅', nameEn: 'Sakura Wings', nameZh: '樱之翅', ruby: 'さくらのはね', rubyEn: '', baseType: 'normal', exchangableTo: '14-honoka-o-n-4-ex1', types: ['action'], text: '間合⇔ダスト：2 \nこの「桜の翅」を追加札の「再生」と交換する。', textZh: '距（2）⇔虚\n将这张“樱之翅”和追加卡“再生”交换。', textEn: 'Distance (2)⇔ Shadow\n\nExchange this card with your set aside "Rebirth".' },
    '14-honoka-o-n-4-ex1': { megami: 'honoka', name: '再生', nameEn: 'Rebirth', nameZh: '再生', ruby: 'さいせい', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '14-honoka-o-n-4', exchangableTo: '14-honoka-o-n-4', types: ['action', 'fullpower'], text: 'ダスト→自オーラ：1 \nダスト→自フレア：1 \nこの「再生」を追加札の「桜の翅」と交換する。', textZh: '虚（1）→自装\n虚（1）→自气\n将这张“再生”和追加卡“樱之翅”交换。', textEn: 'Shadow (1)→ Your Aura\nShadow (1)→ Your Flare\n\nExchange this card with your set aside "Sakura Wings".' },
    '14-honoka-o-n-5': { megami: 'honoka', name: '桜花のお守り', nameEn: 'Charm of Blossoms', nameZh: '樱花护身符', ruby: 'おうかのおまもり', rubyEn: '', baseType: 'normal', exchangableTo: '14-honoka-o-n-5-ex1', types: ['action', 'reaction'], text: 'あなたは手札を１枚選び、それを伏せ札にしてもよい。そうした場合、対応した切札でない《攻撃》を打ち消す。 \n開花-この「桜花のお守り」を追加札の「仄かなる輝き」と交換してもよい。そうした場合、その「仄かなる輝き」を山札の底に置いてもよい。', textZh: '你选择一张手牌、可以将其设置为盖牌。这样做的场合、打消对应的王牌以外的攻击。\n开花-将这张“樱花护身符”和追加卡中的“暗淡的光辉”交换。这样做的场合，那张“暗淡的光辉”可以放在牌堆底。', textEn: 'You may discard a card. If you do, cancel the non-Special attack you played this card as a Reaction to.\n\nBloom - You may exchange this card with your set aside "Faint Spark". If you do, you may put that card on the bottom of your deck.' },
    '14-honoka-o-n-5-ex1': { megami: 'honoka', name: '仄かなる輝き', nameEn: 'Faint Spark', nameZh: '暗淡的光辉', ruby: 'ほのかなるかがやき', rubyEn: '', baseType: 'normal', extra: true, extraFrom: '14-honoka-o-n-5', types: ['attack'], range: '1-3', damage: '1/2', text: '', textZh: '', textEn: '' },
    '14-honoka-o-n-6': { megami: 'honoka', name: '微光結界', nameEn: 'Shimmering Barrier', nameZh: '微光结界', ruby: 'びこうけっかい', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '4', text: '【展開中】相手のターンにあなたの手札と山札にあるカードは伏せ札、捨て札にならない。 \n(使用したカードは通常通り捨て札になる) \n【展開中】あなたは畏縮しない \n【破棄時】あなたは集中力を1得る。', textZh: '【展开中】在对手的回合内，你的手牌和牌库中的牌不会被盖伏、也不会被丢弃。（正常使用的卡还是要放在弃牌堆的）\n【展开中】你不会被畏缩。\n【破弃时】你获得1点集中力。', textEn: 'Ongoing: During your opponent\'s turn, cards in your hand and deck cannot be put into your discard or played piles.\n(Played cards will go to the played pile as usual.)\n\nOngoing: You cannot be flinched.\n\nDisenchant: Gain 1 Vigor.' },
    '14-honoka-o-n-7': { megami: 'honoka', name: '追い風', nameEn: 'Tailwind', nameZh: '追风', ruby: 'おいかぜ', rubyEn: '', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開中】あなたの《攻撃》は距離拡大(遠1)を得る。', textZh: '【展开中】你的《攻击》获得距离扩大（远1）。', textEn: 'Ongoing: Increase the Range of your attacks by 1 in the distant direction.' },
    '14-honoka-o-s-1': { megami: 'honoka', name: '胸に想いを', nameEn: 'Feelings in Your Heart', nameZh: '感存于心', ruby: 'むねにおもいを', rubyEn: '', baseType: 'special', exchangableTo: '14-honoka-o-s-1-ex1', types: ['action'], cost: '5', text: '開花-この「胸に想いを」を追加札の「両手に華を」に交換し、未使用に戻す。', textZh: '开花-将这张“将心中所感”和追加卡中的“寄于两手之华”交换、以未使用状态获得。', textEn: 'Bloom - Exchange this with your set aside "Flowers in Your Hands" and turn that card face-down.' },
    '14-honoka-o-s-1-ex1': { megami: 'honoka', name: '両手に華を', nameEn: 'Flowers in Your Hands', nameZh: '结樱于手', ruby: 'りょうてにはなを', rubyEn: '', baseType: 'special', extra: true, extraFrom: '14-honoka-o-s-1', exchangableTo: '14-honoka-o-s-1-ex2', types: ['action', 'fullpower'], cost: '0', text: '【使用済】開花-あなたの終了フェイズにあなたのオーラにある桜花結晶を2つまでこのカードの上に置いてもよい。その結果、ちょうど5つになったならば、それらの桜花結晶をあなたのフレアへと移動させ、この「両手に華を」を追加札の「そして新たな幕開けを」に交換し、未使用に戻す。', textZh: '【使用后】开花-在你的回合结束阶段时，你可以把自己装中的至多两个樱花结晶放在这张卡上面。然后，如果这张牌上恰好有5个樱花结晶时，将它们全部移入自气。将这张“寄于两手之华”和追加卡中的“于是崭新的一幕揭开”交换，以未使用状态获得。', textEn: 'Bloom - At the end of your turn, you may move up to 2 Sakura tokens from your Aura to this card. Then if there are exactly 5 Sakura tokens on this card, move them all to your Flare, exchange this card with your set aside "And So Begins the Rising of a New Curtain", and turn that card face-down.' },
    '14-honoka-o-s-1-ex2': { megami: 'honoka', name: 'そして新たな幕開けを', nameEn: 'And So Begins the Rising of a New Curtain', nameZh: '旋即旌招幕展', ruby: 'そしてあらたなまくあけを', rubyEn: '', baseType: 'special', extra: true, extraFrom: '14-honoka-o-s-1-ex1', types: ['action'], cost: '5', text: '【使用済】あなたの終了フェイズに攻撃「適正距離0-10、X/X、対応不可 【常時】Xは桜花結晶がちょうど5つある領域の数に等しい」を行う。', textZh: '【使用后】在你的回合结束阶段，进行一次“攻击距离0-10 伤害X/X 不可被对应”的攻击，X等同于场上樱花结晶数恰好为5的领域的个数。', textEn: 'Devoted: At the end of your turn, you attack with "Range: 0-10, Damage: X/X, No Reactions, Forced: X is the number of zones with exactly 5 Sakura tokens."' },
    '14-honoka-o-s-2': { megami: 'honoka', name: 'この旗の名の下に', nameEn: 'In the Name of This Flag', nameZh: '在此旗的名义之下', ruby: 'このはたのなのもとに', rubyEn: '', baseType: 'special', types: ['attack'], range: '3-7', damage: '3/2', cost: '4', text: '【常時】このカードを使用するに際し、あなたの付与札を1つ選んでもよい。この《攻撃》のダメージにより移動する桜花結晶はダストやフレアでなく選ばれた付与札に可能ならば動かす。 \n(付与札が存在しないなど不可能な場合は通常通りに桜花結晶を動かす)', textZh: '【常时】这张牌使用之际，你可以选择一张你的展开中的付与牌。此《攻击》造成的伤害导致樱花结晶移动时，不将它们移动入虚或气，取而代之将其移动至那张付与牌上。', textEn: 'Forced: As you play this card, you may choose one of your Enhancements in play. Damage dealt by this attack moves Sakura tokens to that card instead of to Shadow or to Flare.' },
    '14-honoka-o-s-3': { megami: 'honoka', name: '四季はまた廻り来る', nameEn: 'The Seasons Turn Again', nameZh: '四季轮回来临', ruby: 'しきはまためぐりくる', rubyEn: '', baseType: 'special', types: ['action'], cost: '2', text: 'あなたの山札を全て伏せ札にする。伏せ札、捨て札からカードを4枚まで選び、それらを好きな順番で山札の上に置く。', textZh: '将你的牌库全部盖伏。然后在盖牌区和弃牌区中选择4张牌，以你喜欢的顺序放在牌堆顶。', textEn: 'Put your deck into your discard pile, then choose up to 4 cards from among your discard and played piles. Put the chosen cards on top of your deck in any order.' },
    '14-honoka-o-s-4': { megami: 'honoka', name: '満天の花道で', nameEn: 'Heavenly Flowerway', nameZh: '漫天的花道', ruby: 'まんてんのはなみちで', rubyEn: '', baseType: 'special', types: ['enhance'], capacity: '5', cost: '2', text: '【展開中】この付与札の上の桜花結晶がダストへと送られるならば、それは代わりにあなたのオーラへと移動する。あなたのオーラが5以上ならば、代わりにあなたのフレアへ移動する。', textZh: '【展开中】这张付与牌上的樱花结晶要送入虚的时候，取而代之将其移动入自装。如果自装在5以上，取而代之将其移动入自气。', textEn: 'Ongoing: If a Sakura token would be moved from this card to Shadow, instead move it to your Aura. If there are already 5 or more Sakura tokens on your Aura, instead move it to your Flare.' }
};
exports.CARD_DATA['na-s3'] = lodash_1.default.extend({}, exports.CARD_DATA['na-s2']);
for (var key in exports.S3_UPDATED_CARD_DATA) {
    var data = exports.S3_UPDATED_CARD_DATA[key];
    if (data === null) {
        delete exports.CARD_DATA['na-s3'][key];
    }
    else {
        exports.CARD_DATA['na-s3'][key] = data;
    }
}
// ソートキーを自動で割り振り、また同時にカードIDとソートキーの対応を記憶
var cardSortKeys = [];
exports.CARD_SORT_KEY_MAP = {};
for (var cardSet in exports.CARD_DATA) {
    for (var cardId in exports.CARD_DATA[cardSet]) {
        var card = exports.CARD_DATA[cardSet][cardId];
        if (card.replace) {
            // 別のカードを置き換えるアナザー
            card.sortKey = card.replace + "_" + card.anotherID;
        }
        else if (card.extraFrom) {
            // 追加札
            card.sortKey = exports.CARD_DATA[cardSet][card.extraFrom].sortKey + "_" + cardId;
        }
        else if (card.poison) {
            // 毒 (末尾)
            card.sortKey = "99-" + cardId;
        }
        else {
            // 上記以外
            card.sortKey = cardId;
        }
        cardSortKeys.push([cardId, card.sortKey]);
        exports.CARD_SORT_KEY_MAP[cardId] = card.sortKey;
    }
}
// カードIDをソートキー順に並べ替える
var sortedAllCardIds = lodash_1.default.sortedUniq(lodash_1.default.sortBy(cardSortKeys, function (p) { return p[1]; }).map(function (p) { return p[0]; }));
// 全カードをソートキー順にソートして、（カードセット別に）全カードIDの配列と、全カードの配列を作成
exports.ALL_CARD_ID_LIST = {};
exports.ALL_CARD_LIST = {};
for (var cardSet in exports.CARD_DATA) {
    exports.ALL_CARD_ID_LIST[cardSet] = [];
    exports.ALL_CARD_LIST[cardSet] = [];
    for (var _i = 0, sortedAllCardIds_1 = sortedAllCardIds; _i < sortedAllCardIds_1.length; _i++) {
        var cardId = sortedAllCardIds_1[_i];
        if (exports.CARD_DATA[cardSet][cardId]) {
            exports.ALL_CARD_ID_LIST[cardSet].push(cardId);
            exports.ALL_CARD_LIST[cardSet].push(exports.CARD_DATA[cardSet][cardId]);
        }
    }
}


/***/ }),

/***/ "./src/sakuraba/const.ts":
/*!*******************************!*\
  !*** ./src/sakuraba/const.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BOARD_BASE_WIDTH = 1350;
exports.VERSION = '0.7.0-pretest';
var ZIndex;
(function (ZIndex) {
    ZIndex.CONTEXT_MENU_VISIBLE = 9999;
    ZIndex.CONTEXT_MENU_VISIBLE_RIGHT_CLICK = 99999;
    ZIndex.CARD = 100;
    ZIndex.SEALED_CARD = 90;
    ZIndex.TAPPED_CARD = 150;
    ZIndex.FLOAT_WINDOW = 1000;
    ZIndex.HOVER_DROPPABLE = 9999;
    ZIndex.MEGAMI_FACE = -1;
})(ZIndex = exports.ZIndex || (exports.ZIndex = {}));
var StoreName;
(function (StoreName) {
    StoreName.TABLES = "sakuraba_tables";
    StoreName.LOGS = "logs";
    StoreName.WATCHERS = "watchers";
    StoreName.METADATA = "sakuraba_metadata";
    StoreName.PLAYER_KEY_MAP = "sakuraba_playerKeyMap";
})(StoreName = exports.StoreName || (exports.StoreName = {}));


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
var sakuraba_1 = __webpack_require__(/*! sakuraba */ "./src/sakuraba.ts");
var utils = __importStar(__webpack_require__(/*! sakuraba/utils */ "./src/sakuraba/utils/index.ts"));
var models = __importStar(__webpack_require__(/*! sakuraba/models */ "./src/sakuraba/models/index.ts"));
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
    /** 指定したカードのカード情報を取得（複製済みでゅーぷりぎあがあればそれも考慮する） */
    Board.prototype.getCardData = function (card, detectedLanguage, languageSetting, cardImageEnabled) {
        if (card.cardId === '10-kururu-o-s-3-ex1') { // でゅーぷりぎあ
            // でゅーぷりぎあの場合、複製対象のカードがあるかどうかを探す
            // (でゅーぷりぎあ所有者の切札に使用済みのいんだすとりあがあり、かつ何かのカードが封印されていれば、それを複製する)
            // 複製しているカードがあればその情報を返す
            var usedIndustria = this.getRegionCards(card.ownerSide, 'special', null).find(function (c) { return c.specialUsed && c.cardId === '10-kururu-o-s-3'; }); // いんだすとりあ
            if (usedIndustria) {
                var sealedCards = this.getRegionCards(usedIndustria.side, 'on-card', usedIndustria.id);
                if (sealedCards.length >= 1) {
                    return new models.CardData(this.cardSet, card.cardId, detectedLanguage, languageSetting, cardImageEnabled, sealedCards[0].cardId);
                }
            }
        }
        // でゅーぷりぎあ以外のカードか、複製元がないでゅーぷりぎあなら、通常通りカード情報を取得
        return new models.CardData(this.cardSet, card.cardId, detectedLanguage, languageSetting, cardImageEnabled);
    };
    /** すべてのカードを取得 */
    Board.prototype.getCards = function () {
        return this.objects.filter(function (v) { return v.type === 'card'; });
    };
    /** 指定したIDのカードを取得 */
    Board.prototype.getCard = function (objectId) {
        return this.objects.find(function (v) { return v.type === 'card' && v.id === objectId; });
    };
    /** 指定したサイドのカードを一括取得 */
    Board.prototype.getSideCards = function (side) {
        return this.objects.filter(function (v) { return v.type === 'card' && v.side === side; });
    };
    /** 指定した領域にあるカードを一括取得 */
    Board.prototype.getRegionCards = function (side, region, linkedCardId) {
        return this.objects.filter(function (v) { return v.type === 'card' && v.side === side && v.region === region && v.linkedCardId === linkedCardId; });
    };
    /** 指定したカードの下に封印されているカードを一括取得 */
    Board.prototype.getSealedCards = function (baseCardId) {
        var sealedCards = this.objects.filter(function (o) { return o.type === 'card' && o.region === 'on-card' && o.linkedCardId === baseCardId; });
        return sealedCards;
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
    Board.prototype.getRegionSakuraTokens = function (side, region, linkedCardId) {
        return this.objects.filter(function (v) { return v.type === 'sakura-token' && v.side === side && v.region == region && v.linkedCardId == linkedCardId; });
    };
    /** 間合にある、指定したグループの桜花結晶を一括取得 */
    Board.prototype.getDistanceSakuraTokens = function (group) {
        return this.objects.filter(function (v) { return v.type === 'sakura-token' && v.side === null && v.region == 'distance' && v.linkedCardId == null && v.group === group; });
    };
    /** 現在の間合の値を取得 (騎動分も加味する) */
    Board.prototype.getDistance = function () {
        var tokens = this.getRegionSakuraTokens(null, 'distance', null);
        return tokens.filter(function (x) { return !(x.artificial && x.distanceMinus); }).length - tokens.filter(function (x) { return x.artificial && x.distanceMinus; }).length;
    };
    /** 現在の間合にいくつ分の結晶が置かれているかを取得 (間合-1トークン除く) */
    Board.prototype.getDistanceTokenCount = function () {
        var flatTokens = this.getRegionSakuraTokens(null, 'distance', null).filter(function (t) { return !t.distanceMinus; }); // 間合-1トークンを除いたすべての結晶を取得
        return flatTokens.length;
    };
    /** 指定数の騎動前進が実行可能かどうか */
    Board.prototype.isRideForwardEnabled = function (side, moveNumber) {
        var activeSakuraTokens = this.getDistanceSakuraTokens('normal'); // 有効な桜花結晶を取得
        var machineTokens = this.getRegionSakuraTokens(side, 'machine', null);
        return machineTokens.length >= moveNumber && moveNumber <= activeSakuraTokens.length; // 造花結晶数が必要な数あり、かつ移動数 <= 有効な桜花結晶数なら移動可能
    };
    /** 指定数の騎動後退が実行可能かどうか */
    Board.prototype.isRideBackEnabled = function (side, moveNumber) {
        var machineTokens = this.getRegionSakuraTokens(side, 'machine', null);
        return machineTokens.length >= moveNumber && this.getDistanceTokenCount() + moveNumber <= 10; // 造花結晶数が必要な数あり、かつボード上に置かれている結晶数（間合-1トークン除く） + 移動数 が10を超えなければ移動可能
    };
    /** 各基本動作が実行可能かどうかを一括チェック */
    Board.prototype.checkBasicActionEnabled = function (side) {
        var distanceCount = this.getDistanceTokenCount();
        var distanceNormalTokens = this.getDistanceSakuraTokens('normal');
        var dustCount = this.getRegionSakuraTokens(null, 'dust', null).length;
        var myAuraCount = this.getRegionSakuraTokens(side, 'aura', null).length;
        return {
            // 前進は間合に通常の桜花結晶が1つ以上あり、オーラ5未満なら可能
            forward: distanceNormalTokens.length >= 1 && myAuraCount < 5
            // 離脱はダスト1以上、間合10未満なら可能
            ,
            leave: dustCount >= 1 && distanceCount < 10
            // 後退はオーラ1以上、間合10未満なら可能
            ,
            back: myAuraCount >= 1 && distanceCount < 10
            // 纏いはダスト1以上、オーラ5未満なら可能
            ,
            wear: dustCount >= 1 && myAuraCount < 5
            // 宿しはオーラ1以上なら可能
            ,
            charge: myAuraCount >= 1
        };
    };
    /** カード移動時などの領域情報一括更新 */
    Board.prototype.updateRegionInfo = function () {
        var _this = this;
        var cards = this.getCards();
        var sideAndCardRegions = _.uniq(cards.map(function (c) { return [c.side, c.region, c.linkedCardId]; }));
        sideAndCardRegions.forEach(function (r) {
            var side = r[0], region = r[1], linkedCardId = r[2];
            var regionCards = _this.getRegionCards(side, region, linkedCardId);
            // 追加札は常にカードID順でソート、それ以外は以前の順序でソート。ただしTransformカードは後ろに並べる
            if (region === 'extra') {
                regionCards = _.sortBy(regionCards, [(function (c) { return c.cardId; })]);
            }
            else {
                regionCards = _.sortBy(regionCards, [(function (c) { return sakuraba_1.CARD_DATA[_this.cardSet][c.cardId].baseType; }), (function (c) { return c.indexOfRegion; })]);
            }
            var index = 0;
            regionCards.forEach(function (c) {
                // インデックス更新
                c.indexOfRegion = index;
                index++;
                // 対象のカードが手札にない場合、手札から公開しているフラグを強制的にOFF
                if (region !== 'hand' && _this.handCardOpenFlags[c.side][c.id]) {
                    _this.handCardOpenFlags[c.side][c.id] = false;
                }
                // 対象のカードが使用済みでも切札でもない場合、帯電解除フラグを強制的にOFF
                if (region !== 'used' && region !== 'special' && c.discharged) {
                    c.discharged = false;
                }
                // 開閉状態更新
                var handOpenFlag = _this.handOpenFlags[c.side] || _this.handCardOpenFlags[c.side][c.id];
                c.openState = utils.judgeCardOpenState(_this.cardSet, c, handOpenFlag);
                // 回転状態更新
                c.rotated = (region === 'hidden-used') || c.discharged;
            });
        });
        var tokens = this.getSakuraTokens();
        var sideAndSakuraTokenRegions = _.uniq(tokens.map(function (c) { return [c.side, c.region, c.linkedCardId]; }));
        sideAndSakuraTokenRegions.forEach(function (r) {
            var side = r[0], region = r[1], linkedCardId = r[2];
            var regionSakuraTokens = _this.getRegionSakuraTokens(side, region, linkedCardId).sort(function (a, b) { return a.indexOfRegion - b.indexOfRegion; });
            var index = 0;
            regionSakuraTokens.forEach(function (c) {
                // インデックス更新
                c.indexOfRegion = index;
                index++;
            });
            // グループ情報も更新する
            if (region === 'distance') {
                var normalTokens = regionSakuraTokens.filter(function (t) { return !t.artificial; });
                var artificialTokens = regionSakuraTokens.filter(function (t) { return t.artificial; });
                var distanceMinusTokens = regionSakuraTokens.filter(function (t) { return t.artificial && t.distanceMinus; });
                // いくつの桜花結晶が有効かを数える (通常の桜花結晶数 - 間合-1トークン数)
                var activeNormalTokenCount = normalTokens.length - distanceMinusTokens.length;
                // 造花結晶のグループを振る
                var artificialTokensP1_1 = artificialTokens.filter(function (t) { return t.ownerSide === 'p1'; });
                var artificialTokensP2_1 = artificialTokens.filter(function (t) { return t.ownerSide === 'p2'; });
                artificialTokensP1_1.forEach(function (c, i) {
                    c.group = 'artificial-p1';
                    c.groupTokenDraggingCount = artificialTokensP1_1.length; // ドラッグ時には全造花結晶をまとめて操作
                });
                artificialTokensP2_1.forEach(function (c, i) {
                    c.group = 'artificial-p2';
                    c.groupTokenDraggingCount = artificialTokensP2_1.length; // ドラッグ時には全造花結晶をまとめて操作
                });
                // 通常の桜花結晶は、間合-1トークンの数だけ無効
                // それ以外は有効
                var activeIndex = 0;
                for (var i = 0; i < normalTokens.length; i++) {
                    var c = normalTokens[i];
                    if (i < distanceMinusTokens.length) {
                        c.group = 'inactive';
                        c.groupTokenDraggingCount = 0; // ドラッグ不可
                    }
                    else {
                        c.group = 'normal';
                        c.groupTokenDraggingCount = activeNormalTokenCount - activeIndex;
                        activeIndex++;
                    }
                }
            }
            else {
                // 通常の場合は、全トークン同じグループに属する
                regionSakuraTokens.forEach(function (c, i) {
                    c.group = 'normal';
                    c.groupTokenDraggingCount = regionSakuraTokens.length - i;
                });
            }
        });
    };
    return Board;
}());
exports.Board = Board;


/***/ }),

/***/ "./src/sakuraba/models/CardData.ts":
/*!*****************************************!*\
  !*** ./src/sakuraba/models/CardData.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sakuraba_1 = __webpack_require__(/*! sakuraba */ "./src/sakuraba.ts");
var i18next_1 = __webpack_require__(/*! i18next */ "i18next");
var CardData = /** @class */ (function () {
    /** コンストラクタ */
    function CardData(cardSet, cardId, detectedLanguage, languageSetting, cardImageEnabled, duplicatingCardId) {
        /** 複製元のカードID */
        this.duplicatingCardId = null;
        /** 傘が開いている場合の情報を使用するかどうか */
        this.usedOpenedCardData = false;
        this.cardSet = cardSet;
        this.cardId = cardId;
        this.detectedLanguage = detectedLanguage;
        this.languageSetting = languageSetting;
        this.cardImageEnabled = cardImageEnabled;
        if (duplicatingCardId) {
            this.duplicatingCardId = duplicatingCardId;
        }
    }
    Object.defineProperty(CardData.prototype, "baseData", {
        get: function () {
            return sakuraba_1.CARD_DATA[this.cardSet][this.cardId];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "duplicatingBaseData", {
        get: function () {
            return sakuraba_1.CARD_DATA[this.cardSet][this.duplicatingCardId];
        },
        enumerable: true,
        configurable: true
    });
    /** 言語を元に適切なテキストを選択 */
    CardData.prototype.selectText = function (lang, ja, zh, en) {
        if (lang === 'en') {
            return en;
        }
        if (lang === 'zh') {
            return zh;
        }
        return ja;
    };
    Object.defineProperty(CardData.prototype, "uniqueNameLanguage", {
        /** メガミ名、カード名の言語 */
        get: function () {
            if (this.languageSetting.type === 'auto') {
                return this.detectedLanguage;
            }
            else {
                return this.languageSetting.uniqueName;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "cardTextLanguage", {
        /** カードテキストの言語 */
        get: function () {
            if (this.languageSetting.type === 'auto') {
                return this.detectedLanguage;
            }
            else {
                return this.languageSetting.cardText;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "megami", {
        /** メガミ */
        get: function () {
            var data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
            return data.megami;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "name", {
        /** カード名 */
        get: function () {
            return this.selectText(this.uniqueNameLanguage, this.baseData.name, this.baseData.nameZh, this.baseData.nameEn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "ruby", {
        /** 読み仮名 */
        get: function () {
            return this.selectText(this.uniqueNameLanguage, this.baseData.ruby, '', this.baseData.rubyEn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "baseType", {
        /** 分類 (通常/切札/Transform) */
        get: function () {
            return this.baseData.baseType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "types", {
        /** タイプ */
        get: function () {
            var data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
            return data.types;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "cost", {
        /** 消費 */
        get: function () {
            var data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
            return data.cost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "currentRange", {
        /** 適正距離 (現在の傘の状態に依存する) */
        get: function () {
            if (this.usedOpenedCardData) {
                return this.rangeOpened;
            }
            else {
                return this.range;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "range", {
        /** 適正距離 */
        get: function () {
            var data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
            return data.range;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "rangeOpened", {
        /** 適正距離（傘を開いている場合） */
        get: function () {
            var data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
            return data.rangeOpened;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "capacity", {
        /** 納 */
        get: function () {
            var data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
            return data.capacity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "currentDamage", {
        /** ダメージ (現在の傘の状態に依存する)  */
        get: function () {
            if (this.usedOpenedCardData) {
                return this.damageOpened;
            }
            else {
                return this.damage;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "damage", {
        /** ダメージ */
        get: function () {
            var data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
            return data.damage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "damageOpened", {
        /** ダメージ（傘を開いている場合） */
        get: function () {
            var data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
            return data.damageOpened;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "poison", {
        /** 毒フラグ */
        get: function () {
            return this.baseData.poison; // でゅーぷりぎあに毒を複製した場合でも毒扱いにはならない
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "text", {
        /** 説明テキスト */
        get: function () {
            return this.selectText(this.languageSetting.cardText, this.baseData.text, this.baseData.textZh, this.baseData.textEn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "textOpened", {
        /** 説明テキスト */
        get: function () {
            return this.selectText(this.uniqueNameLanguage, this.baseData.textOpened, this.baseData.textOpenedZh, this.baseData.textOpenedEn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "extra", {
        /** 追加札かどうか(デッキ構築の時に選択できず、ゲーム開始時に追加札領域に置かれる) */
        get: function () {
            return this.baseData.extra;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "extraFrom", {
        /** 追加札の追加元 */
        get: function () {
            return this.baseData.exchangableTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "extraFromData", {
        /** 追加札の追加元データ */
        get: function () {
            return new CardData(this.cardSet, this.extraFrom, this.detectedLanguage, this.languageSetting, this.cardImageEnabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "exchangableTo", {
        /** 交換先 */
        get: function () {
            return this.baseData.exchangableTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardData.prototype, "exchangableToData", {
        /** 交換先データ */
        get: function () {
            return new CardData(this.cardSet, this.exchangableTo, this.detectedLanguage, this.languageSetting, this.cardImageEnabled);
        },
        enumerable: true,
        configurable: true
    });
    /** カード画像のURLを取得 */
    CardData.prototype.getCardImageUrl = function () {
        var imageName = 'na_' + this.cardId.replace(/-/g, '_').toLowerCase();
        // トランスフォームカードの場合
        if (this.baseType === 'transform') {
            imageName = 'na_' + this.cardId.replace(/-/g, '_').toLowerCase();
        }
        // シーズン3処理
        if (this.cardSet === 'na-s3') {
            // シーズン2に存在し、かつシーズン3で更新があるカードの場合、後ろに_s3を付ける
            if (sakuraba_1.CARD_DATA['na-s2'][this.cardId] && sakuraba_1.S3_UPDATED_CARD_DATA[this.cardId]) {
                imageName = imageName + '_s3';
            }
            // トコヨ「陽の音」のみ、置換先が変わっているため特殊処理
            if (this.cardId === '04-tokoyo-A1-n-5') {
                imageName = imageName + '_s3';
            }
        }
        return "//inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/furuyoni_na/cards/resized/en/" + imageName + ".png";
    };
    /** カードの説明用ポップアップHTMLを取得する */
    CardData.prototype.getDescriptionHtml = function () {
        var html = '';
        // 画像表示モードかどうかで処理を変更
        if (this.cardImageEnabled) {
            if (this.baseType === 'transform') {
                html = "<img src=\"" + this.getCardImageUrl() + "\" width=\"430\" height=\"311\">";
            }
            else {
                html = "<img src=\"" + this.getCardImageUrl() + "\" width=\"309\" height=\"432\">";
            }
        }
        else {
            var cardTitleHtml = "<ruby><rb>" + this.name + "</rb><rp>(</rp><rt>" + this.ruby + "</rt><rp>)</rp></ruby>";
            html = "<div class='ui header' style='margin-right: 2em;'>" + cardTitleHtml;
            html += "</div><div class='ui content'>";
            if (this.baseType === 'special') {
                html += "<div class='ui top right attached label'>" + i18next_1.t("消費", { lng: this.languageSetting.cardText }) + ": " + this.cost + "</div>";
            }
            var closedSymbol = i18next_1.t('[閉]', { lng: this.languageSetting.cardText });
            var openedSymbol = i18next_1.t('[開]', { lng: this.languageSetting.cardText });
            var typeCaptions = [];
            if (this.types.indexOf('attack') >= 0)
                typeCaptions.push("<span class='card-type-attack'>" + i18next_1.t('攻撃', { lng: this.languageSetting.cardText }) + "</span>");
            if (this.types.indexOf('action') >= 0)
                typeCaptions.push("<span class='card-type-action'>" + i18next_1.t('行動', { lng: this.languageSetting.cardText }) + "</span>");
            if (this.types.indexOf('enhance') >= 0)
                typeCaptions.push("<span class='card-type-enhance'>" + i18next_1.t('付与', { lng: this.languageSetting.cardText }) + "</span>");
            if (this.types.indexOf('variable') >= 0)
                typeCaptions.push("<span class='card-type-variable'>" + i18next_1.t('不定', { lng: this.languageSetting.cardText }) + "</span>");
            if (this.types.indexOf('reaction') >= 0)
                typeCaptions.push("<span class='card-type-reaction'>" + i18next_1.t('対応', { lng: this.languageSetting.cardText }) + "</span>");
            if (this.types.indexOf('fullpower') >= 0)
                typeCaptions.push("<span class='card-type-fullpower'>" + i18next_1.t('全力', { lng: this.languageSetting.cardText }) + "</span>");
            if (this.types.indexOf('transform') >= 0)
                typeCaptions.push("<span class='card-type-transform'>Transform</span>");
            html += "" + typeCaptions.join('/');
            if (this.range !== undefined) {
                if (this.rangeOpened !== undefined) {
                    html += "<span style='margin-left: 1em;'>" + i18next_1.t('適正距離', { lng: this.languageSetting.cardText }) + " " + closedSymbol + this.range + " " + openedSymbol + this.rangeOpened + "</span>";
                }
                else {
                    html += "<span style='margin-left: 1em;'>" + i18next_1.t('適正距離', { lng: this.languageSetting.cardText }) + this.range + "</span>";
                }
            }
            html += "<br>";
            if (this.types.indexOf('enhance') >= 0) {
                html += i18next_1.t('カード説明-納N', { capacity: this.capacity, lng: this.languageSetting.cardText }) + "<br>";
            }
            if (this.damageOpened !== undefined) {
                // 傘の開閉によって効果が分かれる攻撃カード
                html += closedSymbol + " " + this.damage + "<br>";
                html += "" + this.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
                html += (this.text ? '<br>' : '');
                html += openedSymbol + " " + this.damageOpened + "<br>";
                html += "" + this.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
            }
            else if (this.textOpened) {
                // 傘の開閉によって効果が分かれる非攻撃カード
                html += closedSymbol + " " + this.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
                html += (this.text ? '<br>' : '');
                html += openedSymbol + " " + this.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
            }
            else {
                if (this.damage !== undefined) {
                    html += this.damage + "<br>";
                }
                html += "" + this.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>');
            }
            // 追加札で、かつ追加元が指定されている場合
            if (this.extra && this.extraFrom) {
                html += "<div class=\"extra-from\">" + i18next_1.t('追加 ≫ CARDNAME', { cardName: this.extraFromData.name, lng: this.languageSetting.cardText }) + "</div>";
            }
            html += "</div>";
            if (this.megami === 'kururu') {
                // 歯車枠のスタイリング。言語によって処理を変える
                if (this.languageSetting.cardText === 'ja') {
                    html = html.replace(/<([攻行付対全]+)>/g, function (str, arg) {
                        var replaced = arg.replace(/攻+/, function (str2) { return "<span class='card-type-attack'>" + str2 + "</span>"; })
                            .replace(/行+/, function (str2) { return "<span class='card-type-action'>" + str2 + "</span>"; })
                            .replace(/付+/, function (str2) { return "<span class='card-type-enhance'>" + str2 + "</span>"; })
                            .replace(/対+/, function (str2) { return "<span class='card-type-reaction'>" + str2 + "</span>"; })
                            .replace(/全+/, function (str2) { return "<span class='card-type-fullpower'>" + str2 + "</span>"; });
                        return "<" + replaced + ">";
                    });
                }
                else if (this.languageSetting.cardText === 'zh') {
                    html = html.replace(/机巧：([红蓝绿紫黄]+)+/g, function (str, arg) {
                        var replaced = arg.replace(/红+/, function (str2) { return "<span class='card-type-attack'>" + str2 + "</span>"; })
                            .replace(/蓝+/, function (str2) { return "<span class='card-type-action'>" + str2 + "</span>"; })
                            .replace(/绿+/, function (str2) { return "<span class='card-type-enhance'>" + str2 + "</span>"; })
                            .replace(/紫+/, function (str2) { return "<span class='card-type-reaction'>" + str2 + "</span>"; })
                            .replace(/黄+/, function (str2) { return "<span class='card-type-fullpower'>" + str2 + "</span>"; });
                        return "\u673A\u5DE7\uFF1A" + replaced;
                    });
                }
                else if (this.languageSetting.cardText === 'en') {
                    html = html.replace(/Mechanism \((ATK|ACT|ENH|REA|THR| )+\)/g, function (str, arg) {
                        var replaced = arg.replace(/(?:ATK ?)+/, function (str2) { return "<span class='card-type-attack'>" + str2 + "</span>"; })
                            .replace(/(?:ACT ?)+/, function (str2) { return "<span class='card-type-action'>" + str2 + "</span>"; })
                            .replace(/(?:ENH ?)+/, function (str2) { return "<span class='card-type-enhance'>" + str2 + "</span>"; })
                            .replace(/(?:REA ?)+/, function (str2) { return "<span class='card-type-reaction'>" + str2 + "</span>"; })
                            .replace(/(?:THR ?)+/, function (str2) { return "<span class='card-type-fullpower'>" + str2 + "</span>"; });
                        return "Mechanism (" + replaced + ")";
                    });
                }
            }
        }
        return html;
    };
    return CardData;
}());
exports.CardData = CardData;


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
__export(__webpack_require__(/*! ./CardData */ "./src/sakuraba/models/CardData.ts"));


/***/ }),

/***/ "./src/sakuraba/utils/cardData.ts":
/*!****************************************!*\
  !*** ./src/sakuraba/utils/cardData.ts ***!
  \****************************************/
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
var i18next_1 = __webpack_require__(/*! i18next */ "i18next");
/** カードセット名取得 */
function getCardSetName(cardSet) {
    return (cardSet === 'na-s3' ? i18next_1.t('cardset:新幕 シーズン3') : i18next_1.t('cardset:新幕 シーズン2'));
}
exports.getCardSetName = getCardSetName;
/** カードセットの説明を取得 (選択時に表示) */
function getCardSetDescription(cardSet) {
    return (cardSet === 'na-s3' ? i18next_1.t('cardset:新幕 シーズン3-説明') : i18next_1.t('cardset:新幕 シーズン2-説明'));
}
exports.getCardSetDescription = getCardSetDescription;
/** 指定したカードセットに対応するメガミのキー一覧を取得 */
function getMegamiKeys(cardSet) {
    var keys = [];
    for (var key in sakuraba.MEGAMI_DATA) {
        var megami = sakuraba.MEGAMI_DATA[key];
        if (megami.notExistCardSets === undefined || megami.notExistCardSets.indexOf(cardSet) === -1) {
            keys.push(key);
        }
    }
    return keys;
}
exports.getMegamiKeys = getMegamiKeys;
// 指定したメガミのカードIDリストを取得
function getMegamiCardIds(megami, cardSet, baseType, includeExtra) {
    if (includeExtra === void 0) { includeExtra = false; }
    var ret = [];
    var _loop_1 = function (key) {
        var data = sakuraba.CARD_DATA[cardSet][key];
        var megamiData = sakuraba.MEGAMI_DATA[megami];
        var replacedByAnother = sakuraba.ALL_CARD_LIST[cardSet].find(function (x) { return x.anotherID !== undefined && x.replace === key; });
        if ((baseType === null || data.baseType === baseType) && (includeExtra || !data.extra)) {
            if (megamiData.anotherID) {
                // アナザーメガミである場合の所有カード判定
                // 通常メガミが持ち、かつアナザーで置き換えられていないカードを追加
                if (data.megami === megamiData.base && (data.anotherID === undefined) && !replacedByAnother) {
                    ret.push(key);
                }
                // アナザーメガミ用のカードを追加
                if (data.megami === megamiData.base && (data.anotherID === megamiData.anotherID)) {
                    ret.push(key);
                }
            }
            else {
                // 通常メガミである場合、メガミの種類が一致している通常カードを全て追加
                if (data.megami === megami && (data.anotherID === undefined)) {
                    ret.push(key);
                }
            }
        }
    };
    // 全カードを探索し、指定されたメガミと対応するカードを、カードIDリストへ追加する
    for (var _i = 0, _a = sakuraba.ALL_CARD_ID_LIST[cardSet]; _i < _a.length; _i++) {
        var key = _a[_i];
        _loop_1(key);
    }
    return ret;
}
exports.getMegamiCardIds = getMegamiCardIds;


/***/ }),

/***/ "./src/sakuraba/utils/firestore.ts":
/*!*****************************************!*\
  !*** ./src/sakuraba/utils/firestore.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = __webpack_require__(/*! sakuraba/const */ "./src/sakuraba/const.ts");
var moment = __webpack_require__(/*! moment */ "moment");
/** 指定したオブジェクトをfirestoreに保存可能な形式に変換 */
function convertForFirestore(target) {
    var newValue = convertValueForFirestore(target);
    console.log('convert %o -> %o', target, newValue);
    return newValue;
}
exports.convertForFirestore = convertForFirestore;
/** 指定した値をfirestoreに保存可能な形式に変換 */
function convertValueForFirestore(value) {
    // undefined, 関数は無視 (すべてundefinedに変換する)
    if (value === undefined || typeof value === 'function') {
        return undefined;
    }
    // nullはそのまま返す
    if (value === null) {
        return value;
    }
    // 配列、objectは再帰的に処理
    if (Array.isArray(value)) {
        return value.map(function (x) { return convertValueForFirestore(x); });
    }
    if (typeof value === 'object') {
        var ret = {};
        for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
            var key = _a[_i];
            var newValue = convertValueForFirestore(value[key]);
            if (newValue !== undefined) {
                ret[key] = newValue;
            }
        }
        ;
        return ret;
    }
    // それ以外の値はそのまま
    return value;
}
exports.convertValueForFirestore = convertValueForFirestore;
/** ログをFirestoreへ送信 */
function sendLogToFirestore(db, tableId, logs, updateBy) {
    var tableRef = db.collection(const_1.StoreName.TABLES).doc(tableId);
    var logsRef = tableRef.collection(const_1.StoreName.LOGS);
    // トランザクション開始
    db.runTransaction(function (tran) {
        // テーブル情報を取得
        return tran.get(tableRef).then(function (tableSS) {
            var table = tableSS.data();
            var logNo = table.lastLogNo;
            // ログNOを採番しながら登録
            logs.forEach(function (log) {
                logNo++;
                log.no = logNo; // 付番
                var storedLog = convertForFirestore(log);
                tran.set(logsRef.doc(logNo.toString()), storedLog);
            });
            // ボード情報は更新しない
            var tableObj = {
                stateDataVersion: 2,
                lastLogNo: logNo,
                updatedAt: moment().format(),
                updatedBy: updateBy
            };
            tran.update(tableRef, tableObj);
        });
    }).then(function () {
        console.log("Log written to firestore");
    });
}
exports.sendLogToFirestore = sendLogToFirestore;


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
__export(__webpack_require__(/*! ./cardData */ "./src/sakuraba/utils/cardData.ts"));
__export(__webpack_require__(/*! ./megamiData */ "./src/sakuraba/utils/megamiData.ts"));
__export(__webpack_require__(/*! ./log */ "./src/sakuraba/utils/log.ts"));
__export(__webpack_require__(/*! ./firestore */ "./src/sakuraba/utils/firestore.ts"));


/***/ }),

/***/ "./src/sakuraba/utils/log.ts":
/*!***********************************!*\
  !*** ./src/sakuraba/utils/log.ts ***!
  \***********************************/
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
var models = __importStar(__webpack_require__(/*! sakuraba/models */ "./src/sakuraba/models/index.ts"));
var megamiData_1 = __webpack_require__(/*! ./megamiData */ "./src/sakuraba/utils/megamiData.ts");
var i18next_1 = __webpack_require__(/*! i18next */ "i18next");
var cardData_1 = __webpack_require__(/*! ./cardData */ "./src/sakuraba/utils/cardData.ts");
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
// パラメータとして渡されたログ値を、保存用の形式に変換する
function convertLogValueForState(val) {
    var params = {};
    if (val[1] !== null) {
        for (var paramName in val[1]) {
            params[paramName] = convertLogParamValueForState(val[1][paramName]);
        }
    }
    return { type: 'ls', key: val[0], params: params };
}
exports.convertLogValueForState = convertLogValueForState;
function convertLogParamValueForState(val) {
    if (typeof val === 'number') {
        return val.toString();
    }
    else if (typeof val === 'string') {
        return val;
    }
    else if (Array.isArray(val)) {
        return convertLogValueForState(val);
    }
    else {
        return val;
    }
}
/**
 * ログオブジェクトを翻訳する (パラメータの中に翻訳対象オブジェクトが含まれていれば再帰的に翻訳)
 */
function translateLog(log, detectedLanguage, languageSetting) {
    if (!log)
        return "";
    var buf = "";
    if (Array.isArray(log)) {
        // 配列が渡された場合、全要素を翻訳して結合
        return log.map(function (x) { return translateLog(x, detectedLanguage, languageSetting); }).join('');
    }
    else {
        // 固定文字列
        if (typeof log === 'string') {
            return log;
        }
        // 数値 (文字列に変換)
        if (typeof log === 'number') {
            return log.toString();
        }
        // 翻訳対象文字列
        if (log.type === 'ls') {
            var params = {};
            for (var k in log.params) {
                params[k] = translateLog(log.params[k], detectedLanguage, languageSetting); // パラメータも再帰的に翻訳する
            }
            // i18nextで翻訳した結果を返す
            return i18next_1.t(log.key, params);
        }
        // カード名
        if (log.type === 'cn') {
            var cardData = new models.CardData(log.cardSet, log.cardId, detectedLanguage, languageSetting, false);
            return cardData.name;
        }
        // カードセット名
        if (log.type === 'cs') {
            return cardData_1.getCardSetName(log.cardSet);
        }
        // メガミ名
        if (log.type === 'mn') {
            // i18nextから現在の言語を取得
            return megamiData_1.getMegamiDispName(languageSetting.ui, log.megami);
        }
    }
    return undefined;
}
exports.translateLog = translateLog;
/** カードの領域名をログ出力形式で取得 */
function getCardRegionTitleLog(selfSide, side, region, cardSet, linkedCard) {
    var ret = [];
    // 相手側に移動する場合は「相手の」を付加
    if (selfSide !== side) {
        ret.push({ type: 'ls', key: '領域名-相手の' });
    }
    // 領域名ログを返す
    if (region === 'hand') {
        ret.push({ type: 'ls', key: "領域名-手札" });
    }
    if (region === 'hidden-used') {
        ret.push({ type: 'ls', key: "領域名-伏せ札" });
    }
    if (region === 'library') {
        ret.push({ type: 'ls', key: "領域名-山札" });
    }
    if (region === 'special') {
        ret.push({ type: 'ls', key: "領域名-切札" });
    }
    if (region === 'used') {
        ret.push({ type: 'ls', key: "領域名-使用済み" });
    }
    if (region === 'extra') {
        ret.push({ type: 'ls', key: "領域名-追加札" });
    }
    if (region === 'on-card') {
        ret.push({ type: 'ls', key: '領域名-[CARDNAME]の下', params: { cardName: { type: 'cn', cardSet: cardSet, cardId: linkedCard.cardId } } });
    }
    return ret;
}
exports.getCardRegionTitleLog = getCardRegionTitleLog;
/** 桜花結晶のリージョン名を取得 */
function getSakuraTokenRegionTitleLog(selfSide, side, region, cardSet, linkedCard) {
    var ret = [];
    // 相手側に移動する場合は「相手の」を付加
    if (selfSide !== side) {
        ret.push({ type: 'ls', key: '領域名-相手の' });
    }
    // 領域名ログを返す
    if (region === 'aura') {
        ret.push({ type: 'ls', key: "領域名-オーラ" });
    }
    if (region === 'life') {
        ret.push({ type: 'ls', key: "領域名-ライフ" });
    }
    if (region === 'flair') {
        ret.push({ type: 'ls', key: "領域名-フレア" });
    }
    if (region === 'distance') {
        ret.push({ type: 'ls', key: "領域名-間合" });
    }
    if (region === 'dust') {
        ret.push({ type: 'ls', key: "領域名-ダスト" });
    }
    if (region === 'machine') {
        ret.push({ type: 'ls', key: "領域名-マシン" });
    }
    if (region === 'burned') {
        ret.push({ type: 'ls', key: "領域名-燃焼済" });
    }
    if (region === 'out-of-game') {
        ret.push({ type: 'ls', key: "領域名-ゲーム外" });
    }
    if (region === 'on-card') {
        ret.push({ type: 'ls', key: '領域名-[CARDNAME]上', params: { cardName: { type: 'cn', cardSet: cardSet, cardId: linkedCard.cardId } } });
    }
    return ret;
}
exports.getSakuraTokenRegionTitleLog = getSakuraTokenRegionTitleLog;


/***/ }),

/***/ "./src/sakuraba/utils/megamiData.ts":
/*!******************************************!*\
  !*** ./src/sakuraba/utils/megamiData.ts ***!
  \******************************************/
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
/** メガミの表示名を取得（象徴武器表示あり） */
function getMegamiDispNameWithSymbol(lang, megami) {
    var data = sakuraba.MEGAMI_DATA[megami];
    if (lang === 'zh') {
        return data.nameZh + "(" + data.symbolZh + ")";
    }
    else if (lang === 'en') {
        return data.nameEn + " (" + data.symbolEn + ")";
    }
    else {
        return data.name + "(" + data.symbol + ")";
    }
}
exports.getMegamiDispNameWithSymbol = getMegamiDispNameWithSymbol;
/** メガミの表示名を取得 */
function getMegamiDispName(lang, megami) {
    var data = sakuraba.MEGAMI_DATA[megami];
    if (lang === 'zh') {
        return "" + data.nameZh;
    }
    else if (lang === 'en') {
        return "" + data.nameEn;
    }
    else {
        return "" + data.name;
    }
}
exports.getMegamiDispName = getMegamiDispName;


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
var hyperapp_1 = __webpack_require__(/*! hyperapp */ "hyperapp");
/** プレイヤーサイドを逆にする */
function flipSide(side) {
    if (side === 'p1')
        return 'p2';
    if (side === 'p2')
        return 'p1';
    return side;
}
exports.flipSide = flipSide;
/** カードの適切な公開状態を判定 */
function judgeCardOpenState(cardSet, card, handOpenFlag, cardSide, cardRegion) {
    if (cardSide === undefined)
        cardSide = card.side;
    if (cardRegion === undefined)
        cardRegion = card.region;
    var cardData = sakuraba.CARD_DATA[cardSet][card.cardId];
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
/**
 * 改行を<br>に変換
 */
function nl2br(str) {
    return str.replace(/\n/g, '<br>');
}
exports.nl2br = nl2br;
/**
 * 改行を<br>に変換し、JSX要素のリストとして返す
 */
function nl2brJsx(str) {
    var lines = str.split(/\n/g);
    var ret = [];
    var firstLine = true;
    lines.forEach(function (line) {
        if (!firstLine) {
            ret.push(hyperapp_1.h('br'));
        }
        ret.push(line);
        firstLine = false;
    });
    return ret;
}
exports.nl2brJsx = nl2brJsx;


/***/ }),

/***/ "./src/sakuraba/utils/modal.ts":
/*!*************************************!*\
  !*** ./src/sakuraba/utils/modal.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = __webpack_require__(/*! ./misc */ "./src/sakuraba/utils/misc.ts");
function confirmModal(desc, yesCallback) {
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');
    var target = '#CONFIRM-MODAL';
    $(target + " .description").html(misc_1.nl2br(desc));
    $("" + target)
        .modal({ closable: false, onApprove: yesCallback })
        .modal('show');
}
exports.confirmModal = confirmModal;
/** メッセージを表示する */
function messageModal(desc) {
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');
    $('#MESSAGE-MODAL .description').html(misc_1.nl2br(desc));
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
    $('#INPUT-MODAL .description-body').html(misc_1.nl2br(desc));
    $('#INPUT-MODAL')
        .modal({ closable: false, onApprove: decideCallback })
        .modal('show');
}
exports.userInputModal = userInputModal;
/** V1のアクションログを最新の形式へコンバート */
function convertV1ActionLogs(v1Logs, startingNo, watchers) {
    var newLogs = [];
    var currentNo = startingNo;
    for (var _i = 0, v1Logs_1 = v1Logs; _i < v1Logs_1.length; _i++) {
        var v1Log = v1Logs_1[_i];
        var newLog = {
            no: currentNo,
            type: 'a',
            body: v1Log.body,
            visibility: v1Log.visibility,
            time: v1Log.time,
            side: v1Log.side
        };
        if (v1Log.side === 'watcher') {
            newLog.watcherSessionId = v1Log.watcherSessionId;
            newLog.watcherName = (watchers[v1Log.watcherSessionId] ? watchers[v1Log.watcherSessionId].name : '?');
        }
        newLogs.push(newLog);
        currentNo++;
    }
    return newLogs;
}
exports.convertV1ActionLogs = convertV1ActionLogs;
/** V1のチャットログを最新の形式へコンバート */
function convertV1ChatLogs(v1Logs, startingNo, watchers) {
    var newLogs = [];
    var currentNo = startingNo;
    for (var _i = 0, v1Logs_2 = v1Logs; _i < v1Logs_2.length; _i++) {
        var v1Log = v1Logs_2[_i];
        var newLog = {
            no: currentNo,
            type: 'c',
            body: v1Log.body,
            visibility: v1Log.visibility,
            time: v1Log.time,
            side: v1Log.side
        };
        if (v1Log.side === 'watcher') {
            newLog.watcherSessionId = v1Log.watcherSessionId;
            newLog.watcherName = (watchers[v1Log.watcherSessionId] ? watchers[v1Log.watcherSessionId].name : '?');
        }
        newLogs.push(newLog);
        currentNo++;
    }
    return newLogs;
}
exports.convertV1ChatLogs = convertV1ChatLogs;


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
        stateDataVersion: 2,
        board: {
            objects: [],
            playerNames: { p1: null, p2: null },
            watchers: {},
            megamis: { p1: null, p2: null },
            cardSet: 'na-s3',
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
        notifyLog: [],
        actionLogVisible: false,
        helpVisible: false,
        settingVisible: false,
        cardListVisible: false,
        bgmPlaying: false,
        zoom: 1,
        firestore: null,
        cardListSelectedMegami: 'yurina',
        setting: {
            settingDataVersion: 2,
            megamiFaceViewMode: 'background1',
            language: { type: 'auto', ui: null, uniqueName: null, cardText: null }
        },
        detectedLanguage: null,
        environment: 'development'
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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(/*! express */ "express");
var path = __importStar(__webpack_require__(/*! path */ "path"));
var randomstring = __importStar(__webpack_require__(/*! randomstring */ "randomstring"));
var utils = __importStar(__webpack_require__(/*! sakuraba/utils */ "./src/sakuraba/utils/index.ts"));
var nodemailer_1 = __importDefault(__webpack_require__(/*! nodemailer */ "nodemailer"));
var body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
var const_1 = __webpack_require__(/*! sakuraba/const */ "./src/sakuraba/const.ts");
var i18next = __webpack_require__(/*! i18next */ "i18next");
// import LocizeBackend = require('i18next-node-locize-backend');
var FilesystemBackend = __webpack_require__(/*! i18next-node-fs-backend */ "i18next-node-fs-backend");
var i18nextMiddleware = __webpack_require__(/*! i18next-express-middleware */ "i18next-express-middleware");
// import webpackNodeExternals = require('webpack-node-externals');
var js_base64_1 = __webpack_require__(/*! js-base64 */ "js-base64");
var moment = __webpack_require__(/*! moment */ "moment");
var util_1 = __webpack_require__(/*! util */ "util");
var firebase = __webpack_require__(/*! firebase */ "firebase");
__webpack_require__(/*! firebase/firestore */ "firebase/firestore");
// const admin = require('firebase-admin');
//const RedisClient = redis.createClient(process.env.REDIS_URL);
var RedisClient = null;
var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, '../index.html');
var MAIN_JS = path.join(__dirname, 'main.js');
var MAIN_JS_MAP = path.join(__dirname, 'main.js.map');
var TOPPAGE_JS = path.join(__dirname, 'toppage.js');
var TOPPAGE_JS_MAP = path.join(__dirname, 'toppage.js.map');
var browserSyncConfigurations = { "files": ["**/*.js", "views/*.ejs"] };
var app = express();
// admin.initializeApp({
firebase.initializeApp({
    // credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_CLOUD_KEYFILE_JSON))
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
});
// var db: firebase.firestore.Firestore = admin.firestore();
var db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
if (process.env.ENVIRONMENT === 'development') {
    var browserSync = __webpack_require__(/*! browser-sync */ "browser-sync");
    var connectBrowserSync = __webpack_require__(/*! connect-browser-sync */ "connect-browser-sync");
    app.use(connectBrowserSync(browserSync(browserSyncConfigurations)));
}
i18next
    .use(FilesystemBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
    defaultNS: 'common',
    ns: ['common', 'log', 'cardset', 'help-window', 'dialog', 'about-window', 'toppage'],
    load: 'all',
    debug: false,
    fallbackLng: 'en',
    parseMissingKeyHandler: function (k) { return "[" + k + "]"; },
    backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json'
    }
});
var firebaseAuthInfo = js_base64_1.Base64.encode(process.env.FIREBASE_API_KEY + " " + process.env.FIREBASE_AUTH_DOMAIN + " " + process.env.FIREBASE_DATABASE_URL + " " + process.env.FIREBASE_PROJECT_ID + " " + process.env.FIREBASE_STORAGE_BUCKET + " " + process.env.FIREBASE_MESSAGING_SENDER_ID);
app
    .set('views', __dirname + '/../views/')
    .set('view engine', 'ejs')
    .use(body_parser_1.default.json())
    .use(express.static('public'))
    .use(express.static('node_modules'))
    .use(i18nextMiddleware.handle(i18next, { ignoreRoutes: ['/dist'] }))
    .get('/locales/resources.json', i18nextMiddleware.getResourcesHandler(i18next, {})) // serves resources for consumers (browser)
    .get('/dist/main.js', function (req, res) { return res.sendFile(MAIN_JS); })
    .get('/dist/main.js.map', function (req, res) { return res.sendFile(MAIN_JS_MAP); })
    .get('/dist/toppage.js', function (req, res) { return res.sendFile(TOPPAGE_JS); })
    .get('/dist/toppage.js.map', function (req, res) { return res.sendFile(TOPPAGE_JS_MAP); });
// プレイヤーとして卓URLにアクセスしたときの処理
var playerRoute = function (req, res, lang) {
    // キーに対応する情報の取得を試みる
    db.collection(const_1.StoreName.PLAYER_KEY_MAP).doc(req.params.key).get().then(function (doc) {
        if (doc.exists) {
            // 描画スタート
            res.render('board', {
                tableId: doc.data().tableNo,
                side: doc.data().side,
                environment: process.env.ENVIRONMENT,
                version: const_1.VERSION,
                lang: lang,
                firebaseAuthInfo: firebaseAuthInfo
            });
        }
        else {
            res.status(404);
            res.end('NotFound : ' + req.path);
        }
    });
};
// 卓作成処理
var tableCreateRoute = function (req, res) {
    // 現在の卓番号を取得
    var metaRef = db.collection(const_1.StoreName.METADATA).doc('0');
    db.runTransaction(function (tran) {
        return tran.get(metaRef).then(function (metaDataDoc) {
            // 新しい卓番号を採番して記録
            var lastTableNo = 0;
            if (metaDataDoc.exists) {
                lastTableNo = metaDataDoc.data().lastTableNo;
            }
            var newTableNo = lastTableNo + 1;
            tran.set(metaRef, { lastTableNo: newTableNo });
            // 新しい卓を生成して記録
            var state = utils.createInitialState();
            var newTable = {
                board: state.board,
                stateDataVersion: 2,
                lastLogNo: 0,
                updatedAt: null,
                updatedBy: null
            };
            tran.set(db.collection(const_1.StoreName.TABLES).doc(newTableNo.toString()), newTable);
            // 卓へアクセスするための、プレイヤー1用アクセスキー、プレイヤー2用アクセスキーを生成
            var p1Key = randomstring.generate({
                length: 12,
                readable: true
            });
            var p2Key = randomstring.generate({
                length: 12,
                readable: true
            });
            // プレイヤーキーと卓の紐づけを記録
            var keyMapRef = db.collection(const_1.StoreName.PLAYER_KEY_MAP);
            var p1Ref = keyMapRef.doc(p1Key);
            tran.set(p1Ref, { tableNo: newTableNo, side: 'p1' });
            var p2Ref = keyMapRef.doc(p2Key);
            tran.set(p2Ref, { tableNo: newTableNo, side: 'p2' });
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
            // 生成したURL情報を返す
            res.json({ p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl });
        });
    });
};
// i18nextが判別した言語を、シミュレーターが解釈可能な言語に変換する処理
function convertLang(i18nLang) {
    if (i18nLang.startsWith('zh')) {
        return 'zh';
    }
    else if (i18nLang.startsWith('ja')) {
        return 'ja';
    }
    else {
        return 'en';
    }
}
// 言語をCookieに記憶する処理
var setLangCookie = function (lang, res) {
    var expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1年後
    res.cookie('i18next', lang, { expires: expirationDate });
};
app
    // 卓URL (プレイヤー)
    .get('/play/:key', function (req, res) {
    var i18n = req.i18n;
    var lang = convertLang(i18n.language); // i18nextが判別した言語から言語を判定
    if (req.query['lng'])
        setLangCookie(lang, res); // リクエストパラメータに言語があれば、自動判別した言語をcookieに記憶
    res.header('Content-Language', lang); // 自動判別した言語を設定
    playerRoute(req, res, lang);
})
    // 卓URL (観戦者用)
    .get('/watch/:tableId', function (req, res) {
    var i18n = req.i18n;
    var lang = convertLang(i18n.language); // i18nextが判別した言語から言語を判定
    if (req.query['lng'])
        setLangCookie(lang, res); // リクエストパラメータに言語があれば、自動判別した言語をcookieに記憶
    res.header('Content-Language', lang); // 自動判別した言語を設定
    res.render('board', { tableId: req.params.tableId, side: 'watcher', environment: process.env.ENVIRONMENT, version: const_1.VERSION, lang: lang, firebaseAuthInfo: firebaseAuthInfo });
})
    // トップページ
    .get('/', function (req, res) {
    var i18n = req.i18n;
    var lang = convertLang(i18n.language); // i18nextが判別した言語から言語を判定
    if (req.query['lng'])
        setLangCookie(lang, res); // リクエストパラメータに言語があれば、自動判別した言語をcookieに記憶
    res.header('Content-Language', lang); // 自動判別した言語を設定
    res.render('index', { environment: process.env.ENVIRONMENT, version: const_1.VERSION, lang: lang });
})
    // 新しい卓の作成
    .post('/tables.create', function (req, res) { return tableCreateRoute(req, res); })
    // Redisからコンバート
    .get('/.convert/:tableIdStart-:tableIdEnd', function (req, res) {
    for (var i = parseInt(req.params.tableIdStart); i <= parseInt(req.params.tableIdEnd); i++) {
        convertRedisTable(i.toString());
    }
    res.status(200).send('Complete.');
})
    .get('/.convertSum/:tableIdStart-:tableIdEnd', function (req, res) {
    // 現在の卓番号を取得
    var getAsync = util_1.promisify(RedisClient.get).bind(RedisClient);
    var llenAsync = util_1.promisify(RedisClient.llen).bind(RedisClient);
    var existsAsync = util_1.promisify(RedisClient.exists).bind(RedisClient);
    getAsync('sakuraba:currentTableNo').then(function (v) {
        console.log("currentTableNo: %s", v);
        var currentTableNo = parseInt(v);
        // アクションログの数をすべての卓について取得し、結果を出力する関数
        function getActionLogTotalCount(start, end) {
            return __awaiter(this, void 0, void 0, function () {
                var total, i, c;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            total = 0;
                            i = start;
                            _a.label = 1;
                        case 1:
                            if (!(i <= end && i <= currentTableNo)) return [3 /*break*/, 6];
                            return [4 /*yield*/, existsAsync("sakuraba:tables:" + i + ":board")];
                        case 2:
                            if (_a.sent()) {
                                total += 1;
                            }
                            else {
                                console.log("!! table " + i + " board not found!");
                            }
                            return [4 /*yield*/, llenAsync("sakuraba:tables:" + i + ":actionLogs")];
                        case 3:
                            c = _a.sent();
                            total += c;
                            console.log("table " + i + " actionLogs x" + c);
                            return [4 /*yield*/, llenAsync("sakuraba:tables:" + i + ":chatLogs")];
                        case 4:
                            c = _a.sent();
                            total += c;
                            console.log("table " + i + " chatLogs x" + c);
                            _a.label = 5;
                        case 5:
                            i++;
                            return [3 /*break*/, 1];
                        case 6:
                            console.log("total: " + total);
                            return [2 /*return*/];
                    }
                });
            });
        }
        getActionLogTotalCount(parseInt(req.params.tableIdStart), parseInt(req.params.tableIdEnd));
    });
    res.status(200).send('Complete.');
})
    .get('/.convertAll', function (req, res) {
    var tableId = req.params.tableId;
    RedisClient.HGETALL("sakuraba:player-key-map", function (err, data) {
        if (data !== null) {
            var batch = void 0;
            var op = 0;
            batch = db.batch();
            for (var key in data) {
                var rec = JSON.parse(data[key]);
                batch.set(db.collection(const_1.StoreName.PLAYER_KEY_MAP).doc(key), { side: rec.side, tableNo: rec.tableId });
                console.log(rec);
                op++;
                if (op >= 400) {
                    batch.commit().then(function () {
                        console.log("wrote.");
                    }).catch(function (reason) {
                        res.status(400).send(reason);
                    });
                    batch = db.batch();
                }
            }
            batch.commit().then(function () {
                res.status(200).send('OK.');
            }).catch(function (reason) {
                res.status(400).send(reason);
            });
        }
    });
})
    .post('/.error-send', function (req, res) {
    var sendgrid_username = process.env.SENDGRID_USERNAME;
    var sendgrid_password = process.env.SENDGRID_PASSWORD;
    var sendgrid_to = process.env.SENDGRID_TO;
    var setting = {
        host: 'smtp.sendgrid.net',
        port: 587,
        requiresAuth: true,
        auth: {
            user: sendgrid_username,
            pass: sendgrid_password
        }
    };
    var mailer = nodemailer_1.default.createTransport(setting);
    mailer.sendMail({
        from: 'noreply@morphball.net',
        to: sendgrid_to,
        subject: '[ふるよにボードシミュレーター]',
        text: JSON.stringify(req.body)
    });
});
var server = app.listen(PORT, function () { return console.log("Listening on " + PORT); });
function convertRedisTable(tableId) {
    getStoredBoard(tableId, function (board) {
        getStoredActionLogs(tableId, function (actionLogs) {
            getStoredChatLogs(tableId, function (chatLogs) {
                console.log("convert table %s", tableId);
                if (board) {
                    var tableRef = db.collection(const_1.StoreName.TABLES).doc(tableId);
                    var newActionLogs = utils.convertV1ActionLogs(actionLogs, 1, board.watchers);
                    var newChatLogs = utils.convertV1ChatLogs(chatLogs, newActionLogs.length + 1, board.watchers);
                    // オペレーションのリストを作る
                    var operations = [];
                    operations.push(['delete', tableRef, null]);
                    var newTable = {
                        board: board,
                        lastLogNo: newActionLogs.length + newChatLogs.length,
                        stateDataVersion: 2,
                        updatedAt: moment().format(),
                        updatedBy: 'convertBatch'
                    };
                    operations.push(['set', tableRef, newTable]);
                    var logsRef = tableRef.collection(const_1.StoreName.LOGS);
                    var newLogs = newActionLogs.concat(newChatLogs);
                    for (var _i = 0, newLogs_1 = newLogs; _i < newLogs_1.length; _i++) {
                        var log = newLogs_1[_i];
                        operations.push(['set', logsRef.doc(log.no.toString()), log]);
                    }
                    //console.log("%d operations", operations.length);
                    for (var i = 0; i < Math.ceil(operations.length / 100); i++) {
                        //console.log(i);
                        //console.log("  - seq %d", i);
                        var batch = db.batch();
                        for (var j = 0; (i * 100 + j) < operations.length && j < 100; j++) {
                            var _a = operations[i * 100 + j], op = _a[0], ref = _a[1], data = _a[2];
                            if (op === 'set') {
                                batch.set(ref, data);
                            }
                            if (op === 'delete') {
                                batch.delete(ref);
                            }
                        }
                        //batch.commit();
                    }
                    //console.log("completed.")
                }
            });
        });
    });
}
/** Redis上に保存されたボードデータを取得 */
function getStoredBoard(tableId, callback) {
    // ボード情報を取得
    RedisClient.GET("sakuraba:tables:" + tableId + ":board", function (err, json) {
        var boardData = JSON.parse(json);
        // カードセット情報がなければ初期値をセット
        if (boardData && boardData.cardSet === undefined) {
            boardData.cardSet = 'na-s2';
        }
        // コールバックを実行
        callback(boardData);
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


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

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

/***/ "firebase":
/*!***************************!*\
  !*** external "firebase" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("firebase");

/***/ }),

/***/ "firebase/firestore":
/*!*************************************!*\
  !*** external "firebase/firestore" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("firebase/firestore");

/***/ }),

/***/ "hyperapp":
/*!***************************!*\
  !*** external "hyperapp" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("hyperapp");

/***/ }),

/***/ "i18next":
/*!**************************!*\
  !*** external "i18next" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("i18next");

/***/ }),

/***/ "i18next-express-middleware":
/*!*********************************************!*\
  !*** external "i18next-express-middleware" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("i18next-express-middleware");

/***/ }),

/***/ "i18next-node-fs-backend":
/*!******************************************!*\
  !*** external "i18next-node-fs-backend" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("i18next-node-fs-backend");

/***/ }),

/***/ "js-base64":
/*!****************************!*\
  !*** external "js-base64" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("js-base64");

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

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nodemailer");

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

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map