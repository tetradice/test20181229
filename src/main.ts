import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import * as mainApp from "sakuraba/app/main";
import { ClientSocket } from "sakuraba/socket";

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

    // アプリケーション起動
    let appActions = mainApp.launch(st, document.getElementById('BOARD2'));

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
                appActions.memorizeBoardHistory(); // Undoのために履歴を記憶
                appActions.moveCard({from: 'library', fromSide: state.side, to: 'hand', toSide: state.side});
            }

            if(key === 'reshuffle'){
                // 再構成
                appActions.reshuffle({side: state.side});
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
                appActions.setPlayerName({side: params.side, name: playerName});

                // 最初の名前決定時に、桜花結晶を作り、同時に集中力をセット
                appActions.addSakuraToken({side: params.side, region: 'aura', number: 3});
                appActions.addSakuraToken({side: params.side, region: 'life', number: 10});
                appActions.setVigor({side: params.side, value: 0});

                socket.emit('updateBoard', {boardId: params.boardId, side: params.side, board: appActions.getState().board});

                messageModal(`<p>ゲームを始める準備ができたら、まずは「メガミ選択」ボタンをクリックしてください。</p>`);
            });
        }
    });

    // 他のプレイヤーがボード情報を更新した場合、画面上のボード情報も差し換える
    socket.on('onBoardReceived', (p: {board: state.Board}) => {
        appActions.setBoard(p.board);
    });
});