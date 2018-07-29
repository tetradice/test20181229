import { app, h } from "hyperapp";
import * as models from "./sakuraba/models";
import { actions, ActionsType } from "./sakuraba/actions";
import * as utils from "./sakuraba/utils";
import { view } from "./sakuraba/view";
import { withLogger } from "@hyperapp/logger"

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
    // socket.ioに接続
    const socket = io();

    // 初期ステートを生成
    const st: state.State = utils.createInitialState();
    st.socket = socket;
    st.boardId = params.boardId;
    st.side = params.side;

    // アプリケーション起動
    let appActions: ActionsType = withLogger(app)(st, actions, view, document.getElementById('BOARD2'));

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

    // 山札エリア右クリックメニュー
    $.contextMenu({
        selector: '#BOARD2 .area.background[data-region=library], #BOARD2 .fbs-card[data-region=library]',
        callback: function(key: string) {
            let state = appActions.getState();
            if(key === 'draw'){
                appActions.moveCard({from: 'library', fromSide: state.side, to: 'hand', toSide: state.side});
            }

            if(key === 'reshuffle'){
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
    console.log('request_first_board_to_server');
    socket.emit('request_first_board_to_server', {boardId: params.boardId, side: params.side});
    //socket.emit('send_board_to_server', {boardId: params.boardId, side: params.side, board: board});

    // ボード情報を受信した場合、メイン処理をスタート
    socket.on('send_first_board_to_client', (receivingBoardData: state.Board) => {
        appActions.setBoard(receivingBoardData);

        // まだ名前が決定していなければ、名前の決定処理
        if(receivingBoardData.playerNames[params.side] === null){
            let playerCommonName = (params.side === 'p1' ? 'プレイヤー1' : 'プレイヤー2');
            let opponentPlayerCommonName = (params.side === 'p1' ? 'プレイヤー2' : 'プレイヤー1');
            userInputModal(`<p>ふるよにボードシミュレーターへようこそ。<br>あなたは${playerCommonName}として卓に参加します。</p><p>プレイヤー名：</p>`, ($elem) => {
                let playerName = $('#INPUT-MODAL input').val() as string;
                if(playerName === ''){
                    playerName = playerCommonName;
                }
                socket.emit('player_name_input', {boardId: params.boardId, side: params.side, name: playerName});
                appActions.setPlayerName({side: params.side, name: playerName});

                // 最初の名前決定時に、桜花結晶を作る
                appActions.addSakuraToken({side: params.side, region: 'aura', number: 3});
                appActions.addSakuraToken({side: params.side, region: 'life', number: 10});
                appActions.addSakuraToken({side: null, region: 'distance', number: 10});

                messageModal(`<p>ゲームを始める準備ができたら、まずは「メガミ選択」ボタンをクリックしてください。</p>`);
            });
        }
    });
});