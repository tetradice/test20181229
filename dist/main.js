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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sakuraba = __webpack_require__(/*! ./sakuraba */ "./src/sakuraba.ts");
var Layouter = /** @class */ (function () {
    function Layouter() {
    }
    // 横に並んだカードやトークンをレイアウトする
    Layouter.exec = function (selector, frameWidth, spacing, padding) {
        if (spacing === void 0) { spacing = 8; }
        if (padding === void 0) { padding = 4; }
        var $elems = $(selector);
        var itemWidth = $elems.outerWidth();
        $elems.each(function (i, elem) {
            $(elem).css('left', padding + (itemWidth + spacing) * i + "px").css('top', padding + "px");
        });
    };
    return Layouter;
}());
var Component = /** @class */ (function () {
    function Component() {
        this.draggable = true;
        this.rotated = 0;
        this.left = 0;
        this.top = 0;
        this.drawn = false;
    }
    /**
     * 位置が変更されていればtrue
     */
    Component.prototype.isLocationChanged = function () {
        return this.region !== this.oldRegion
            || this.indexOfRegion !== this.oldIndexOfRegion
            || this.draggable !== this.oldDraggable
            || this.rotated !== this.oldRotated;
    };
    Component.prototype.updateLocation = function () {
        this.oldRegion = this.region;
        this.oldIndexOfRegion = this.indexOfRegion;
        this.oldDraggable = this.draggable;
        this.oldRotated = this.rotated;
    };
    Object.defineProperty(Component.prototype, "zIndexOffset", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return Component;
}());
var CardComponent = /** @class */ (function (_super) {
    __extends(CardComponent, _super);
    function CardComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.opened = false;
        return _this;
    }
    CardComponent.prototype.toHtml = function () {
        return ("<div class=\"fbs-card\" draggable=\"true\" id=\"" + this.htmlElementId + "\" data-card-id=\"" + this.card.id + "\" data-html=\"" + this.getDescriptionHtml() + "\"></div>");
    };
    CardComponent.prototype.isLocationChanged = function () {
        return _super.prototype.isLocationChanged.call(this) || this.opened !== this.oldOpened;
    };
    CardComponent.prototype.updateLocation = function () {
        _super.prototype.updateLocation.call(this);
        this.oldOpened = this.opened;
    };
    CardComponent.prototype.getDescriptionHtml = function () {
        console.log(board);
        var board2 = new sakuraba.Board();
        board2.p1Side.library.push(new sakuraba.Card('01-yurina-o-n-3'));
        console.log(board2);
        var cardTitleHtml = "<ruby><rb>" + this.card.data.name + "</rb><rp>(</rp><rt>" + this.card.data.ruby + "</rt><rp>)</rp></ruby>";
        var html = "<div class='ui header' style='margin-right: 2em;'>" + cardTitleHtml;
        html += "</div><div class='ui content'>";
        var typeCaptions = [];
        if (this.card.data.types.indexOf('attack') >= 0)
            typeCaptions.push("<span style='color: red; font-weight: bold;'>攻撃</span>");
        if (this.card.data.types.indexOf('action') >= 0)
            typeCaptions.push("<span style='color: blue; font-weight: bold;'>行動</span>");
        if (this.card.data.types.indexOf('enhance') >= 0)
            typeCaptions.push("<span style='color: green; font-weight: bold;'>付与</span>");
        if (this.card.data.types.indexOf('reaction') >= 0)
            typeCaptions.push("<span style='color: purple; font-weight: bold;'>対応</span>");
        if (this.card.data.types.indexOf('fullpower') >= 0)
            typeCaptions.push("<span style='color: gold; font-weight: bold;'>全力</span>");
        html += "" + typeCaptions.join('/');
        if (this.card.data.range !== undefined) {
            html += "<span style='margin-left: 1em;'>\u9069\u6B63\u8DDD\u96E2" + this.card.data.range + "</span>";
        }
        html += "<br>";
        if (this.card.data.baseType === 'special') {
            html += "<div class='ui top right attached label'>\u6D88\u8CBB: " + this.card.data.cost + "</div>";
        }
        if (this.card.data.types.indexOf('enhance') >= 0) {
            html += "\u7D0D: " + this.card.data.capacity + "<br>";
        }
        if (this.card.data.damage !== undefined) {
            html += this.card.data.damage + "<br>";
        }
        html += "" + this.card.data.text.replace('\n', '<br>');
        html += "</div>";
        return html;
    };
    return CardComponent;
}(Component));
var SakuraTokenComponent = /** @class */ (function (_super) {
    __extends(SakuraTokenComponent, _super);
    function SakuraTokenComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cardId = null;
        return _this;
    }
    SakuraTokenComponent.prototype.toHtml = function () {
        return ("<div class=\"sakura-token\" draggable=\"true\" id=\"" + this.htmlElementId + "\"></div>");
    };
    Object.defineProperty(SakuraTokenComponent.prototype, "zIndexOffset", {
        get: function () {
            return 100;
        },
        enumerable: true,
        configurable: true
    });
    return SakuraTokenComponent;
}(Component));
var VigorComponent = /** @class */ (function (_super) {
    __extends(VigorComponent, _super);
    function VigorComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VigorComponent.prototype.toHtml = function () {
        return ("<div class=\"fbs-vigor-card\" id=\"" + this.htmlElementId + "\">\n        <div class=\"vigor0\"></div>\n        <div class=\"vigor1\"></div>\n        <div class=\"vigor2\"></div>\n        </div>");
    };
    // 表示状態を決定
    VigorComponent.prototype.setVigor = function (value) {
        if (value === 0) {
            this.rotated = 1;
        }
        if (value === 1) {
            this.rotated = 0;
        }
        if (value === 2) {
            this.rotated = -1;
        }
    };
    return VigorComponent;
}(Component));
// 盤を定義
var board = new sakuraba.Board();
var myBoardSide = board.getMySide(params.side);
// コンポーネント一覧
var components = [];
// 変数を定義
var draggingFrom = null;
var contextMenuShowingAfterDrop = false;
// 関数
function shuffle(array) {
    var n = array.length, t, i;
    while (n) {
        i = Math.floor(Math.random() * n--);
        t = array[n];
        array[n] = array[i];
        array[i] = t;
    }
    return array;
}
function createCardComponent(card, region, indexOfRegion) {
    var newCard = new CardComponent;
    newCard.card = card;
    newCard.htmlElementId = "fbs-card-" + card.id;
    newCard.region = region;
    newCard.indexOfRegion = indexOfRegion;
    newCard.opened = false;
    components.push(newCard);
    return newCard;
}
function createVigorComponent() {
    var comp = new VigorComponent;
    comp.region = 'vigor';
    comp.htmlElementId = "fbs-vigor-card";
    components.push(comp);
}
var sakuraTokenTotalCount = 0;
function createSakuraTokenComponent(region, count) {
    for (var i = 0; i < count; i++) {
        var newComp = new SakuraTokenComponent;
        newComp.region = region;
        newComp.indexOfRegion = i;
        newComp.htmlElementId = "sakura-token-" + sakuraTokenTotalCount;
        sakuraTokenTotalCount++;
        components.push(newComp);
    }
}
// 盤上のコンポーネント表示を更新
function updateComponents() {
    // 山札の再配置
    var libraryOffset = $('.area.library.background').position();
    components.filter(function (x) { return x.region === 'library'; }).forEach(function (comp, i) {
        comp.left = libraryOffset.left + 4 + comp.indexOfRegion * 8;
        comp.top = libraryOffset.top + 4 + comp.indexOfRegion * 3;
    });
    // 手札の再配置
    var handOffset = $('.area.hand.background').position();
    components.filter(function (x) { return x.region === 'hand'; }).forEach(function (comp, i) {
        comp.left = handOffset.left + 4 + comp.indexOfRegion * 108;
        comp.top = handOffset.top + 4;
    });
    // 切り札の再配置
    var specialOffset = $('.area.special.background').position();
    components.filter(function (x) { return x.region === 'special'; }).forEach(function (comp, i) {
        comp.left = specialOffset.left + 4 + comp.indexOfRegion * 108;
        comp.top = specialOffset.top + 4;
    });
    // 使用済札の再配置
    var usedOffset = $('.area.used.background').position();
    components.filter(function (x) { return x.region === 'used'; }).forEach(function (comp, i) {
        comp.left = usedOffset.left + 4 + comp.indexOfRegion * 108;
        comp.top = usedOffset.top + 4;
    });
    // 伏せ札の再配置
    var hiddenUsedOffset = $('.area.hidden-used.background').position();
    components.filter(function (x) { return x.region === 'hidden-used'; }).forEach(function (comp, i) {
        comp.left = 20 + hiddenUsedOffset.left + 4 + comp.indexOfRegion * 8;
        comp.top = -20 + hiddenUsedOffset.top + 4 + comp.indexOfRegion * 3;
    });
    // 集中力の再配置
    var vigorOffset = $('.area.vigor').position();
    components.filter(function (x) { return x instanceof VigorComponent; }).forEach(function (comp, i) {
        if (comp.rotated === 0) {
            comp.left = vigorOffset.left;
            comp.top = vigorOffset.top + 40;
        }
        else {
            comp.left = vigorOffset.left;
            comp.top = vigorOffset.top + 20;
        }
    });
    // 桜花結晶の再配置
    var distanceOffset = $('.area.sakura-token-region.distance').position();
    components.filter(function (x) { return x.region === 'distance'; }).forEach(function (comp, i) {
        comp.left = distanceOffset.left + 60 + ((28 + 4) * i);
        comp.top = distanceOffset.top + 2;
    });
    var dustOffset = $('.area.sakura-token-region.dust').position();
    components.filter(function (x) { return x.region === 'dust'; }).forEach(function (comp, i) {
        comp.left = dustOffset.left + 60 + ((28 + 4) * i);
        comp.top = dustOffset.top + 2;
    });
    var auraOffset = $('.area.sakura-token-region.aura').position();
    components.filter(function (x) { return x.region === 'aura'; }).forEach(function (comp, i) {
        comp.left = auraOffset.left + 60 + ((28 + 4) * i);
        comp.top = auraOffset.top + 2;
    });
    var lifeOffset = $('.area.sakura-token-region.life').position();
    components.filter(function (x) { return x.region === 'life'; }).forEach(function (comp, i) {
        comp.left = lifeOffset.left + 60 + ((28 + 4) * i);
        comp.top = lifeOffset.top + 2;
    });
    var flairOffset = $('.area.sakura-token-region.flair').position();
    components.filter(function (x) { return x.region === 'flair'; }).forEach(function (comp, i) {
        comp.left = flairOffset.left + 60 + ((28 + 4) * i);
        comp.top = flairOffset.top + 2;
    });
    components.filter(function (x) { return x.region === 'on-card'; }).forEach(function (comp, i) {
        var offset = $("[data-card-id=" + comp.cardId + "]").position();
        comp.left = offset.left + 2 + comp.indexOfRegion * 20;
        comp.top = offset.top + 140 - 2 - 32;
    });
    // コンポーネントごとに描画/移動処理
    var boardOffset = $('#BOARD').offset();
    components.forEach(function (component, index) {
        var $elem = null;
        if (!component.drawn) {
            $('#BOARD').append(component.toHtml());
            $elem = $("#" + component.htmlElementId);
        }
        if (!component.drawn || component.isLocationChanged()) {
            if ($elem === null) {
                $elem = $("#" + component.htmlElementId);
            }
            updateComponentAttributes(component, $elem);
            // 古い位置情報を捨てる
            component.updateLocation();
        }
        // 描画済フラグを立てる
        if (!component.drawn) {
            component.drawn = true;
        }
    });
    // ライブラリカウント増減
    $('#LIBRARY-COUNT').text(myBoardSide.library.length).css({ right: parseInt($('.area.library.background').css('right')) + 8, bottom: parseInt($('.area.library.background').css('bottom')) + 8 });
}
function updateComponentAttributes(component, $elem) {
    // ドラッグ可能の判定
    if (component.draggable) {
        $elem.attr('draggable', '');
    }
    else {
        $elem.removeAttr('draggable');
    }
    // 回転
    $elem.removeClass(['rotated', 'reverse-rotated']);
    if (component.rotated === 1) {
        $elem.addClass('rotated');
    }
    else if (component.rotated === -1) {
        $elem.addClass('reverse-rotated');
    }
    // カード用の処理
    if (component instanceof CardComponent) {
        // 裏表の更新
        $elem.removeClass(['open-normal', 'back-normal', 'open-special', 'back-special']);
        if (component.card.data.baseType === 'normal') {
            if (component.opened) {
                $elem.addClass('open-normal');
            }
            else {
                $elem.addClass('back-normal');
            }
        }
        if (component.card.data.baseType === 'special') {
            if (component.opened) {
                $elem.addClass('open-special');
            }
            else {
                $elem.addClass('back-special');
            }
        }
        // 名称表示の更新
        $elem.text(component.opened ? component.card.data.name : '');
    }
    // 集中力用の処理
    if (component instanceof VigorComponent) {
        if (myBoardSide.vigor === 0) {
            $elem.find('.vigor1').addClass('clickable');
            $elem.find(':not(.vigor1)').removeClass('clickable');
        }
        if (myBoardSide.vigor === 1) {
            $elem.find('.vigor0, .vigor2').addClass('clickable');
            $elem.find('.vigor1').removeClass('clickable');
        }
        if (myBoardSide.vigor === 2) {
            $elem.find('.vigor1').addClass('clickable');
            $elem.find(':not(.vigor1)').removeClass('clickable');
        }
    }
    // 位置を移動 (向きを変えた後に実行する必要がある）
    $elem.css({ left: component.left, top: component.top });
    $elem.css({ zIndex: component.zIndexOffset + component.indexOfRegion });
    // リージョン属性付加
    $elem.attr('data-region', component.region);
}
function drawLibrary() {
    myBoardSide.library.forEach(function (card, i) {
        createCardComponent(card, 'library', i);
    });
}
function drawHands() {
    myBoardSide.hands.forEach(function (card, i) {
        createCardComponent(card, 'hand', i);
    });
}
function drawSpecials() {
    myBoardSide.specials.forEach(function (card, i) {
        createCardComponent(card, 'special', i);
    });
}
function drawUsed() {
    myBoardSide.used.forEach(function (card, i) {
        createCardComponent(card, 'used', innerWidth);
    });
}
function drawHiddenUsed() {
    myBoardSide.hiddenUsed.forEach(function (card, i) {
        createCardComponent(card, 'hidden-used', i);
    });
}
function drawVigor() {
    createVigorComponent();
}
function drawSakuraTokens() {
    createSakuraTokenComponent('distance', 10);
    createSakuraTokenComponent('aura', 3);
    createSakuraTokenComponent('life', 10);
}
function appendLog(text) {
    $('#LOG-AREA').append(text).append('<br>');
}
// カードを移動
function moveCard(from, fromIndex, to, addToBottom) {
    if (addToBottom === void 0) { addToBottom = false; }
    console.log('move card (%s[%d] -> %s)', from, fromIndex, to);
    // 移動可能かどうかをチェック
    // 移動
    var card;
    if (from === 'library') {
        card = myBoardSide.library.splice(fromIndex, 1)[0];
    }
    if (from === 'hand') {
        card = myBoardSide.hands.splice(fromIndex, 1)[0];
    }
    if (from === 'used') {
        card = myBoardSide.used.splice(fromIndex, 1)[0];
    }
    if (from === 'hidden-used') {
        card = myBoardSide.hiddenUsed.splice(fromIndex, 1)[0];
    }
    var toTarget;
    if (to === 'library') {
        toTarget = myBoardSide.library;
    }
    if (to === 'hand') {
        toTarget = myBoardSide.hands;
    }
    if (to === 'used') {
        toTarget = myBoardSide.used;
    }
    if (to === 'hidden-used') {
        toTarget = myBoardSide.hiddenUsed;
    }
    if (addToBottom) {
        toTarget.unshift(card);
    }
    else {
        toTarget.push(card);
    }
    // ログを追加
    if (from === 'library' && to === 'hand') {
        appendLog("\u30AB\u30FC\u30C9\u30921\u679A\u5F15\u304F \u21D2 " + card.data.name);
    }
    else if (from === 'hand' && to === 'used') {
        appendLog("\u300C" + card.data.name + "\u300D\u3092\u5834\u306B\u51FA\u3059");
    }
    else if (from === 'hand' && to === 'hidden-used') {
        appendLog("\u300C" + card.data.name + "\u300D\u3092\u4F0F\u305B\u672D");
    }
    else {
        var regionCaptions = {
            'library': '山札',
            'hand': '手札',
            'used': '場',
            'hidden-used': '伏せ札',
        };
        appendLog(regionCaptions[from] + "\u306E\u300C" + card.data.name + "\u300D\u3092" + regionCaptions[to] + "\u306B\u79FB\u52D5");
    }
    // コンポーネントのインデックス更新
    refreshCardComponentRegionInfo(from);
    refreshCardComponentRegionInfo(to);
    // 表示更新
    updateComponents();
    // 移動成功
    return true;
}
// コンポーネントの領域情報を更新
function refreshCardComponentRegionInfo(region) {
    var cards;
    if (region === 'library') {
        cards = myBoardSide.library;
    }
    if (region === 'hand') {
        cards = myBoardSide.hands;
    }
    if (region === 'used') {
        cards = myBoardSide.used;
    }
    if (region === 'hidden-used') {
        cards = myBoardSide.hiddenUsed;
    }
    if (region === 'special') {
        cards = myBoardSide.specials;
    }
    // カード情報の更新
    cards.forEach(function (card, i) {
        var comp = components.find(function (x) { return x instanceof CardComponent && x.card === card; });
        comp.region = region;
        comp.indexOfRegion = i;
        comp.draggable = (comp.region !== 'library' || comp.indexOfRegion === myBoardSide.library.length - 1);
        // 領域に依存する情報更新
        if (region === 'hand' || region === 'used') {
            comp.opened = true;
        }
        if (region === 'library' || region === 'hidden-used') {
            comp.opened = false;
        }
        if (region !== 'hidden-used') {
            comp.rotated = 0;
        }
        if (region === 'hidden-used') {
            comp.rotated = 1;
        }
    });
}
// コンポーネントの領域情報を更新
function refreshSakuraTokenComponentInfo() {
    var allSakuraTokens = components.filter(function (x) { return x instanceof SakuraTokenComponent; });
    var tokenIndex = 0;
    // 対象領域にある結晶数に応じて表示更新
    for (var i = 0; i < board.distance; i++) {
        var comp = allSakuraTokens[tokenIndex];
        comp.region = 'distance';
        comp.indexOfRegion = i;
        tokenIndex++;
    }
    for (var i = 0; i < board.dust; i++) {
        var comp = allSakuraTokens[tokenIndex];
        comp.region = 'dust';
        comp.indexOfRegion = i;
        tokenIndex++;
    }
    for (var i = 0; i < myBoardSide.aura; i++) {
        var comp = allSakuraTokens[tokenIndex];
        comp.region = 'aura';
        comp.indexOfRegion = i;
        tokenIndex++;
    }
    for (var i = 0; i < myBoardSide.life; i++) {
        var comp = allSakuraTokens[tokenIndex];
        comp.region = 'life';
        comp.indexOfRegion = i;
        tokenIndex++;
    }
    for (var i = 0; i < myBoardSide.flair; i++) {
        var comp = allSakuraTokens[tokenIndex];
        comp.region = 'flair';
        comp.indexOfRegion = i;
        tokenIndex++;
    }
    for (var cardId in board.tokensOnCard) {
        if (board.tokensOnCard.hasOwnProperty(cardId)) {
            for (var i = 0; i < board.tokensOnCard[cardId]; i++) {
                var comp = allSakuraTokens[tokenIndex];
                comp.region = 'on-card';
                comp.cardId = cardId;
                comp.indexOfRegion = i;
                tokenIndex++;
            }
        }
    }
}
// 桜花結晶を移動
function moveSakuraToken(from, to, cardId, count) {
    if (count === void 0) { count = 1; }
    console.log('move sakura token (%s -> %s * %d)', from, to, count);
    // 移動可能かどうかをチェック
    if (from === 'distance') {
        if (board.distance < count)
            return false; // 桜花結晶がなければ失敗
    }
    else if (from === 'dust') {
        if (board.dust < count)
            return false; // 桜花結晶がなければ失敗
    }
    else if (from === 'aura') {
        if (myBoardSide.aura < count)
            return false; // 桜花結晶がなければ失敗
    }
    else if (from === 'life') {
        if (myBoardSide.life < count)
            return false; // 桜花結晶がなければ失敗
    }
    else if (from === 'flair') {
        if (myBoardSide.flair < count)
            return false; // 桜花結晶がなければ失敗
    }
    if (to === 'distance') {
        if ((board.distance + count) > 10)
            return false; // 間合い最大値を超える場合は失敗
    }
    else if (to === 'aura') {
        if ((myBoardSide.aura + count) > 5)
            return false; // オーラ最大値を超える場合は失敗
    }
    // 移動
    if (from === 'distance') {
        board.distance -= count;
    }
    else if (from === 'dust') {
        board.dust -= count;
    }
    else if (from === 'aura') {
        myBoardSide.aura -= count;
    }
    else if (from === 'life') {
        myBoardSide.life -= count;
    }
    else if (from === 'flair') {
        myBoardSide.flair -= count;
    }
    if (to === 'distance') {
        board.distance += count;
    }
    else if (to === 'dust') {
        board.dust += count;
    }
    else if (to === 'aura') {
        myBoardSide.aura += count;
    }
    else if (to === 'life') {
        myBoardSide.life += count;
    }
    else if (to === 'flair') {
        myBoardSide.flair += count;
    }
    else if (to === 'on-card') {
        if (board.tokensOnCard[cardId] === undefined)
            board.tokensOnCard[cardId] = 0;
        board.tokensOnCard[cardId] += count;
    }
    console.log(board);
    // コンポーネントのインデックス更新
    refreshSakuraTokenComponentInfo();
    // 表示更新
    updateComponents();
    // 移動成功
    return true;
}
function messageModal(desc) {
    $('#MESSAGE-MODAL .description').html(desc);
    $('#MESSAGE-MODAL')
        .modal({ closable: false })
        .modal('show');
}
function confirmModal(desc, yesCallback) {
    $('#CONFIRM-MODAL .description').html(desc);
    $('#CONFIRM-MODAL')
        .modal({ closable: false, onApprove: yesCallback })
        .modal('show');
}
function userInputModal(desc, decideCallback) {
    $('#INPUT-MODAL .description-body').html(desc);
    $('#INPUT-MODAL')
        .modal({ closable: false, onApprove: decideCallback })
        .modal('show');
}
// /**
//  * ゲームを開始可能かどうか判定
//  */
// function checkGameStartable(board: sakuraba.Board){
//     // 両方のプレイヤー名が決定済みであれば、ゲーム開始許可
//     if(board.p1Side.playerName !== null && board.p2Side.playerName !== null){
//         $('#GAME-START-BUTTON').removeClass('disabled');
//     }
// }
function setPopup() {
    // ポップアップ初期化
    $('[data-html],[data-content]').popup({
        delay: { show: 500, hide: 0 },
        onShow: function () {
            if (draggingFrom !== null)
                return false;
        },
    });
}
function updatePhaseState(first) {
    if (first === void 0) { first = false; }
    // メガミが決定済みであれば、デッキ構築ボタンを有効化し、メガミ選択ボタンのラベルを変更
    if (myBoardSide.megamis !== null) {
        $('#MEGAMI-SELECT-BUTTON').text('メガミ変更');
        $('#DECK-BUILD-BUTTON').removeClass('disabled');
    }
    // デッキが構築済みであれば、場のカードを表示し、初期手札ボタンを有効化し、デッキ構築ボタンのラベルを変更
    if (myBoardSide.library.length >= 1) {
        if (first) {
            drawLibrary();
            refreshCardComponentRegionInfo('library');
            drawSpecials();
            refreshCardComponentRegionInfo('special');
            updateComponents();
            // ポップアップをセット
            setPopup();
        }
        $('#DECK-BUILD-BUTTON').text('デッキ変更');
        $('#HAND-SET-BUTTON').removeClass('disabled');
    }
}
$(function () {
    // socket.ioに接続
    var socket = io();
    socket.on('info', function (message) {
        console.log('[SOCKET.IO INFO] ', message);
    });
    // ボード情報をリクエスト
    console.log('request_first_board_to_server');
    socket.emit('request_first_board_to_server', { boardId: params.boardId, side: params.side });
    //socket.emit('send_board_to_server', {boardId: params.boardId, side: params.side, board: board});
    // ボード情報を受信した場合、メイン処理をスタート
    socket.on('send_first_board_to_client', function (receivingBoardData) {
        $('#P1-NAME').text(receivingBoardData.p1Side.playerName);
        $('#P2-NAME').text(receivingBoardData.p2Side.playerName);
        console.log('receive board: ', receivingBoardData);
        board = new sakuraba.Board(receivingBoardData);
        myBoardSide = board.getMySide(params.side);
        var opponentSide = board.getOpponentSide(params.side);
        // まだ名前が決定していなければ、名前の決定処理
        if (myBoardSide.playerName === null) {
            var playerCommonName_1 = (params.side === 'p1' ? 'プレイヤー1' : 'プレイヤー2');
            var opponentPlayerCommonName = (params.side === 'p1' ? 'プレイヤー2' : 'プレイヤー1');
            userInputModal("<p>\u3075\u308B\u3088\u306B\u30DC\u30FC\u30C9\u30B7\u30DF\u30E5\u30EC\u30FC\u30BF\u30FC\u3078\u3088\u3046\u3053\u305D\u3002<br>\u3042\u306A\u305F\u306F" + playerCommonName_1 + "\u3068\u3057\u3066\u5353\u306B\u53C2\u52A0\u3057\u307E\u3059\u3002</p><p>\u30D7\u30EC\u30A4\u30E4\u30FC\u540D\uFF1A</p>", function ($elem) {
                var playerName = $('#INPUT-MODAL input').val();
                if (playerName === '') {
                    playerName = playerCommonName_1;
                }
                socket.emit('player_name_input', { boardId: params.boardId, side: params.side, name: playerName });
                myBoardSide.playerName = playerName;
                $((params.side === 'p1' ? '#P1-NAME' : '#P2-NAME')).text(playerName);
                messageModal("<p>\u30B2\u30FC\u30E0\u3092\u59CB\u3081\u308B\u6E96\u5099\u304C\u3067\u304D\u305F\u3089\u3001\u307E\u305A\u306F\u300C\u30E1\u30AC\u30DF\u9078\u629E\u300D\u30DC\u30BF\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u304F\u3060\u3055\u3044\u3002</p>");
            });
        }
        updatePhaseState(true);
    });
    // 他のプレイヤーがプレイヤー名を入力した
    socket.on('on_player_name_input', function (receivingBoard) {
        var board = new sakuraba.Board(receivingBoard);
        $('#P1-NAME').text(board.p1Side.playerName);
        $('#P2-NAME').text(board.p2Side.playerName);
    });
    // // ドロップダウン初期化
    // let values: {name: string, value: string}[] = [];
    // for(let key in sakuraba.MEGAMI_DATA){
    //     let data = sakuraba.MEGAMI_DATA[key];
    //     values.push({name: `${data.name} (${data.symbol})`, value: key});
    // }
    // $('#MEGAMI1-SELECTION').dropdown({
    //     placeholder: '1柱目を選択...',
    //     values: values
    // });
    // $('#MEGAMI2-SELECTION').dropdown({
    //     placeholder: '2柱目を選択...',
    //     values: values
    // });
    for (var key in sakuraba.MEGAMI_DATA) {
        var data = sakuraba.MEGAMI_DATA[key];
        $('#MEGAMI1-SELECTION').append("<option value='" + key + "'>" + data.name + " (" + data.symbol + ")</option>");
        $('#MEGAMI2-SELECTION').append("<option value='" + key + "'>" + data.name + " (" + data.symbol + ")</option>");
    }
    // メガミ選択ダイアログでのボタン表示更新
    function updateMegamiSelectModalView() {
        var megami1 = $('#MEGAMI1-SELECTION').val();
        var megami2 = $('#MEGAMI2-SELECTION').val();
        if (megami1 !== '' && megami2 !== '') {
            $('#MEGAMI-SELECT-MODAL .positive.button').removeClass('disabled');
        }
        else {
            $('#MEGAMI-SELECT-MODAL .positive.button').addClass('disabled');
        }
    }
    // メガミ選択ボタン
    $('#MEGAMI-SELECT-BUTTON').click(function (e) {
        var megami2Rule = { identifier: 'megami2', rules: [{ type: 'different[megami1]', prompt: '同じメガミを選択することはできません。' }] };
        $('#MEGAMI-SELECT-MODAL .ui.form').form({
            fields: {
                megami2: megami2Rule
            }
        });
        $('#MEGAMI-SELECT-MODAL').modal({ closable: false, autofocus: false, onShow: function () {
                // メガミが選択済みであれば、あらかじめドロップダウンに設定しておく
                if (myBoardSide.megamis !== null) {
                    $('#MEGAMI1-SELECTION').val(myBoardSide.megamis[0]);
                    $('#MEGAMI2-SELECTION').val(myBoardSide.megamis[1]);
                }
                // 表示の更新
                updateMegamiSelectModalView();
            }, onApprove: function () {
                if (!$('#MEGAMI-SELECT-MODAL .ui.form').form('validate form')) {
                    return false;
                }
                updatePhaseState(true);
                // 選択したメガミを設定
                var megamis = [$('#MEGAMI1-SELECTION').val(), $('#MEGAMI2-SELECTION').val()];
                var mySide = board.getMySide(params.side);
                mySide.megamis = megamis;
                // socket.ioでイベント送信
                socket.emit('megami_select', { boardId: params.boardId, side: params.side, megamis: megamis });
                return undefined;
            } }).modal('show');
    });
    $('#MEGAMI1-SELECTION, #MEGAMI2-SELECTION').on('change', function (e) {
        updateMegamiSelectModalView();
    });
    // 選択カード数、ボタン等の表示更新
    function updateDeckCounts() {
        var normalCardCount = $('#DECK-BUILD-MODAL .fbs-card.open-normal.selected').length;
        var specialCardCount = $('#DECK-BUILD-MODAL .fbs-card.open-special.selected').length;
        var normalColor = (normalCardCount > 7 ? 'red' : (normalCardCount < 7 ? 'blue' : 'black'));
        $('#DECK-NORMAL-CARD-COUNT').text(normalCardCount).css({ color: normalColor, fontWeight: (normalColor === 'black' ? 'normal' : 'bold') });
        var specialColor = (specialCardCount > 3 ? 'red' : (specialCardCount < 3 ? 'blue' : 'black'));
        $('#DECK-SPECIAL-CARD-COUNT').text(specialCardCount).css({ color: specialColor, fontWeight: (specialColor === 'black' ? 'normal' : 'bold') });
        if (normalCardCount === 7 && specialCardCount === 3) {
            $('#DECK-BUILD-MODAL .positive.button').removeClass('disabled');
        }
        else {
            $('#DECK-BUILD-MODAL .positive.button').addClass('disabled');
        }
    }
    // デッキ構築モーダル内のカードをクリック
    $('body').on('click', '#DECK-BUILD-MODAL .fbs-card', function (e) {
        // 選択切り替え
        $(this).toggleClass('selected');
        // 選択数の表示を更新
        updateDeckCounts();
    });
    // デッキ構築ボタン
    $('#DECK-BUILD-BUTTON').click(function (e) {
        var cardIds = [[], [], []];
        // 1柱目の通常札 → 2柱目の通常札 → すべての切札 順にソート
        for (var key in sakuraba.CARD_DATA) {
            var data = sakuraba.CARD_DATA[key];
            if (data.megami === myBoardSide.megamis[0] && data.baseType === 'normal') {
                cardIds[0].push(key);
            }
            if (data.megami === myBoardSide.megamis[1] && data.baseType === 'normal') {
                cardIds[1].push(key);
            }
            if (myBoardSide.megamis.indexOf(data.megami) >= 0 && data.baseType === 'special') {
                cardIds[2].push(key);
            }
        }
        cardIds.forEach(function (cardIdsInRow, r) {
            cardIdsInRow.forEach(function (cardId, c) {
                var card = new sakuraba.Card(cardId);
                var comp = new CardComponent();
                comp.card = card;
                comp.htmlElementId = "deck-" + card.id;
                comp.opened = true;
                comp.top = 4 + r * (160 + 8);
                comp.left = 4 + c * (100 + 8);
                $('#DECK-BUILD-CARD-AREA').append(comp.toHtml());
                updateComponentAttributes(comp, $("#" + comp.htmlElementId));
            });
        });
        var settings = {
            closable: false, autofocus: false, onShow: function () {
                // 選択数の表示を更新
                updateDeckCounts();
                // ポップアップの表示をセット
                setPopup();
            },
            onApprove: function () {
                // 選択したカードを自分の山札、切札にセット
                var normalCards = $('#DECK-BUILD-MODAL .fbs-card.open-normal.selected').map(function (i, elem) { return new sakuraba.Card($(elem).attr('data-card-id')); }).get();
                myBoardSide.library = normalCards;
                var specialCards = $('#DECK-BUILD-MODAL .fbs-card.open-special.selected').map(function (i, elem) { return new sakuraba.Card($(elem).attr('data-card-id')); }).get();
                myBoardSide.specials = specialCards;
                console.log(myBoardSide);
                // カードの初期化、配置、ポップアップ設定などを行う
                updatePhaseState(true);
                // socket.ioでイベント送信
                socket.emit('deck_build', { boardId: params.boardId, side: params.side, library: myBoardSide.library, specials: myBoardSide.specials });
            },
            onHide: function () {
                // カード表示をクリア
                $('#DECK-BUILD-CARD-AREA').empty();
            }
        };
        $('#DECK-BUILD-MODAL').modal(settings).modal('show');
    });
    // 初期手札セットボタン
    $('#HAND-SET-BUTTON').on('click', function () {
        confirmModal('初期手札を引くと、メガミやデッキの変更は行えないようになります。<br>よろしいですか？', function () {
        });
    });
    // ドラッグ開始
    $('#BOARD').on('dragstart', '.fbs-card,.sakura-token', function (e) {
        this.style.opacity = '0.4'; // this / e.target is the source node.
        //(e.originalEvent as DragEvent).dataTransfer.setDragImage($(this.closest('.draw-region'))[0], 0, 0);
        var id = $(this).attr('id');
        var comp = components.find(function (c) { return c.htmlElementId === id; });
        // 現在のエリアに応じて、選択可能なエリアを前面に移動し、選択したカードを記憶
        if (comp.region === 'hand') {
            // 手札
            $('.area.droppable:not(.hand)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if (comp.region === 'library') {
            // 山札
            $('.area.droppable:not(.library)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if (comp.region === 'used') {
            // 使用済札
            $('.area.droppable:not(.used)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if (comp.region === 'hidden-used') {
            // 伏せ札
            $('.area.droppable:not(.hidden-used)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if (comp.region === 'distance') {
            // 間合
            $('.area.sakura-token-region.droppable:not(.distance)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if (comp.region === 'dust') {
            // ダスト
            $('.area.sakura-token-region.droppable:not(.dust)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if (comp.region === 'aura') {
            // オーラ
            $('.area.sakura-token-region.droppable:not(.aura)').css('z-index', 9999);
            draggingFrom = comp;
            // 場に出ている付与札があれば、それも移動対象
            $('[data-region=used]').addClass('droppable');
        }
        if (comp.region === 'life') {
            // ライフ
            $('.area.sakura-token-region.droppable:not(.life)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if (comp.region === 'flair') {
            // フレア
            $('.area.sakura-token-region.droppable:not(.flair)').css('z-index', 9999);
            draggingFrom = comp;
        }
        console.log('draggingFrom: ', draggingFrom);
        $('.fbs-card').popup('hide all');
    });
    function processOnDragEnd() {
        // コンテキストメニューを表示している場合、一部属性の解除を行わない
        if (!contextMenuShowingAfterDrop) {
            $('[draggable]').css('opacity', '1.0');
            $('.area,.fbs-card').removeClass('over');
        }
        $('.area.droppable').css('z-index', -9999);
        draggingFrom = null;
    }
    $('#BOARD').on('dragend', '.fbs-card,.sakura-token', function (e) {
        console.log('dragend', this);
        processOnDragEnd();
    });
    $('#BOARD').on('dragover', '.droppable', function (e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        //e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        return false;
    });
    // ドラッグで要素に進入した
    $('.area.droppable').on('dragenter', function (e) {
        console.log('dragenter', this);
        $($(this).attr('data-background-selector')).addClass('over');
    });
    $('.area.droppable').on('dragleave', function (e) {
        console.log('dragleave', this);
        $($(this).attr('data-background-selector')).removeClass('over'); // this / e.target is previous target element.
    });
    $('#BOARD').on('dragenter', '.fbs-card.droppable', function (e) {
        $($(this)).addClass('over');
    });
    $('#BOARD').on('dragleave', '.fbs-card.droppable', function (e) {
        $($(this)).removeClass('over'); // this / e.target is previous target element.
    });
    var lastDraggingFrom;
    $('#BOARD').on('drop', '.area,.fbs-card.droppable', function (e) {
        // this / e.target is current target element.
        console.log('drop', this);
        var $this = $(this);
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        // ドロップ領域を特定
        var to;
        if ($this.is('.area.hand'))
            to = 'hand';
        if ($this.is('.area.used'))
            to = 'used';
        if ($this.is('.area.hidden-used'))
            to = 'hidden-used';
        if ($this.is('.area.library'))
            to = 'library';
        if ($this.is('.area.distance'))
            to = 'distance';
        if ($this.is('.area.dust'))
            to = 'dust';
        if ($this.is('.area.aura'))
            to = 'aura';
        if ($this.is('.area.life'))
            to = 'life';
        if ($this.is('.area.flair'))
            to = 'flair';
        if ($this.is('.fbs-card'))
            to = 'on-card';
        if (draggingFrom !== null) {
            // 山札に移動した場合は特殊処理
            if (to === 'library') {
                lastDraggingFrom = draggingFrom;
                contextMenuShowingAfterDrop = true;
                $('#CONTEXT-DRAG-TO-LIBRARY').contextMenu({ x: e.pageX, y: e.pageY });
                return false;
            }
            else {
                // 山札以外への移動の場合
                if (draggingFrom instanceof CardComponent) {
                    moveCard(draggingFrom.region, draggingFrom.indexOfRegion, to);
                    return false;
                }
                if (draggingFrom instanceof SakuraTokenComponent) {
                    var cardId = null;
                    if (to === 'on-card') {
                        cardId = $(this).attr('data-card-id');
                    }
                    moveSakuraToken(draggingFrom.region, to, cardId);
                    return false;
                }
            }
        }
        return false;
    });
    // 集中力のクリック
    function vigorProcess() {
        var vigComp = components.find(function (x) { return x instanceof VigorComponent; });
        vigComp.setVigor(myBoardSide.vigor);
        updateComponents();
    }
    $('#BOARD').on('click', '.fbs-vigor-card .vigor0.clickable', function (e) {
        e.preventDefault();
        appendLog("\u96C6\u4E2D\u529B\uFF0D1\u3000(\u21920)");
        myBoardSide.vigor = 0;
        vigorProcess();
        return false;
    });
    $('#BOARD').on('click', '.fbs-vigor-card .vigor1.clickable', function (e) {
        e.preventDefault();
        if (myBoardSide.vigor === 2) {
            appendLog("\u96C6\u4E2D\u529B\uFF0D1\u3000(\u21921)");
        }
        else {
            appendLog("\u96C6\u4E2D\u529B\uFF0B1\u3000(\u21921)");
        }
        myBoardSide.vigor = 1;
        vigorProcess();
        return false;
    });
    $('#BOARD').on('click', '.fbs-vigor-card .vigor2.clickable', function (e) {
        e.preventDefault();
        appendLog("\u96C6\u4E2D\u529B\uFF0B1\u3000(\u21922)");
        myBoardSide.vigor = 2;
        vigorProcess();
        return false;
    });
    // ログ表示
    $('#LOG-DISPLAY-BUTTTON').on('click', function (e) {
        $('#LOG-WINDOW').toggle();
    });
    // ターン終了
    $('#TURN-END-BUTTON').on('click', function () {
        $('.ui.modal').modal('show');
    });
    // 切札のダブルクリック
    $('#BOARD').on('dblclick', '.fbs-card[data-region=special]', function (e) {
        e.preventDefault();
        var cardIndex = $('.fbs-card[data-region=special]').index(this);
        console.log('double click', cardIndex);
        var card = myBoardSide.specials[cardIndex];
        var comp = components.find(function (x) { return x instanceof CardComponent && x.card === myBoardSide.specials[cardIndex]; });
        if (card.used) {
            card.used = false;
            comp.opened = false;
        }
        else {
            card.used = true;
            comp.opened = true;
        }
        updateComponents();
        return false;
    });
    // $('#BOARD').on('mouseenter', '.sakura-token', function(e){
    //     let $region = $(this).closest('.draw-region');
    //     // 自分のインデックスを取得
    //     let index = $region.find('.sakura-token').index(this);
    //     // 自分より後の要素を半透明にする
    //     $region.find(`.sakura-token:gt(${index})`).css({opacity: 0.4});
    // });
    // $('#BOARD').on('mouseleave', '.sakura-token', function(e){
    //     let $region = $(this).closest('.draw-region');
    //     $region.find(`.sakura-token`).css({opacity: 1});
    // });
    // 山札ドラッグメニュー
    $('#BOARD').append('<div id="CONTEXT-DRAG-TO-LIBRARY"></div>');
    $.contextMenu({
        trigger: 'hidden',
        selector: '#CONTEXT-DRAG-TO-LIBRARY',
        callback: function (key) {
            if (key === 'top') {
                moveCard('hand', lastDraggingFrom.indexOfRegion, 'library');
            }
            if (key === 'bottom') {
                moveCard('hand', lastDraggingFrom.indexOfRegion, 'library', true);
            }
        },
        events: {
            hide: function (options) {
                contextMenuShowingAfterDrop = false;
                console.log(options);
                processOnDragEnd();
            }
        },
        items: {
            'top': { name: '上に置く' },
            'bottom': { name: '底に置く' },
            'sep': '----',
            'cancel': { name: 'キャンセル' }
        }
    });
    // 山札右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .fbs-card[data-region=library]',
        callback: function (key) {
            if (key === 'draw') {
                moveCard('library', 0, 'hand');
            }
            if (key === 'reshuffle' || key === 'reshuffleWithoutDamage') {
                // 山札、捨て札、伏せ札を全て加えてシャッフル
                myBoardSide.library = myBoardSide.library.concat(myBoardSide.hiddenUsed.splice(0));
                myBoardSide.used.forEach(function (card, i) {
                    if (card.sakuraToken === undefined || card.sakuraToken === 0) {
                        myBoardSide.library.push(card);
                        myBoardSide.used[i] = undefined;
                    }
                });
                myBoardSide.used = myBoardSide.used.filter(function (c) { return c !== undefined; });
                myBoardSide.library = shuffle(myBoardSide.library);
                refreshCardComponentRegionInfo('library');
                refreshCardComponentRegionInfo('used');
                refreshCardComponentRegionInfo('hidden-used');
                if (key === 'reshuffle')
                    moveSakuraToken('life', 'dust', null);
                updateComponents();
                appendLog("\u518D\u69CB\u6210");
            }
        },
        items: {
            'draw': { name: '1枚引く', disabled: function () { return myBoardSide.library.length === 0; } },
            'sep1': '---------',
            'reshuffle': { name: '再構成する', disabled: function () { return myBoardSide.life === 0; } },
            'reshuffleWithoutDamage': { name: '再構成する (ライフ減少なし)' },
        }
    });
    // 集中力右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .fbs-vigor-card',
        callback: function (key) {
        },
        items: {
            'wither': { name: '萎縮させる' },
            'sep1': '---------',
            'cancel': { name: 'キャンセル' },
        }
    });
    // 桜花結晶右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .sakura-token',
        build: function ($elem, event) {
            // 現在のトークン数を取得
            var region = $elem.attr('data-region');
            var tokenCount = 0;
            if (region === 'distance') {
                tokenCount = board.distance;
            }
            if (region === 'dust') {
                tokenCount = board.dust;
            }
            if (region === 'aura') {
                tokenCount = myBoardSide.aura;
            }
            if (region === 'life') {
                tokenCount = myBoardSide.life;
            }
            if (region === 'flair') {
                tokenCount = myBoardSide.flair;
            }
            var items = {};
            var itemBaseData = [
                { key: 'moveToDistance', name: '間合へ移動', region: 'distance' },
                { key: 'moveToDust', name: 'ダストへ移動', region: 'dust' },
                { key: 'moveToAura', name: 'オーラへ移動', region: 'aura' },
                { key: 'moveToLife', name: 'ライフへ移動', region: 'life' },
                { key: 'moveToFlair', name: 'フレアへ移動', region: 'flair' },
            ];
            itemBaseData.forEach(function (data) {
                if (region === data.region)
                    return true;
                items[data.key] = { name: data.name, items: {} };
                for (var i = 1; i <= tokenCount; i++) {
                    items[data.key].items[i.toString()] = { name: i + "\u3064" };
                }
                return true;
            });
            items['sep1'] = '---------';
            items['cancel'] = { name: 'キャンセル' };
            return {
                callback: function (key) {
                },
                items: items,
            };
            // return {
            //     callback: function(key: string) {
            //     },
            //     items: {
            //         'move': {
            //             name: '動かす',
            //             items: {
            //                 'dust': {
            //                     name: 'ダストへ',
            //                     items: {
            //                         '1': {name: '1つ'},
            //                         '2': {name: '2つ'},
            //                         '3': {name: '3つ'},
            //                     }
            //                 }
            //             }
            //         },
            //         'sep1': '---------',
            //         'cancel': {name: 'キャンセル'},
            //     }
            // }
        },
    });
    // context.init({ above: 'auto' });
    // context.attach('.area.library .fbs-card', [
    //     { text: '1枚引く', action: (e) => moveLibraryToHands(0) }
    //     , { divider: true }
    //     , { text: '再構成する' }
    //     , { text: '再構成する (ライフ減少なし)' }
    // ]);
    // context.attach('.area.hand .fbs-card', [
    //     { text: '使用する' }
    //     , { text: '伏せ札にする' }
    //     , { divider: true }
    //     , { text: '自分の山札の一番底に置く ' }
    //     , { text: '相手の山札の一番上に置く (毒カード用)' }
    // ]);
    // context.attach('.area.distance .sakura-token', [
    //     { text: '→ オーラ (前進)', action: (e) => {e.preventDefault(); moveSakuraToken('distance', 'aura'); return true;} }
    //     , { divider: true }
    //     , { text: '→ ダスト' }
    //     , { text: '→ ライフ' }
    //     , { text: '→ フレア' }
    // ]);
    // context.attach('.area.dust .sakura-token', [
    //     { text: '→ オーラ (宿し)', action: (e) => {e.preventDefault(); moveSakuraToken('dust', 'aura'); return true;} }
    //     , { text: '→ 間合 (離脱)', action: (e) => {e.preventDefault(); moveSakuraToken('life', 'aura'); return true;} }
    //     , { divider: true }
    //     , { text: '→ オーラ', action: (e) => {e.preventDefault(); moveSakuraToken('life', 'aura'); return true;} }
    //     , { text: '→ ダスト' }
    //     , { text: '→ 間合' }
    // ]);
    // context.attach('.area.aura .sakura-token', [
    //     { text: '→ ダスト (ダメージ)'}
    //     , { text: '→ フレア (宿し)', action: (e) => {e.preventDefault(); moveSakuraToken('aura', 'flair'); return true;}}
    //     , { divider: true }
    //     , { text: '→ ライフ', action: (e) => {e.preventDefault(); moveSakuraToken('aura', 'life'); return true;} }
    //     , { text: '→ 間合' }
    //     , { divider: true }
    //     , { text: 'オーラの最大値を無限大に変更' }
    // ]);
    // context.attach('.area.life .sakura-token', [
    //     { text: '→ フレア (ダメージ)', action: (e) => {e.preventDefault(); moveSakuraToken('life', 'flair'); return true;} }
    //     , { divider: true }
    //     , { text: '→ オーラ', action: (e) => {e.preventDefault(); moveSakuraToken('life', 'aura'); return true;} }
    //     , { text: '→ ダスト' }
    //     , { text: '→ 間合' }
    // ]);
    // context.attach('.area.flair .sakura-token', [
    //     { text: '→ ダスト (消費)' }
    //     , { divider: true }
    //     , { text: '→ オーラ', action: (e) => {e.preventDefault(); moveSakuraToken('flair', 'aura'); return true;} }
    //     , { text: '→ ライフ', action: (e) => {e.preventDefault(); moveSakuraToken('flair', 'life'); return true;} }
    //     , { text: '→ 間合' }
    // ]);
    ;
});


/***/ }),

