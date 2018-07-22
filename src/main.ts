import { app, h } from "hyperapp";
import * as devtools from 'hyperapp-redux-devtools';
import { actions, ActionsType } from "./sakuraba/actions";
import * as utils from "./sakuraba/utils";
import { view } from "./sakuraba/view";


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
    let appActions = app(st, actions, view, document.getElementById('BOARD2')) as ActionsType;

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

                messageModal(`<p>ゲームを始める準備ができたら、まずは「メガミ選択」ボタンをクリックしてください。</p>`);
            });
        }
    });
});