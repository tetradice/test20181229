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
var Board = /** @class */ (function () {
    function Board(data) {
        if (data !== undefined) {
            this.data = data;
        }
        else {
            this.data = new BoardData();
        }
    }
    return Board;
}());
exports.Board = Board;
var BoardData = /** @class */ (function () {
    function BoardData() {
        this.dataVersion = 1;
        this.distance = 10;
        this.dust = 0;
        this.actionLog = [];
        this.chatLog = [];
        this.p1Side = new BoardSide();
        this.p2Side = new BoardSide();
    }
    return BoardData;
}());
exports.BoardData = BoardData;
var BoardSide = /** @class */ (function () {
    function BoardSide() {
        this.string = null;
        this.megamis = null;
        this.aura = 3;
        this.life = 10;
        this.flair = 0;
        this.vigor = 0;
        this.library = [];
        this.hands = [];
        this.used = [];
        this.hiddenUsed = [];
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
    function Card() {
    }
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
