import toastr from "toastr";

import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import * as apps from "sakuraba/apps";
import { ClientSocket } from "sakuraba/socket";
import { CARD_DATA } from "./sakuraba";

declare var params: {
    boardId: string;
    side: PlayerSide;
}

function messageModal(desc: string){
    $('#MESSAGE-MODAL .description').html(desc);
    $('#MESSAGE-MODAL')
        .modal({closable: false})
        .modal('show');
}

function confirmModal(desc: string, yesCallback: (this: JQuery, $element: JQuery) => false | void){
    $('#CONFIRM-MODAL .description').html(desc);
    $('#CONFIRM-MODAL')
        .modal({closable: false, onApprove:yesCallback})
        .modal('show');
}

function userInputModal(desc: string, decideCallback: (this: JQuery, $element: JQuery) => false | void){
    $('#INPUT-MODAL .description-body').html(desc);
    $('#INPUT-MODAL')
        .modal({closable: false, onApprove:decideCallback})
        .modal('show');
}

$(function(){
    // socket.ioに接続し、ラッパーを作成
    const ioSocket = io();
    const socket = new ClientSocket(ioSocket);

    // 初期ステートを生成
    const st: state.State = utils.createInitialState();
    st.socket = socket;
    st.boardId = params.boardId;
    st.side = params.side;

    // ズーム設定を調整
    let clientWidth = window.innerWidth - 350;
    if(clientWidth < 1200) st.zoom = 0.9;
    if(clientWidth < 1200 - 120) st.zoom = 0.8;
    if(clientWidth < 1200 - 120 * 2) st.zoom = 0.7;
    if(clientWidth < 1200 - 120 * 3) st.zoom = 0.6;
    if(clientWidth < 1200 - 120 * 4) st.zoom = 0.5;

    // アプリケーション起動
    let appActions = apps.main.run(st, document.getElementById('BOARD2'));

    // 山札ドラッグメニュー

    // 切札右クリックメニュー
    $.contextMenu({
        selector: '#BOARD2 .fbs-card[data-region=special]',

        build: function($elem: JQuery, event: JQueryEventObject){
            let id = $elem.attr('data-object-id');
            let currentState = appActions.getState();
            let board = new models.Board(currentState.board);
            let card = board.getCard(id);

            let items = {};
            items['flip'] =  {name: (card.opened ? '裏向きにする' : '表向きにする')}
            return {
                callback: function(key: string) {
                    appActions.operate({
                        logText: `${CARD_DATA[card.cardId].name}を${card.opened ? '表向き' : '裏向き'}に変更`,
                        proc: () => {
                            appActions.flipCard(id);
                        }
                    });
                    
                },
                items: items,
            }
        }
    });

    // 集中力右クリックメニュー
    $.contextMenu({
        selector: '#BOARD2 .fbs-vigor-card',
        build: function($elem: JQuery, event: JQueryEventObject){
            let st = appActions.getState();
            let board = new models.Board(st.board);

            let items = {};
            items['wither'] =  {name: (board.witherFlags[st.side] ? '萎縮を解除' : '萎縮')}
            return {
                callback: function(key: string) {
                    if(key === 'wither'){
                        appActions.setWitherFlag({side: st.side, value: !board.witherFlags[st.side]});
                    }
                },
                items: items,
            }
        }

    });


    // 山札エリア右クリックメニュー
    $.contextMenu({
        selector: '#BOARD2 .area.background[data-region=library], #BOARD2 .fbs-card[data-region=library]',
        callback: function(key: string) {
            let state = appActions.getState();
            if(key === 'draw'){
                // 1枚引く
                appActions.oprDraw();
            }

            if(key === 'reshuffle'){
                // 再構成
                appActions.oprReshuffle({side: state.side});
            }

            return;
        },
        items: {
            'draw': {name: '1枚引く', disabled: () => {
                let board = new models.Board(appActions.getState().board);

                let cards = board.getRegionCards(appActions.getState().side, 'library');
                return cards.length === 0;
            }},
            'sep1': '---------',
            'reshuffle': {name: '再構成する'},
            'reshuffleWithoutDamage': {name: '再構成する (ライフ減少なし)'},
        }
    });


    // ボード情報をリクエスト
    socket.emit('requestFirstBoard', {boardId: params.boardId});

    // ボード情報を受信した場合、メイン処理をスタート
    socket.on('onFirstBoardReceived', (p: {board: state.Board}) => {
        appActions.setBoard(p.board);

        // まだ名前が決定していなければ、名前の決定処理
        if(p.board.playerNames[params.side] === null){
            let playerCommonName = (params.side === 'p1' ? 'プレイヤー1' : 'プレイヤー2');
            let opponentPlayerCommonName = (params.side === 'p1' ? 'プレイヤー2' : 'プレイヤー1');
            userInputModal(`<p>ふるよにボードシミュレーターへようこそ。<br>あなたは${playerCommonName}として卓に参加します。</p><p>プレイヤー名：</p>`, ($elem) => {
                let playerName = $('#INPUT-MODAL input').val() as string;
                if(playerName === ''){
                    playerName = playerCommonName;
                }
                appActions.operate({
                    logText: `卓に参加`,
                    undoType: 'notBack',
                    proc: () => {
                        appActions.setPlayerName({side: params.side, name: playerName});
                    }
                });

                messageModal(`<p>ゲームを始める準備ができたら、まずは右上の「メガミ選択」ボタンをクリックしてください。</p>`);
            });
        }
    });

    // アクションログ情報をリクエスト
    socket.emit('requestFirstActionLogs', {boardId: params.boardId});

    // アクションログ情報を受け取った場合、ステートに設定
    socket.on('onFirstActionLogsReceived', (p: {logs: state.LogRecord[]}) => {
        appActions.setActionLogs(p.logs);
    });
    socket.on('onAppendedActionLogsReceived', (p: {logs: state.LogRecord[]}) => {
        appActions.appendReceivedActionLogs(p.logs);
    });

    // 他のプレイヤーがボード情報を更新した場合、画面上のボード情報も差し換える
    socket.on('onBoardReceived', (p: {board: state.Board}) => {
        appActions.setBoard(p.board);
    });

    // toastrのオプションを設定
    toastr.options = {
        timeOut: 0
      , extendedTimeOut: 0
      , hideDuration: 300
      , showDuration: 300
      , tapToDismiss: false
      , closeButton: true
  };

    // 通知を受け取った場合、toastを時間無制限で表示
    socket.on('onNotifyReceived', (p: {message: string}) => {
        toastr.info(p.message);
    });  
});