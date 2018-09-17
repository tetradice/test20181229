import toastr from "toastr";

import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import * as apps from "sakuraba/apps";
import { ClientSocket } from "sakuraba/socket";
import { CARD_DATA, SAKURA_TOKEN_MAX } from "./sakuraba";
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

    // 右クリックメニュー
    $.contextMenu({
        selector: '#BOARD *',

        build: function($elem: JQuery, event: JQueryEventObject){
            let currentState = appActions.getState();
            let board = new models.Board(currentState.board);
            let items: Object = null;

            // 切り札で右クリック
            if($elem.is('.fbs-card[data-region=special]')){
                let id = $elem.attr('data-object-id');
                let card = board.getCard(id);
                
                items = {};
                items['flip'] =  {
                    name: (card.specialUsed ? '裏向きにする' : '表向きにする')
                  , callback: function() {
                      appActions.oprSetSpecialUsed({objectId: id, value: !card.specialUsed});
                  }
                }
                if(CARD_DATA[card.cardId].removable){
                    items['remove'] =  {
                        name: "ボード上から取り除く"
                        , callback: function() {
                        appActions.oprRemoveCard({objectId: id});
                        }
                    }
                };
            }

            // 集中力で右クリック
            if($elem.is('.fbs-vigor-card, .withered-token')){
                let side = $elem.closest('[data-side]').attr('data-side') as PlayerSide;

                items = {};
                items['wither'] =  {
                    name: (board.witherFlags[side] ? '萎縮を解除' : '萎縮')
                    , callback: () => appActions.oprSetWitherFlag({side: side, value: !board.witherFlags[side]})
                }
            }

            // 山札で右クリック
            if($elem.is('.area.background[data-region=library], .fbs-card[data-region=library]')){
                items = {
                    'draw': {name: '1枚引く', disabled: () => {
                        let board = new models.Board(appActions.getState().board);
        
                        let cards = board.getRegionCards(appActions.getState().side, 'library');
                        return cards.length === 0;
                    }, callback: () => {
                        appActions.oprDraw();
                    }},
                    'sep1': '---------',
                    'reshuffle': {name: '再構成する', callback: () => {
                        appActions.oprReshuffle({side: currentState.side, lifeDecrease: true});
                    }},
                    'reshuffleWithoutDamage': {name: '再構成する (ライフ減少なし)', callback: () => {
                        appActions.oprReshuffle({side: currentState.side, lifeDecrease: false});
                    }},
                }
            }

            if(items === null){
                return false;
            } else {
                return {
                    items: items,
                };
            }

        }
    });

    // // 集中力右クリックメニュー
    // $.contextMenu({
    //     selector: '#BOARD .fbs-vigor-card, #BOARD .withered-token',
    //     build: function($elem: JQuery, event: JQueryEventObject){
    //         let st = appActions.getState();
    //         let board = new models.Board(st.board);
    //         let side = $elem.closest('[data-side]').attr('data-side') as PlayerSide;

    //         let items = {};
    //         items['wither'] =  {
    //               name: (board.witherFlags[side] ? '萎縮を解除' : '萎縮')
    //             , callback: () => appActions.oprSetWitherFlag({side: side, value: !board.witherFlags[side]})
    //         }
    //         return {
    //             items: items,
    //         }
    //     }

    // });


    // // 山札エリア右クリックメニュー
    // $.contextMenu({
    //     selector: '#BOARD .area.background[data-region=library], #BOARD .fbs-card[data-region=library]',
    //     callback: function(key: string) {
    //         let state = appActions.getState();
    //         if(key === 'draw'){
    //             // 1枚引く
    //             appActions.oprDraw();
    //         }

    //         if(key === 'reshuffle'){
    //             // 再構成
    //             appActions.oprReshuffle({side: state.side, lifeDecrease: true});
    //         }
    //         if(key === 'reshuffleWithoutDamage'){
    //             // 再構成
    //             appActions.oprReshuffle({side: state.side, lifeDecrease: false});
    //         }
    //         return;
    //     },
    //     items: {
    //         'draw': {name: '1枚引く', disabled: () => {
    //             let board = new models.Board(appActions.getState().board);

    //             let cards = board.getRegionCards(appActions.getState().side, 'library');
    //             return cards.length === 0;
    //         }},
    //         'sep1': '---------',
    //         'reshuffle': {name: '再構成する'},
    //         'reshuffleWithoutDamage': {name: '再構成する (ライフ減少なし)'},
    //     }
    // });


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

    // 前進ボタンの上にカーソルを置いたときの処理
    $('#BOARD').on('mouseenter', '#FORWARD-BUTTON', function(e){
        // 間合いの右端をフォーカス
        $(`.sakura-token[data-region=distance][data-dragging-count=1]`).addClass('focused');
        // 自オーラ領域をフォーカス
        $(`.area.background[data-side=${params.side}][data-region=aura]`).addClass('over');
    });
    // 離脱ボタンの上にカーソルを置いたときの処理
    $('#BOARD').on('mouseenter', '#LEAVE-BUTTON', function(e){
        // ダストの右端をフォーカス
        $(`.sakura-token[data-region=dust][data-dragging-count=1]`).addClass('focused');
        // 間合い領域をフォーカス
        $(`.area.background[data-region=distance]`).addClass('over');
    });
    // 後退ボタンの上にカーソルを置いたときの処理
    $('#BOARD').on('mouseenter', '#BACK-BUTTON', function(e){
        // 自オーラの右端をフォーカス
        $(`.sakura-token[data-side=${params.side}][data-region=aura][data-dragging-count=1]`).addClass('focused');
        // 間合い領域をフォーカス
        $(`.area.background[data-region=distance]`).addClass('over');
    });
    // 纏いボタンの上にカーソルを置いたときの処理
    $('#BOARD').on('mouseenter', '#WEAR-BUTTON', function(e){
        // ダストの右端をフォーカス
        $(`.sakura-token[data-region=dust][data-dragging-count=1]`).addClass('focused');
        // 自オーラ領域をフォーカス
        $(`.area.background[data-side=${params.side}][data-region=aura]`).addClass('over');
    });
    // 宿しボタンの上にカーソルを置いたときの処理
    $('#BOARD').on('mouseenter', '#CHARGE-BUTTON', function(e){
        // 自オーラの右端をフォーカス
        $(`.sakura-token[data-side=${params.side}][data-region=aura][data-dragging-count=1]`).addClass('focused');
        // 自フレア領域をフォーカス
        $(`.area.background[data-side=${params.side}][data-region=flair]`).addClass('over');
    });
    $('#BOARD').on('mouseleave', '#FORWARD-BUTTON, #BACK-BUTTON, #CHARGE-BUTTON, #LEAVE-BUTTON, #WEAR-BUTTON', function(e){
        $(`.sakura-token`).removeClass('focused');
        $(`.area.background`).removeClass('over');
    });

    // 桜花結晶の上にカーソルを置いたときの処理
    $('#BOARD').on('mouseenter', '.sakura-token', function(e){
        // 自分と同じ領域で、インデックスが自分以上の要素をすべて選択扱いにする
        let $this = $(this);
        let side = $this.attr('data-side') as (PlayerSide | 'none');
        let index = parseInt($this.attr('data-region-index'));

        if(index === 0){
            $(`.sakura-token[data-side=${side}][data-region=${$this.attr('data-region')}][data-linked-card-id=${$this.attr('data-linked-card-id')}]`).addClass('focused');
        } else {
            $(`.sakura-token[data-side=${side}][data-region=${$this.attr('data-region')}][data-linked-card-id=${$this.attr('data-linked-card-id')}]:gt(${index-1})`).addClass('focused');
        }
    });
    $('#BOARD').on('mouseleave', '.sakura-token', function(e){
        $(`.sakura-token`).removeClass('focused');
    });

    // ドラッグ開始
    $('#BOARD').on('dragstart', '.fbs-card,.sakura-token', function(e){
        console.log('★dragstart');

        let currentState = appActions.getState();

        //(e.originalEvent as DragEvent).dataTransfer.setDragImage($(this.closest('.draw-region'))[0], 0, 0);
        let objectId = $(this).attr('data-object-id');
        let object = currentState.board.objects.find(c => c.id === objectId);

        // カードの場合
        if(object.type === 'card'){
            this.style.opacity = '0.4';  // this / e.target is the source node.
            
            // 現在のエリアに応じて、選択可能なエリアを前面に移動し、選択したカードを記憶
            // (同じ領域、もしくは切り札領域にはドラッグできない)
            $(`.area.card-region.droppable:not([data-side=${object.side}][data-region=${object.region}])`).css('z-index', 9999);
            $(`.fbs-card.card-droppable`).css('z-index', 10000);
            dragInfo.draggingFrom = object;

            // ポップアップを非表示にする
            $('.fbs-card').popup('hide all');
        }

        // 桜花結晶の場合
        if(object.type === 'sakura-token'){
            let $this = $(this);
            let side = $this.attr('data-side') as (PlayerSide | 'none');
            let index = parseInt($this.attr('data-region-index'));
            let draggingCount = parseInt($this.attr('data-dragging-count'));

            // 現在のエリアに応じて、選択可能なエリアを前面に移動し、選択した桜花結晶を記憶
            if(object.region === 'on-card'){
            } else {
                $(`.area.sakura-token-region.droppable:not([data-side=${side}][data-region=${object.region}])`).css('z-index', 9999);
                //$(`.fbs-card.sakura-token-droppable`).css('z-index', 10000);
            }
            dragInfo.draggingFrom = object;

            // 移動数を記憶
            dragInfo.sakuraTokenMoveCount = draggingCount;

            // 自分と同じ領域で、インデックスが自分以上の要素をすべて半透明にする
            if(index === 0){
                $(`.sakura-token[data-side=${side}][data-region=${$this.attr('data-region')}][data-linked-card-id=${$this.attr('data-linked-card-id')}]`).css('opacity', '0.4');
            } else {
                $(`.sakura-token[data-side=${side}][data-region=${$this.attr('data-region')}][data-linked-card-id=${$this.attr('data-linked-card-id')}]:gt(${index-1})`).css('opacity', '0.4');
            }

            // ドラッグゴースト画像を設定
            $('#sakura-token-ghost-many .count').text(draggingCount);
            let ghost = (draggingCount >= 6 ? $('#sakura-token-ghost-many')[0] : $(`#sakura-token-ghost-${draggingCount}`)[0]);
            //let ghost = $('<img src="/furuyoni_commons/others/sakura_token_ghost3.png" width="30" height="30">')[0];
            (e.originalEvent as DragEvent).dataTransfer.setDragImage(ghost, 0, 0);

            // 選択状態を解除
            $(`.sakura-token`).removeClass('focused');
        }
    });

    function processOnDragEnd(){
        // コンテキストメニューを表示している場合、一部属性の解除を行わない
        if(!contextMenuShowingAfterDrop){
            $('[draggable]').css('opacity', '1.0');
            $('.area,.fbs-card').removeClass('over').removeClass('over-forbidden');
        }
        
        $('.area.droppable').css('z-index', -9999);
        $('.fbs-card').css('z-index', 0);
        dragInfo.draggingFrom = null;
    }

    $('#BOARD').on('dragend', '.fbs-card,.sakura-token', function(e){
        console.log('★dragend');
        processOnDragEnd();

    });
    $('#BOARD').on('dragover', '.droppable, .sakura-token-droppable, .card-droppable', function(e){
        console.log('★dragover');
        if($(this).hasClass('over-forbidden')){
            ((e.originalEvent as any) as DragEvent).dataTransfer.dropEffect = 'none';  // See the section on the DataTransfer object.
            return false;
        }
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }


        return false;
    });

    $('#BOARD').on('dragenter', '.area.droppable', function(e){
        let side = $(this).attr('data-side') as (PlayerSide | 'none');
        let region = $(this).attr('data-region');
        let linkedCardId = $(this).attr('data-linked-card-id');

        // 桜花結晶の移動で、かつ移動先の最大値を超える場合は表示を変える
        if(dragInfo.draggingFrom.type === 'sakura-token'){
            let tokenRegion = region as SakuraTokenRegion;
            let state = appActions.getState();
            let boardModel = new models.Board(state.board);
            let tokenCount = boardModel.getRegionSakuraTokens((side === 'none' ? null : side), tokenRegion, (linkedCardId === 'none' ? null : linkedCardId)).length;

            if(tokenCount + dragInfo.sakuraTokenMoveCount > SAKURA_TOKEN_MAX[tokenRegion]){
                $(`.area.droppable[data-side=${side}][data-region=${region}]`).addClass('over-forbidden');
                $(`.area.background[data-side=${side}][data-region=${region}]`).addClass('over-forbidden');
                return true;
            }
        }
        $(`.area.background[data-side=${side}][data-region=${region}]`).addClass('over');
        return true;
    });

    $('#BOARD').on('dragleave', '.area.droppable', function(e){
        console.log('dragleave', this);
        let side = $(this).attr('data-side') as (PlayerSide | 'none');
        let region = $(this).attr('data-region');
        $(`.area.background[data-side=${side}][data-region=${region}]`).removeClass('over').removeClass('over-forbidden');  // this / e.target is previous target element.
        $(`.area.droppable[data-side=${side}][data-region=${region}]`).removeClass('over').removeClass('over-forbidden');  // this / e.target is previous target element.
    });
    $('#BOARD').on('dragenter', '.fbs-card.card-droppable, .fbs-card.sakura-token-droppable', function(e){
        $($(this)).addClass('over');
    });
    $('#BOARD').on('dragleave', '.fbs-card.card-droppable, .fbs-card.sakura-token-droppable', function(e){
        $($(this)).removeClass('over');  // this / e.target is previous target element.
    });

    let lastDraggingFrom: state.BoardObject = null; 
    $('#BOARD').on('drop', '.area, .fbs-card.card-droppable, .fbs-card.sakura-token-droppable', function(e){
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
                let card = dragInfo.draggingFrom;
                let toSide = $this.attr('data-side') as PlayerSide;
                let toRegion = $this.attr('data-region') as CardRegion;

                // 移動ログを決定
                let logs: {text: string, visibility?: LogVisibility}[] = [];
                let cardName = CARD_DATA[card.cardId].name;
                let fromRegionTitle = utils.getCardRegionTitle(currentState.side, card.side, card.region);
                let toRegionTitle = utils.getCardRegionTitle(currentState.side, toSide, toRegion);

                // 移動元での公開状態と、移動先での公開状態を判定
                let oldOpenState = card.openState;
                let newOpenState = utils.judgeCardOpenState(card, toSide, toRegion);


                // ログ内容を決定
                console.log(`openState: ${oldOpenState} => ${newOpenState}`);
                if(oldOpenState === 'opened' || newOpenState === 'opened'){
                    // 公開状態から移動した場合や、公開状態へ移動した場合は、全員に名前を公開
                    logs.push({text: `[${cardName}]を移動しました：${fromRegionTitle} → ${toRegionTitle}`});


                } else {
                    // 上記以外の場合は、移動元と移動先の組み合わせに応じてログを決定
                    let oldMyKnown = ((card.region === 'hidden-used' || oldOpenState === 'ownerOnly') && card.side === currentState.side);
                    let newMyKnown = ((toRegion === 'hidden-used' || newOpenState === 'ownerOnly') && toSide === currentState.side);
                    let oldOpponentKnown = ((card.region === 'hidden-used' || oldOpenState === 'ownerOnly') && card.side === utils.flipSide(currentState.side));
                    let newOpponentKnown = ((toRegion === 'hidden-used' || newOpenState === 'ownerOnly') && toSide === utils.flipSide(currentState.side));
                    console.log(`known: my(${oldMyKnown} => ${newMyKnown}), opponent(${oldOpponentKnown} => ${newOpponentKnown})`);

                    if(oldMyKnown || newMyKnown){
                        // 自分は知っている
                        if(oldOpponentKnown || newOpponentKnown){
                            // 対戦相手も知っている (仮実装)
                            logs.push({text: `[${cardName}]を移動しました：${fromRegionTitle} → ${toRegionTitle}`});
                        } else {
                            // 対戦相手は知らない
                            logs.push({text: `[${cardName}]を移動しました：${fromRegionTitle} → ${toRegionTitle}`, visibility: 'ownerOnly'});
                            logs.push({text: `カードを1枚移動しました：${fromRegionTitle} → ${toRegionTitle}`, visibility: 'outerOnly'});
                        }
                    } else {
                        // 自分は知らない
                        if(oldOpponentKnown || newOpponentKnown){
                            // 対戦相手は知っている (仮実装)
                            logs.push({text: `カードを1枚移動しました：${fromRegionTitle} → ${toRegionTitle}`});
                        } else {
                            // 対戦相手も知らない
                            logs.push({text: `カードを1枚移動しました：${fromRegionTitle} → ${toRegionTitle}`});
                        }
                    }
                    
                }
                let cardNameLogging = false;
                
                // 自分のカードを操作した場合で、一定の条件を満たす場合はログを置き換える
                if(card.side === currentState.side && toSide === currentState.side){
                    if(card.region === 'hand' && toRegion === 'hidden-used'){
                        // 伏せ札にした場合
                        logs = [];
                        logs.push({text: `[${cardName}]を伏せ札にしました`, visibility: 'ownerOnly'});
                        logs.push({text: `カードを1枚伏せ札にしました`, visibility: 'outerOnly'});
                    }
                    if(card.region === 'hand' && toRegion === 'used'){
                        // 場に出した場合
                        logs = [];
                        logs.push({text: `[${cardName}]を場に出しました`});
                    }
                    if(card.region === 'library' && toRegion === 'hand'){
                        // カードを1枚引いた場合
                        logs = [];
                        logs.push({text: `カードを1枚引きました`});
                        cardNameLogging = true;
                    }
                }

                appActions.operate({
                    log: logs,
                    proc: () => {
                        appActions.moveCard({
                            from: card.id
                        , to: [toSide, toRegion] 
                        , cardNameLogging: cardNameLogging
                        });
                    }
                });
            }

            // // 桜花結晶を別領域に移動した場合
            if(dragInfo.draggingFrom.type === 'sakura-token'){
                let sakuraToken = dragInfo.draggingFrom;
                let toSideValue = $this.attr('data-side') as (PlayerSide | 'none');
                let toSide = (toSideValue === 'none' ? null : toSideValue);
                let toRegion = $this.attr('data-region') as SakuraTokenRegion;
                let toLinkedCardId: string = null;

                // カードの上に移動した場合
                if($(this).hasClass('fbs-card')){
                    toRegion = 'on-card';
                    toLinkedCardId = $(this).attr('data-object-id');
                }

                let logs: {text: string, visibility?: LogVisibility}[] = [];
                let fromRegionTitle = utils.getSakuraTokenRegionTitle(currentState.side, sakuraToken.side, sakuraToken.region);
                let toRegionTitle = utils.getSakuraTokenRegionTitle(currentState.side, toSide, toRegion);

                // ログ内容を決定
                logs.push({text: `桜花結晶を${dragInfo.sakuraTokenMoveCount}つ移動しました：${fromRegionTitle} → ${toRegionTitle}`});
                
                appActions.operate({
                    log: logs,
                    proc: () => {
                        appActions.moveSakuraToken({
                              from: [sakuraToken.side, sakuraToken.region, sakuraToken.linkedCardId]
                            , to: [toSide, toRegion, toLinkedCardId]
                            , moveNumber: dragInfo.sakuraTokenMoveCount
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

    // ドラッグゴースト画像を1秒後に表示
    setTimeout(function(){
        $('.drag-ghost').show();
    }, 1000);
});