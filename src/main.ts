import { app } from "hyperapp";
import * as devtools from 'hyperapp-redux-devtools';
import { actions, ActionsType } from "./sakuraba/actions";
import * as utils from "./sakuraba/utils";
import { view } from "./sakuraba/view";

// 初期ステートを生成
const st: state.State = utils.createInitialState();

// アプリケーション起動
let wiredActs = devtools(app)(st, actions, view, document.getElementById('BOARD2')) as ActionsType;
console.log('hyperapp OK.');

declare var params: {
    boardId: string;
    side: "p1" | "p2" | "watch";
}

$(function(){
    // socket.ioに接続
    const socket = io();
    

});