/***/ "./src/sakuraba.ts":
/*!*************************!*\
  !*** ./src/sakuraba.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    '02-saine-o-s-1': { megami: 'saine', name: '律動弧戟', ruby: 'りつどうこげき', baseType: 'special', cost: '5', types: ['action'], range: '3-4', damage: '4/4', text: '攻撃『適正距離3-4、1/1』を行う。\n攻撃『適正距離4-5、1/1』を行う。\n攻撃『適正距離3-5、2/2』を行う。' },
    '02-saine-o-s-2': { megami: 'saine', name: '響鳴共振', ruby: 'きょうめいきょうしん', baseType: 'special', cost: '1', types: ['action'], text: '相手のオーラが5以上ならば、相オーラ→間合：3' },
    '02-saine-o-s-3': { megami: 'saine', name: '音無砕氷', ruby: 'おとなしさいひょう', baseType: 'special', cost: '1', types: ['action', 'reaction'], text: '対応した《攻撃》は-1/-1となる。\n【再起】八相-あなたのオーラが0である。' },
    '02-saine-o-s-4': { megami: 'saine', name: '氷雨細音の果ての果て', ruby: 'ひさめさいねのはてのはて', baseType: 'special', cost: '4', types: ['attack', 'reaction'], range: '1-5', damage: '5/5', text: '【常時】このカードは切札に対する対応でしか使用できない。' }
};
// クラス
var Board = /** @class */ (function () {
    function Board(baseData) {
        this.dataVersion = 1;
        this.distance = 10;
        this.dust = 0;
        this.tokensOnCard = {};
        this.actionLog = [];
        this.chatLog = [];
        this.p1Side = new BoardSide();
        this.p2Side = new BoardSide();
        if (baseData !== undefined) {
            Object.assign(this, baseData);
        }
    }
    Board.prototype.getMySide = function (side) {
        if (side === 'p1') {
            return this.p1Side;
        }
        else if (side === 'p2') {
            return this.p2Side;
        }
        return null;
    };
    Board.prototype.getOpponentSide = function (side) {
        if (side === 'p1') {
            return this.p2Side;
        }
        else if (side === 'p2') {
            return this.p1Side;
        }
        return null;
    };
    return Board;
}());
exports.Board = Board;
var BoardSide = /** @class */ (function () {
    function BoardSide() {
        this.playerName = null;
        this.megamis = null;
        this.aura = 3;
        this.life = 10;
        this.flair = 0;
        this.vigor = 0;
        this.library = [];
        this.hands = [];
        this.used = [];
        this.hiddenUsed = [];
        this.specials = [];
    }
    return BoardSide;
}());
exports.BoardSide = BoardSide;
var LogRecord = /** @class */ (function () {
    function LogRecord() {
    }
    return LogRecord;
}());
exports.LogRecord = LogRecord;
var Card = /** @class */ (function () {
    function Card(id) {
        this.id = id;
    }
    Object.defineProperty(Card.prototype, "data", {
        get: function () {
            return exports.CARD_DATA[this.id];
        },
        enumerable: true,
        configurable: true
    });
    return Card;
}());
exports.Card = Card;
var SpecialCard = /** @class */ (function (_super) {
    __extends(SpecialCard, _super);
    function SpecialCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.used = false;
        return _this;
    }
    return SpecialCard;
}(Card));
exports.SpecialCard = SpecialCard;


/***/ })

/******/ });
//# sourceMappingURL=main.js.map