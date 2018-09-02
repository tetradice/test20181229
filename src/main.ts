import toastr from "toastr";

import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import * as apps from "sakuraba/apps";
import { ClientSocket } from "sakuraba/socket";
import { CARD_DATA } from "./sakuraba";
import dragInfo from "sakuraba/dragInfo";

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
    let appActions = apps.main.run(st, document.getElementById('BOARD'));

    // 山札ドラッグメニュー

    // 切札右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .fbs-card[data-region=special]',

        build: function($elem: JQuery, event: JQueryEventObject){
            let id = $elem.attr('data-object-id');
            let currentState = appActions.getState();
            let board = new models.Board(currentState.board);
            let card = board.getCard(id);

            let items = {};
            items['flip'] =  {name: (card.specialUsed ? '裏向きにする' : '表向きにする')}
            return {
                callback: function(key: string) {
                    appActions.operate({
                        log: `${CARD_DATA[card.cardId].name}を${card.specialUsed ? '表向き' : '裏向き'}に変更`,
                        proc: () => {
                            appActions.oprSetSpecialUsed({objectId: id, value: !card.specialUsed});
                        }
                    });
                    
                },
                items: items,
            }
        }
    });

    // 集中力右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .fbs-vigor-card, #BOARD .withered-token',
        build: function($elem: JQuery, event: JQueryEventObject){
            let st = appActions.getState();
            let board = new models.Board(st.board);
            let side = $elem.closest('[data-side]').attr('data-side') as PlayerSide;

            let items = {};
            items['wither'] =  {
                  name: (board.witherFlags[side] ? '萎縮を解除' : '萎縮')
                , callback: () => appActions.oprSetWitherFlag({side: side, value: !board.witherFlags[side]})
            }
            return {
                items: items,
            }
        }

    });


    // 山札エリア右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .area.background[data-region=library], #BOARD .fbs-card[data-region=library]',
        callback: function(key: string) {
            let state = appActions.getState();
            if(key === 'draw'){
                // 1枚引く
                appActions.oprDraw();
            }

            if(key === 'reshuffle'){
                // 再構成
                appActions.oprReshuffle({side: state.side, lifeDecrease: true});
            }
            if(key === 'reshuffleWithoutDamage'){
                // 再構成
                appActions.oprReshuffle({side: state.side, lifeDecrease: false});
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
            utils.userInputModal(`<p>ふるよにボードシミュレーターへようこそ。<br>あなたは${playerCommonName}として卓に参加します。</p><p>プレイヤー名：</p>`, ($elem) => {
                let playerName = $('#INPUT-MODAL input').val() as string;
                if(playerName === ''){
                    playerName = playerCommonName;
                }
                appActions.operate({
                    log: `卓に参加しました`,
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

    // 他のプレイヤーがボード情報を更新した場合、画面上のボード情報も差し換える
    socket.on('onBoardReceived', (p: {board: state.Board, appendedActionLogs: state.LogRecord[] | null}) => {
        appActions.setBoard(p.board);

        // 追加ログがあれば
        if(p.appendedActionLogs !== null){
            // ログも追加
            appActions.appendReceivedActionLogs(p.appendedActionLogs);

            // 受け取ったログをtoastrで表示
            let st = appActions.getState();
            let targetLogs = p.appendedActionLogs.filter((log) => utils.logIsVisible(log, st.side));
            let msg = targetLogs.map((log) => log.body).join('<br>');
            toastr.info(msg, `${st.board.playerNames[targetLogs[0].playerSide]}:`);
        }

    });

    // toastrの標準オプションを設定
    toastr.options = {
        hideDuration: 300
      , showDuration: 300
    };

    // 相手プレイヤーからの通知を受け取った場合、toastを時間無制限で表示
    socket.on('onNotifyReceived', (p: {senderSide: PlayerSide, message: string}) => {
        let st = appActions.getState();
        toastr.info(p.message, `${st.board.playerNames[p.senderSide]}より通知:`, {
              timeOut: 0
            , extendedTimeOut: 0
            , tapToDismiss: false
            , closeButton: true
        });
    });

    // モーダルでEnterを押下した場合、ボタンを押下したものと扱う
    $('body').keydown(function(e){
        if(e.key === 'Enter'){
            $('.modals.active .positive.button').click();
        }
    });


    let contextMenuShowingAfterDrop: boolean = false;    
    // ドラッグ開始
    $('#BOARD').on('dragstart', '.fbs-card,.sakura-token', function(e){
        let currentState = appActions.getState();

        this.style.opacity = '0.4';  // this / e.target is the source node.
        //(e.originalEvent as DragEvent).dataTransfer.setDragImage($(this.closest('.draw-region'))[0], 0, 0);
        let objectId = $(this).attr('data-object-id');
        let object = currentState.board.objects.find(c => c.id === objectId);

        // 現在のエリアに応じて、選択可能なエリアを前面に移動し、選択したカードを記憶
        $(`.area.droppable:not([data-side=${object.side}][data-region=${object.region}])`).css('z-index', 9999);
        $(`.fbs-card.droppable`).css('z-index', 10000);
        dragInfo.draggingFrom = object;

        if(object.region === 'aura'){
            // 場に出ている付与札があれば、それも移動対象
            $('[data-region=used]').addClass('droppable');
        }

        $('.fbs-card').popup('hide all');

    });

    function processOnDragEnd(){
        // コンテキストメニューを表示している場合、一部属性の解除を行わない
        if(!contextMenuShowingAfterDrop){
            $('[draggable]').css('opacity', '1.0');
            $('.area,.fbs-card').removeClass('over');
        }
        
        $('.area.droppable').css('z-index', -9999);
        $('.fbs-card.droppable').css('z-index', 0);
        dragInfo.draggingFrom = null;
    }

    $('#BOARD').on('dragend', '.fbs-card,.sakura-token', function(e){
        console.log('dragend', this);
        processOnDragEnd();

    });
    $('#BOARD').on('dragover', '.droppable', function(e){
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        //((e as any) as DragEvent).dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
    });

    // ドラッグで要素に進入した
    $('#BOARD').on('dragenter', '.area.droppable', function(e){
        let side = $(this).attr('data-side');
        let region = $(this).attr('data-region');
        $(`.area.background[data-side=${side}][data-region=${region}]`).addClass('over');
    });

    $('#BOARD').on('dragleave', '.area.droppable', function(e){
        let side = $(this).attr('data-side');
        let region = $(this).attr('data-region');
        $(`.area.background[data-side=${side}][data-region=${region}]`).removeClass('over');  // this / e.target is previous target element.
    });
    $('#BOARD').on('dragenter', '.fbs-card.droppable', function(e){
        $($(this)).addClass('over');
    });
    $('#BOARD').on('dragleave', '.fbs-card.droppable', function(e){
        $($(this)).removeClass('over');  // this / e.target is previous target element.
    });


    let lastDraggingFrom: state.BoardObject = null; 
    $('#BOARD').on('drop', '.area,.fbs-card.droppable', function(e){
        // this / e.target is current target element.
        console.log('drop', this);
        let $this = $(this);

        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
    
        if(dragInfo.draggingFrom !== null){
            // 現在のステートを取得
            let currentState = appActions.getState();

            // カードを別領域に移動した場合
            if(dragInfo.draggingFrom.type === 'card'){
                let toSide = $this.attr('data-side') as PlayerSide;
                let toRegion = $this.attr('data-region') as CardRegion;

                // 移動ログを決定
                let logs: {text: string, visibility?: LogVisibility}[] = [];
                let cardName = CARD_DATA[dragInfo.draggingFrom.cardId].name;
                let fromRegionTitle = utils.getCardRegionTitle(currentState.side, dragInfo.draggingFrom.side, dragInfo.draggingFrom.region);
                let toRegionTitle = utils.getCardRegionTitle(currentState.side, toSide, toRegion);

                logs.push({text: `[${cardName}]を移動しました：${fromRegionTitle} → ${toRegionTitle}`});
                let cardNameLogging = false;
                
                // 一定の条件を満たす場合はログを置き換える
                if(dragInfo.draggingFrom.region === 'hand' && toRegion === 'hidden-used'){
                    logs = [];
                    logs.push({text: `[${cardName}]を伏せ札にしました`, visibility: 'ownerOnly'});
                    logs.push({text: `カードを1枚伏せ札にしました`, visibility: 'outerOnly'});
                }
                if(dragInfo.draggingFrom.region === 'hand' && toRegion === 'used'){
                    logs = [];
                    logs.push({text: `[${cardName}]を場に出しました`});
                }
                if(dragInfo.draggingFrom.region === 'library' && toRegion === 'hand'){
                    logs = [];
                    logs.push({text: `カードを1枚引きました`});
                    cardNameLogging = true;
                }

                appActions.operate({
                    log: logs,
                    proc: () => {
                        appActions.moveCard({
                            from: dragInfo.draggingFrom.id
                        , to: [toSide, toRegion] 
                        , cardNameLogging: cardNameLogging
                        });
                    }
                });
            }


            // // 山札に移動した場合は特殊処理
            // if(to === 'library'){
            //     lastDraggingFrom = dragInfo.draggingFrom;
            //     contextMenuShowingAfterDrop = true;
            //     $('#CONTEXT-DRAG-TO-LIBRARY').contextMenu({x: e.pageX, y: e.pageY});
            //     return false;
            // } else {
            //     // 山札以外への移動の場合
            //     if(dragInfo.draggingFrom.type === 'card'){
            //         //moveCard(dragInfo.draggingFrom.region as sakuraba.CardArea, dragInfo.draggingFrom.indexOfRegion, to as sakuraba.CardArea);
            //         return false;
            //     }

            //     if(dragInfo.draggingFrom.type === 'sakura-token'){
            //         let cardId: string = null;
            //         if(to === 'on-card'){
            //             cardId = $(this).attr('data-card-id');
            //         }
            //         //moveSakuraToken(dragInfo.draggingFrom.region as sakuraba.SakuraTokenArea, to as sakuraba.SakuraTokenArea, cardId);
            //         return false;
            //     }
            // }



        }

        return false;
    });

});