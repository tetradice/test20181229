import i18next, { t } from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
// import LocizeBackend from 'i18next-locize-backend';
import FetchBackend from 'i18next-fetch-backend';
import BackendAdapter from 'i18next-multiload-backend-adapter';
import _ from "lodash";
import * as randomstring from 'randomstring';
import * as apps from "sakuraba/apps";
import { BOARD_BASE_WIDTH, ZIndex, StoreName } from "sakuraba/const";
import dragInfo from "sakuraba/dragInfo";
import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import toastr from "toastr";
import { CARD_DATA, SAKURA_TOKEN_MAX } from "./sakuraba";
import { Base64 } from 'js-base64';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

declare var params: {
    tableId: string;
    side: SheetSide;
    environment: 'production' | 'development';
    lang: Language;

    firebaseAuthInfo: string;
}

function messageModal(desc: string) {
    $('#MESSAGE-MODAL .description').html(desc);
    $('#MESSAGE-MODAL')
        .modal({ closable: false })
        .modal('show');
}

function confirmModal(desc: string, yesCallback: (this: JQuery, $element: JQuery) => false | void) {
    $('#CONFIRM-MODAL .description').html(desc);
    $('#CONFIRM-MODAL')
        .modal({ closable: false, onApprove: yesCallback })
        .modal('show');
}

$(function () {
    try {

        // Local Storageからユーザー設定を取得
        let storedSetting: state.VersionUnspecifiedSetting = null;
        let settingJson = localStorage.getItem('Setting');
        if (settingJson) {
            console.log("Setting: ", settingJson);
            storedSetting = JSON.parse(settingJson) as state.VersionUnspecifiedSetting;

            // 取得したユーザー設定がV1のものなら、設定のコンバート
            let newSetting: state.Setting;
            if (storedSetting['settingDataVersion']) {
                newSetting = (storedSetting as state.Setting);
            } else {
                newSetting = utils.createInitialState().setting; // 初期設定を元にする
                newSetting.megamiFaceViewMode = (storedSetting as state_v1.Setting).megamiFaceViewMode;
            }
        }

        // 初期言語の決定
        // ユーザーが設定画面で設定した言語があれば、その言語を使用
        // なければサーバー側が判別した言語を共用
        let startLanguage: Language = params.lang;
        if (storedSetting && storedSetting['stateDataVersion']){
            let storedUILang = (storedSetting as state.Setting).language.ui;
            if(storedUILang){
                startLanguage = storedUILang;
            }
        }

        // 言語設定の初期化。初期化完了後にメイン処理に入る
        i18next
            //.use(LocizeBackend)
            .use(BackendAdapter)
            .use(languageDetector)
            .init({
                defaultNS: 'common'
                , ns: ['common', 'log', 'cardset', 'help-window', 'dialog', 'miniquiz']
                , lng: startLanguage
                , preload: ['ja', 'en', 'zh'] // 対応しているすべての言語を先に読み込んでおく
                , debug: true
                , parseMissingKeyHandler: (k: string) => `[${k}]`
                , fallbackLng: 'ja'
                , backend: {
                      backend: FetchBackend
                    , backendOption: {
                          allowMultiLoading: true
                        , loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}'
                      }
                }
                
            }, function () {

                // 初期ステートを生成
                const st: state.State = utils.createInitialState();
                st.tableId = params.tableId;
                st.side = params.side;
                st.viewingSide = (params.side === 'watcher' ? 'p1' : params.side);
                st.environment = params.environment;
                st.setting.language = {allEqual: true, ui: params.lang, uniqueName: params.lang, cardText: params.lang};

                // ズーム設定を調整
                // コントロールパネルとチャットエリアの幅を350pxぶんは確保できるように調整
                let sideWidth = 350;
                let innerWidth = window.innerWidth;
                if (BOARD_BASE_WIDTH + sideWidth > innerWidth) st.zoom = 0.9;
                if (BOARD_BASE_WIDTH * 0.9 + sideWidth > innerWidth) st.zoom = 0.8;
                if (BOARD_BASE_WIDTH * 0.8 + sideWidth > innerWidth) st.zoom = 0.7;
                if (BOARD_BASE_WIDTH * 0.7 + sideWidth > innerWidth) st.zoom = 0.6;

                // アプリケーション起動
                let appActions = apps.main.run(st, document.getElementById('BOARD'));

                let contextMenuShowingAfterDrop: boolean = false;
                const processOnDragEnd = () => {
                    // コンテキストメニューを表示している場合、一部属性の解除を行わない
                    if (!contextMenuShowingAfterDrop) {
                        $('[draggable]').css('opacity', '1.0');
                        $('.area,.fbs-card').removeClass('over').removeClass('over-forbidden');
                    }

                    $('.area.droppable').css('z-index', -9999);
                    dragInfo.draggingFrom = null;
                }

                // カード移動時のメイン処理
                const moveCardMain = (card: state.Card, toSide: PlayerSide, toRegion: CardRegion, toLinkedCardId: string, toPosition: 'first' | 'last' = 'last') => {
                    let currentState = appActions.getState();

                    // 観戦者の場合は何もしない
                    if (currentState.side === 'watcher') return;

                    // 移動ログを決定
                    let logs: { text?: LogValue, body?: state.ActionLogBody, visibility?: LogVisibility }[] = [];
                    let boardModel = new models.Board(currentState.board);
                    let fromRegionLogParam = utils.getCardRegionTitleLog(currentState.side, card.side, card.region, currentState.board.cardSet, (card.linkedCardId ? boardModel.getCard(card.linkedCardId) : null));
                    let toRegionLogParam = utils.getCardRegionTitleLog(currentState.side, toSide, toRegion, currentState.board.cardSet, (toLinkedCardId ? boardModel.getCard(toLinkedCardId) : null));

                    // 移動元での公開状態と、移動先での公開状態を判定
                    let oldOpenState = card.openState;
                    let newOpenState = utils.judgeCardOpenState(currentState.board.cardSet, card, currentState.board.handOpenFlags[toSide], toSide, toRegion);

                    // ログ内容を決定
                    let logCardNameParam: state.ActionLogCardNameItem = { type: 'cn', cardSet: currentState.board.cardSet, cardId: card.cardId };
                    let logCardNameParams = { cardName: logCardNameParam };
                    let logFromToParams = { from: fromRegionLogParam, to: toRegionLogParam };
                    let logCardNameAndFromToParams = { cardName: logCardNameParam, from: fromRegionLogParam, to: toRegionLogParam };

                    if (oldOpenState === 'opened' || newOpenState === 'opened') {
                        // 公開状態から移動した場合や、公開状態へ移動した場合は、全員に名前を公開
                        logs.push({ body: {type: 'ls', key: 'log:[CARDNAME]を移動しました：FROM → TO', params: logCardNameAndFromToParams} });


                    } else {
                        // 上記以外の場合は、移動元と移動先の組み合わせに応じてログを決定
                        let oldMyKnown = ((card.region === 'hidden-used' || oldOpenState === 'ownerOnly') && card.side === currentState.side);
                        let newMyKnown = ((toRegion === 'hidden-used' || newOpenState === 'ownerOnly') && toSide === currentState.side);
                        let oldOpponentKnown = ((card.region === 'hidden-used' || oldOpenState === 'ownerOnly') && card.side === utils.flipSide(currentState.side));
                        let newOpponentKnown = ((toRegion === 'hidden-used' || newOpenState === 'ownerOnly') && toSide === utils.flipSide(currentState.side));
                        console.log(`known: my(${oldMyKnown} => ${newMyKnown}), opponent(${oldOpponentKnown} => ${newOpponentKnown})`);

                        if (oldMyKnown || newMyKnown) {
                            // 自分は知っている
                            if (oldOpponentKnown || newOpponentKnown) {
                                // 対戦相手も知っている (観戦者対応が必要)
                                logs.push({ body: {type: 'ls', key: 'log:[CARDNAME]を移動しました：FROM → TO', params: logCardNameAndFromToParams} });
                            } else {
                                // 対戦相手は知らない
                                logs.push({ body: {type: 'ls', key: 'log:[CARDNAME]を移動しました：FROM → TO', params: logCardNameAndFromToParams}, visibility: 'ownerOnly' });
                                logs.push({ body: {type: 'ls', key: 'log:カードを1枚移動しました：FROM → TO', params: logFromToParams}, visibility: 'outerOnly' });
                            }
                        } else {
                            // 自分は知らない
                            if (oldOpponentKnown || newOpponentKnown) {
                                // 対戦相手は知っている (観戦者対応が必要)
                                logs.push({ body: {type: 'ls', key: 'log:カードを1枚移動しました：FROM → TO', params: logFromToParams} });
                            } else {
                                // 対戦相手も知らない
                                logs.push({ body: {type: 'ls', key: 'log:カードを1枚移動しました：FROM → TO', params: logFromToParams} });
                            }
                        }

                    }
                    let cardNameLogging = false;

                    // 自分のカードを操作した場合で、一定の条件を満たす場合はログを置き換える
                    if (card.side === currentState.side && toSide === currentState.side) {
                        if (card.region === 'hand' && toRegion === 'hidden-used') {
                            // 伏せ札にした場合
                            logs = [];
                            logs.push({ body: {type: 'ls', key: 'log:[CARDNAME]を伏せ札にしました', params: logCardNameParams}, visibility: 'ownerOnly' });
                            logs.push({ body: {type: 'ls', key: 'log:カードを1枚伏せ札にしました'}, visibility: 'outerOnly' });
                        }
                        if (card.region === 'hand' && toRegion === 'used') {
                            // 場に出した場合
                            logs = [];
                            logs.push({ body: { type: 'ls', key: 'log:[CARDNAME]を場に出しました', params: logCardNameParams }});
                        }
                        if (card.region === 'library' && toRegion === 'hand') {
                            // カードを1枚引いた場合
                            logs = [];
                            logs.push({ body: {type: 'ls', key: 'log:カードを1枚引きました'} });
                            cardNameLogging = true;
                        }
                        if (toRegion === 'library') {
                            // カードを山札へ置いた場合
                            logs = [];
                            if (toPosition === 'first') {
                                logs.push({ body: {type: 'ls', key: 'log:[CARDNAME]を山札の底へ置きました', params: logCardNameParams}, visibility: 'ownerOnly' });
                                logs.push({ body: {type: 'ls', key: 'log:カードを1枚山札の底へ置きました'}, visibility: 'outerOnly' });
                            } else {
                                logs.push({ body: {type: 'ls', key: 'log:[CARDNAME]を山札の上へ置きました', params: logCardNameParams}, visibility: 'ownerOnly' });
                                logs.push({ body: {type: 'ls', key: 'log:カードを1枚山札の上へ置きました'}, visibility: 'outerOnly' });
                            }
                        }
                    }

                    appActions.operate({
                        logParams: logs,
                        proc: () => {
                            appActions.moveCard({
                                from: card.id
                                , to: [toSide, toRegion, toLinkedCardId]
                                , cardNameLogging: cardNameLogging
                                , toPosition: toPosition
                            });
                        }
                    });
                }


                // 山札へのカードドラッグ時メニュー
                $('#BOARD').append('<div id="CONTEXT-DRAG-TO-LIBRARY"></div>');
                $.contextMenu({
                    zIndex: ZIndex.CONTEXT_MENU_VISIBLE,
                    trigger: 'none',
                    selector: '#CONTEXT-DRAG-TO-LIBRARY',
                    events: {
                        hide: (e) => {
                            contextMenuShowingAfterDrop = false;
                            processOnDragEnd();
                        }
                    },
                    build: function ($elem: JQuery, event: JQueryEventObject) {
                        console.log('contextmenu:hide', $elem.menu);
                        let currentState = appActions.getState();
                        let side = currentState.side as PlayerSide;
                        let board = new models.Board(currentState.board);
                        let items: Object = {};

                        items['toTop'] = {
                            name: t('山札の上に置く'), callback: () => {
                                moveCardMain(dragInfo.lastDraggingCardBeforeContextMenu, dragInfo.lastDragToSideBeforeContextMenu, 'library', null);
                            }
                        };
                        items['toBottom'] = {
                            name: t('山札の底に置く'), callback: () => {
                                moveCardMain(dragInfo.lastDraggingCardBeforeContextMenu, dragInfo.lastDragToSideBeforeContextMenu, 'library', null, 'first');
                            }
                        };
                        items['sep'] = '----';
                        items['cancel'] = { name: t('キャンセル'), callback: () => { } };

                        return { items: items };

                    }
                });

                // 間合への造花結晶ドラッグ時メニュー
                $('#BOARD').append('<div id="CONTEXT-DRAG-ARTIFICIAL-TOKEN-TO-DISTANCE"></div>');
                $.contextMenu({
                    zIndex: ZIndex.CONTEXT_MENU_VISIBLE,
                    trigger: 'none',
                    selector: '#CONTEXT-DRAG-ARTIFICIAL-TOKEN-TO-DISTANCE',
                    events: {
                        hide: (e) => {
                            contextMenuShowingAfterDrop = false;
                            processOnDragEnd();
                        }
                    },
                    build: function ($elem: JQuery, event: JQueryEventObject) {
                        console.log('contextmenu:hide', $elem.menu);
                        let currentState = appActions.getState();
                        let token = dragInfo.lastDraggingSakuraTokenBeforeContextMenu;
                        let boardModel = new models.Board(currentState.board);
                        let side = currentState.side as PlayerSide;
                        let items: Object = {};
                        let forwardEnabled = boardModel.isRideForwardEnabled(token.ownerSide, dragInfo.lastDraggingSakuraTokenBeforeContextMenu.groupTokenDraggingCount);
                        let backEnabled = boardModel.isRideBackEnabled(token.ownerSide, dragInfo.lastDraggingSakuraTokenBeforeContextMenu.groupTokenDraggingCount);

                        items['forward'] = {
                            name: t('騎動前進'), disabled: !forwardEnabled, callback: () => {
                                appActions.oprRideForward({ side: token.ownerSide, moveNumber: dragInfo.lastDraggingSakuraTokenBeforeContextMenu.groupTokenDraggingCount });
                            }
                        };
                        items['back'] = {
                            name: t('騎動後退'), disabled: !backEnabled, callback: () => {
                                appActions.oprRideBack({ side: token.ownerSide, moveNumber: dragInfo.lastDraggingSakuraTokenBeforeContextMenu.groupTokenDraggingCount });
                            }
                        };
                        items['sep'] = '----';
                        items['cancel'] = { name: t('キャンセル'), callback: () => { } };

                        return { items: items };

                    }
                });

                // 畏縮トークンクリックメニュー
                $('#BOARD').append('<div id="CONTEXT-WITHERED-TOKEN-CLICK"></div>');
                $.contextMenu({
                    zIndex: ZIndex.CONTEXT_MENU_VISIBLE,
                    trigger: 'none',
                    selector: '#CONTEXT-WITHERED-TOKEN-CLICK',
                    build: function ($elem: JQuery, event: JQueryEventObject) {
                        let currentState = appActions.getState();
                        let side = currentState.side as PlayerSide;
                        let board = new models.Board(currentState.board);
                        let items: Object = {};

                        items['remove'] = {
                            name: t('畏縮を解除'), callback: () => {
                                appActions.oprSetWitherFlag({
                                    side: side
                                    , value: false
                                });
                            }
                        };
                        items['sep'] = '----';
                        items['cancel'] = { name: t('キャンセル'), callback: () => { } };

                        return { items: items };

                    }
                });

                // 計略トークンクリックメニュー
                $('#BOARD').append('<div id="CONTEXT-PLAN-TOKEN-CLICK"></div>');
                $.contextMenu({
                    zIndex: ZIndex.CONTEXT_MENU_VISIBLE,
                    trigger: 'none',
                    selector: '#CONTEXT-PLAN-TOKEN-CLICK',
                    build: function ($elem: JQuery, event: JQueryEventObject) {
                        let currentState = appActions.getState();
                        let side = currentState.side as PlayerSide;
                        let board = new models.Board(currentState.board);
                        let items: Object = {};

                        let planState = board.planStatus[currentState.side];
                        if (planState === 'back-blue' || planState === 'back-red') {
                            items['open'] = {
                                name: t('計略を公開する'), callback: () => {
                                    appActions.operate({
                                        log: ['log:計略を公開しました -> PLAN', { plan: (planState === 'back-blue' ? ['神算', null] : ['鬼謀', null]) }],  // `計略を公開しました -> ${planState === 'back-blue' ? '神算' : '鬼謀'}`,
                                        proc: () => {
                                            appActions.setPlanState({ side: side, value: (planState === 'back-blue' ? 'blue' : 'red') });
                                        }
                                    });
                                }
                            };
                        } else {
                            items['blue'] = {
                                name: t('次の計略を「PLAN」で準備する', { plan: t('神算') }), callback: () => {
                                    appActions.operate({
                                        log: ['log:次の計略を準備しました', null],
                                        proc: () => {
                                            appActions.setPlanState({ side: side, value: 'back-blue' });
                                        }
                                    });
                                }
                            };
                            items['red'] = {
                                name: t('次の計略を「PLAN」で準備する', { plan: t('鬼謀') }), callback: () => {
                                    appActions.operate({
                                        log: ['log:次の計略を準備しました', null],
                                        proc: () => {
                                            appActions.setPlanState({ side: side, value: 'back-red' });
                                        }
                                    });
                                }
                            };
                        }

                        items['sep'] = '----';
                        items['cancel'] = { name: t('キャンセル'), callback: () => { } };

                        return { items: items };

                    }
                });

                // 傘トークンクリックメニュー
                $('#BOARD').append('<div id="CONTEXT-UMBRELLA-TOKEN-CLICK"></div>');
                $.contextMenu({
                    zIndex: ZIndex.CONTEXT_MENU_VISIBLE,
                    trigger: 'none',
                    selector: '#CONTEXT-UMBRELLA-TOKEN-CLICK',
                    build: function ($elem: JQuery, event: JQueryEventObject) {
                        let currentState = appActions.getState();
                        let side = currentState.side as PlayerSide;
                        let board = new models.Board(currentState.board);
                        let items: Object = {};

                        let umbrellaState = board.umbrellaStatus[currentState.side];
                        if (umbrellaState === 'closed') {
                            items['open'] = {
                                name: t('傘を開く'), callback: () => {
                                    appActions.operate({
                                        log: ['log:傘を開きました', null],
                                        proc: () => {
                                            appActions.setUmbrellaState({ side: side, value: 'opened' });
                                        }
                                    });
                                }
                            };
                        } else {
                            items['close'] = {
                                name: t('傘を閉じる'), callback: () => {
                                    appActions.operate({
                                        log: ['log:傘を閉じました', null],
                                        proc: () => {
                                            appActions.setUmbrellaState({ side: side, value: 'closed' });
                                        }
                                    });
                                }
                            };
                        }

                        items['sep'] = '----';
                        items['cancel'] = { name: t('キャンセル'), callback: () => { } };

                        return { items: items };

                    }
                });

                // 右クリックメニュー
                $.contextMenu({
                    selector: '#BOARD-PLAYAREA, #BOARD-PLAYAREA *',
                    zIndex: ZIndex.CONTEXT_MENU_VISIBLE_RIGHT_CLICK,

                    build: function ($elem: JQuery, event: JQueryEventObject) {
                        let currentState = appActions.getState();
                        let board = new models.Board(currentState.board);
                        let items: Object = null;

                        // 観戦者は右クリックメニューを開けない
                        if (currentState.side === 'watcher') return false;
                        let playerSide = currentState.side;
                        let opponentSide = utils.flipSide(playerSide);

                        // 決闘を開始していなければ、メニューを開けない
                        if (!currentState.board.mariganFlags[playerSide]) {
                            return false;
                        };

                        // 帯電解除コマンドを追加する関数
                        const addDischargeCommand = (items: any, card: state.Card, addSeparator?: boolean): boolean => {
                            // プレイヤーがライラを宿しており、かつ対象のカードが公開状態で、ライラのカードでもTransformカードでもない場合、帯電解除を行える
                            if (board.megamis[card.side][0] === 'raira' || board.megamis[card.side][1] === 'raira') {
                                if (addSeparator) {
                                    items['sepDischarge'] = '---';
                                }

                                items['dischargeAndIncrementWind'] = {
                                    name: t('帯電を解除し、GAUGEを1上げる', { gauge: t('風神ゲージ') })
                                    , disabled: (card.openState !== 'opened' || card.discharged || CARD_DATA[currentState.board.cardSet][card.cardId].megami === 'raira' || CARD_DATA[currentState.board.cardSet][card.cardId].baseType === 'transform')
                                    , callback: function () {
                                        appActions.oprDischarge({ objectId: card.id, guageType: 'wind' });
                                    }
                                }
                                items['dischargeAndIncrementThunder'] = {
                                    name: t('帯電を解除し、GAUGEを1上げる', { gauge: t('雷神ゲージ') })
                                    , disabled: (card.openState !== 'opened' || card.discharged || CARD_DATA[currentState.board.cardSet][card.cardId].megami === 'raira' || CARD_DATA[currentState.board.cardSet][card.cardId].baseType === 'transform')
                                    , callback: function () {
                                        appActions.oprDischarge({ objectId: card.id, guageType: 'thunder' });
                                    }
                                }

                                return true;
                            }

                            return false;
                        };

                        // 基本動作コマンドを追加する関数
                        const makeBasicActionCommandItems = (side: PlayerSide, costType: 'hand' | 'vigor', useCardId?: string) => {
                            let basicActionEnabled = board.checkBasicActionEnabled(side);
                            let subItems = {};
                            subItems['forward'] = {
                                name: `${t('前進')} <span style="font-size: smaller; color: silver;">${t('（FROM⇒TO）', { from: t('領域名-間合'), to: t('領域名-オーラ') })}</span>`
                                , isHtmlName: true
                                , disabled: !basicActionEnabled.forward
                                , callback: () => {
                                    appActions.oprBasicAction({ from: [null, 'distance', null], to: [side, 'aura', null], actionTitleKey: '前進', costType: costType, useCardId: useCardId });
                                }
                            };
                            subItems['leave'] = {
                                name: `${t('離脱')} <span style="font-size: smaller; color: silver;">${t('（FROM⇒TO）', { from: t('領域名-ダスト'), to: t('領域名-間合') })}</span>`
                                , isHtmlName: true
                                , disabled: !basicActionEnabled.leave
                                , callback: () => {
                                    appActions.oprBasicAction({ from: [null, 'dust', null], to: [null, 'distance', null], actionTitleKey: '離脱', costType: costType, useCardId: useCardId });
                                }
                            };
                            subItems['back'] = {
                                name: `${t('後退')} <span style="font-size: smaller; color: silver;">${t('（FROM⇒TO）', { from: t('領域名-オーラ'), to: t('領域名-間合') })}</span>`
                                , isHtmlName: true
                                , disabled: !basicActionEnabled.back
                                , callback: () => {
                                    appActions.oprBasicAction({ from: [side, 'aura', null], to: [null, 'distance', null], actionTitleKey: '後退', costType: costType, useCardId: useCardId });

                                }
                            };
                            subItems['wear'] = {
                                name: `${t('纏い')} <span style="font-size: smaller; color: silver;">${t('（FROM⇒TO）', { from: t('領域名-ダスト'), to: t('領域名-オーラ') })}</span>`
                                , isHtmlName: true
                                , disabled: !basicActionEnabled.wear
                                , callback: () => {
                                    appActions.oprBasicAction({ from: [null, 'dust', null], to: [side, 'aura', null], actionTitleKey: '纏い', costType: costType, useCardId: useCardId });

                                }
                            };
                            subItems['charge'] = {
                                name: `${t('宿し')} <span style="font-size: smaller; color: silver;">${t('（FROM⇒TO）', { from: t('領域名-オーラ'), to: t('領域名-フレア') })}</span>`
                                , isHtmlName: true
                                , disabled: !basicActionEnabled.charge
                                , callback: () => {
                                    appActions.oprBasicAction({ from: [side, 'aura', null], to: [side, 'flair', null], actionTitleKey: '宿し', costType: costType, useCardId: useCardId });
                                }
                            };
                            return subItems;
                        };

                        // 使用済み札で右クリック
                        if ($elem.is('.fbs-card[data-region=used]')) {
                            let id = $elem.attr('data-object-id');
                            let card = board.getCard(id);
                            let cardData = CARD_DATA[currentState.board.cardSet][card.cardId];
                            items = {};

                            // 条件を満たしていれば、帯電解除コマンドを追加
                            let addedDischarge = addDischargeCommand(items, card);

                            // 交換先のカードがあり、かつ自分のカードか？
                            if (cardData.exchangableTo && card.side === playerSide) {
                                // 交換先のカードが追加札領域に存在する場合は実行可能
                                let extraCard = board.getRegionCards(card.side, 'extra', null).find(c => c.cardId === cardData.exchangableTo);

                                // 帯電解除コマンドが追加されていれば罫線を追加
                                if (addedDischarge) {
                                    items['sepExchange'] = '---';
                                }

                                // 交換メニューを表示
                                let exchangeToCardData = CARD_DATA[currentState.board.cardSet][cardData.exchangableTo];
                                items['exchange'] = {
                                    name: t('追加札の[CARDNAME]に交換する', {cardName: exchangeToCardData.name})
                                    , disabled: !extraCard
                                    , callback: () => {
                                        appActions.operate({
                                            log: ['log:[CARDNAME1]を[CARDNAME2]に交換しました', { cardName1: { type: 'cn', cardSet: currentState.board.cardSet, cardId: card.cardId }, cardName2: { type: 'cn', cardSet: currentState.board.cardSet, cardId: cardData.exchangableTo }}],
                                            proc: () => {
                                                appActions.moveCard({ from: id, to: [card.side, 'extra', null] });
                                                appActions.moveCard({ from: extraCard.id, to: [card.side, 'used', null] });
                                            }
                                        });
                                    }
                                }
                            }
                        }
                        // 切り札で右クリック
                        if ($elem.is('.fbs-card[data-region=special]')) {
                            let id = $elem.attr('data-object-id');
                            let card = board.getCard(id);
                            let cardData = CARD_DATA[currentState.board.cardSet][card.cardId];

                            items = {};
                            items['flip'] = {
                                name: (card.specialUsed ? t('裏向きにする') : t('表向きにする'))
                                , callback: function () {
                                    appActions.oprSetSpecialUsed({ objectId: id, value: !card.specialUsed });
                                }
                            }

                            // 条件を満たしていれば、帯電解除コマンドを追加
                            addDischargeCommand(items, card, true);

                            // 交換先のカードがあり、かつ自分のカードか？
                            if (cardData.exchangableTo && card.side === playerSide) {
                                // 交換先のカードが追加札領域に存在する場合は実行可能
                                let extraCard = board.getRegionCards(card.side, 'extra', null).find(c => c.cardId === cardData.exchangableTo);
                                // 交換メニューを表示
                                let exchangeToCardData = CARD_DATA[currentState.board.cardSet][cardData.exchangableTo];

                                items['sepExchange'] = '---';

                                // 神代枝のみ特殊 (交換と同時にゲームから取り除く)
                                if (card.cardId === '05-oboro-A1-s-4') {
                                    items['exchange'] = {
                                        name: t('[CARDNAME1]をゲームから取り除き、追加札の[CARDNAME2]を得る', { cardName1: cardData.name, cardName2: exchangeToCardData.name })
                                        , disabled: !extraCard || !card.specialUsed // 追加札領域に対象カードがあり、かつ表向きの場合のみ
                                        , callback: () => {
                                            // まだ相手が決闘を開始していなければ、この操作は禁止する
                                            // (決闘を開始する前にカードを取り除くと、更新がうまくいかずにエラーが多発する場合があるため。原因不明)
                                            if (!currentState.board.mariganFlags[utils.flipSide(playerSide)]) {
                                                utils.messageModal(t('dialog:相手が決闘を開始するまでは、この操作を行うことはできません。'));
                                                return;
                                            }

                                            utils.confirmModal(t('dialog:ゲームから取り除いた後は、元に戻すことはできません。よろしいですか？'), () => {

                                                appActions.operate({
                                                    log: ['log:[CARDNAME1]を取り除き、[CARDNAME2]を追加札から取得しました', { cardName1: { type: 'cn', cardSet: currentState.board.cardSet, cardId: card.cardId }, cardName2: { type: 'cn', cardSet: currentState.board.cardSet, cardId: cardData.exchangableTo } }],
                                                    proc: () => {
                                                        appActions.removeCard({ objectId: id });
                                                        appActions.moveCard({ from: extraCard.id, to: [playerSide, 'special', null] });
                                                    }
                                                });
                                            });

                                        }
                                    }
                                } else {
                                    items['exchange'] = {
                                        name: t('追加札の[CARDNAME]に交換する', { cardName: exchangeToCardData.name })
                                        , disabled: !extraCard || !card.specialUsed // 追加札領域に対象カードがあり、かつ表向きの場合のみ
                                        , callback: () => {
                                            // 桜花結晶が乗っている切札を、交換しようとした場合はエラー
                                            let onCardTokens = board.getRegionSakuraTokens(card.side, 'on-card', card.id);
                                            if (onCardTokens.length >= 1) {
                                                utils.messageModal(t("dialog:桜花結晶が上に乗っている切札は、交換できません。"));
                                                return;
                                            }

                                            appActions.operate({
                                                log: ['log:[CARDNAME1]を[CARDNAME2]に交換しました', { cardName1: { type: 'cn', cardSet: currentState.board.cardSet, cardId: card.cardId }, cardName2: { type: 'cn', cardSet: currentState.board.cardSet, cardId: cardData.exchangableTo } }],
                                                proc: () => {
                                                    appActions.moveCard({ from: id, to: [card.side, 'extra', null] });
                                                    appActions.moveCard({ from: extraCard.id, to: [card.side, 'special', null] });
                                                }
                                            });
                                        }
                                    }
                                }
                            }

                            // 残響装置:枢式で、かつ自分のカードか？
                            if (card.cardId === '13-utsuro-A1-s-1' && card.side === playerSide) {

                                items['sepShadowArise'] = '---';

                                let dustCount = board.getRegionSakuraTokens(null, 'dust', null).length;
                                items['shadowArise'] = {
                                    name: t('- 終焉の影が蘇る -')
                                    , disabled: !card.specialUsed || dustCount < 13 // カードが表向き、かつダストが13以上の場合のみ使用可能
                                    , callback: () => {
                                        // まだ相手が決闘を開始していなければ、この操作は禁止する
                                        // (決闘を開始する前にカードを取り除くと、更新がうまくいかずにエラーが多発する場合があるため。原因不明)
                                        if (!currentState.board.mariganFlags[utils.flipSide(playerSide)]) {
                                            utils.messageModal(t('相手が決闘を開始するまでは、この操作を行うことはできません。'));
                                            return;
                                        }

                                        utils.confirmModal(t('dialog:あなたの使用済み、伏せ札、手札、山札領域にあるすべてのカードは取り除かれます。また、[残響装置:枢式]は取り除かれ、代わりにいくつかのカードを追加で得ます。', {cardName: cardData.name}), () => {
                                            appActions.operate({
                                                log: ['log:終焉の影が蘇りました', null],
                                                proc: () => {
                                                    // 通常札上のすべての桜花結晶をダストへ移動
                                                    let sakuraTokensOnBoard = board.objects.filter(v => v.type === 'sakura-token' && v.side === card.side && v.region == 'on-card') as state.SakuraToken[];
                                                    for (let token of sakuraTokensOnBoard) {
                                                        let linkedCardData = CARD_DATA[board.cardSet][board.getCard(token.linkedCardId).cardId];
                                                        if (linkedCardData.baseType === 'normal') {
                                                            appActions.moveSakuraToken({ from: [token.side, token.region, token.linkedCardId], to: [null, 'dust', null] });
                                                        }
                                                    }

                                                    // 封印通常札をすべて取り除く
                                                    let sealedCards = board.objects.filter(v => v.type === 'card' && v.side === card.side && v.region === 'on-card') as state.Card[];
                                                    for (let targetCard of sealedCards) {
                                                        let linkedCardData = CARD_DATA[board.cardSet][board.getCard(targetCard.linkedCardId).cardId];
                                                        if (linkedCardData.baseType === 'normal') {
                                                            appActions.removeCard({ objectId: targetCard.id });
                                                        }
                                                    }

                                                    // 使用済み、伏せ札、手札、山札をすべて取り除く (transformカードは除く)
                                                    for (let region of ['used', 'hidden-used', 'hand', 'library'] as CardRegion[]) {
                                                        for (let targetCard of board.getRegionCards(card.side, region, null)) {
                                                            let targetCardData = CARD_DATA[board.cardSet][targetCard.cardId];
                                                            if (targetCardData.baseType !== 'transform') {
                                                                appActions.removeCard({ objectId: targetCard.id });
                                                            }
                                                        }
                                                    }

                                                    // 残響装置:枢式を取り除く
                                                    appActions.removeCard({ objectId: card.id });

                                                    // 追加札からカードを得る
                                                    let extraCards = board.getRegionCards(card.side, 'extra', null);
                                                    let targetExtraCard: state.Card;
                                                    if (targetExtraCard = extraCards.find(x => x.cardId === '13-utsuro-A1-s-1-ex1')) {
                                                        appActions.moveCard({ from: targetExtraCard.id, to: [card.side, 'special', null] });
                                                        appActions.setSpecialUsed({ objectId: targetExtraCard.id, value: true });
                                                    }
                                                    if (targetExtraCard = extraCards.find(x => x.cardId === '13-utsuro-A1-s-1-ex2')) {
                                                        appActions.moveCard({ from: targetExtraCard.id, to: [card.side, 'library', null] });
                                                    }
                                                    if (targetExtraCard = extraCards.find(x => x.cardId === '13-utsuro-A1-s-1-ex3')) {
                                                        appActions.moveCard({ from: targetExtraCard.id, to: [card.side, 'library', null] });
                                                    }
                                                    if (targetExtraCard = extraCards.find(x => x.cardId === '13-utsuro-A1-s-1-ex4')) {
                                                        appActions.moveCard({ from: targetExtraCard.id, to: [card.side, 'library', null] });
                                                    }

                                                    // 山札をシャッフル
                                                    appActions.shuffle({ side: card.side });

                                                    // カードを1枚引く
                                                    appActions.oprDraw({ cardNameLogging: true });
                                                }
                                            });
                                        });
                                    }
                                }
                            }

                            // ゲームから取り除くことが可能なカードであれば、取り除く選択肢を表示
                            if (cardData.removable) {
                                items['sep2'] = '---';
                                items['remove'] = {
                                    name: t('[CARDNAME]をゲームから取り除く', { cardName: CARD_DATA[currentState.board.cardSet][card.cardId].name })
                                    , callback: function () {
                                        // まだ相手が決闘を開始していなければ、この操作は禁止する
                                        // (決闘を開始する前にカードを取り除くと、更新がうまくいかずにエラーが多発する場合があるため。原因不明)
                                        if (!currentState.board.mariganFlags[utils.flipSide(playerSide)]) {
                                            utils.messageModal(t('dialog:相手が決闘を開始するまでは、この操作を行うことはできません。'));
                                            return;
                                        }

                                        utils.confirmModal(t('dialog:ゲームから取り除いた後は、元に戻すことはできません。よろしいですか？'), () => {
                                            appActions.oprRemoveCard({ objectId: id });
                                        });
                                    }
                                }
                            };


                        }


                        // 集中力で右クリック
                        if ($elem.is('.fbs-vigor-card, .fbs-vigor-card *, .withered-token')) {
                            let side = $elem.closest('[data-side]').attr('data-side') as PlayerSide;



                            items = {};

                            // 自分の集中力の場合、基本動作メニューも表示
                            if (side === currentState.side) {
                                items['basicAction'] = {
                                    name: t('集中力を使用して基本動作')
                                    , items: makeBasicActionCommandItems(side, 'vigor')
                                    , disabled: currentState.board.vigors[side] === 0
                                }
                                items['sep'] = '----';
                            }
                            items['wither'] = {
                                name: (board.witherFlags[side] ? t('畏縮を解除') : t('コマンド-畏縮'))
                                , callback: () => appActions.oprSetWitherFlag({ side: side, value: !board.witherFlags[side] })
                            }
                        }

                        // 封印されたカードの場所で右クリック
                        let $sealedCard = $elem.closest(`.fbs-card[data-region=on-card]`);
                        if ($sealedCard.length >= 1) {
                            let id = $sealedCard.attr('data-object-id');
                            let card = board.getCard(id);
                            let cardData = CARD_DATA[currentState.board.cardSet][card.cardId];
                            let linkedCard = board.getCard($sealedCard.attr('data-linked-card-id'));
                            let linkedCardData = CARD_DATA[currentState.board.cardSet][linkedCard.cardId];
                            items = {};

                            if (card.ownerSide === playerSide) {
                                items['sendToSelf'] = {
                                    name: t('[CARDNAME]を自分の捨て札にする', { cardName: cardData.name }), callback: () => {
                                        appActions.operate({
                                            log: ['log:[LINKEDCARDNAME]の下に封印されていた[CARDNAME]を、捨て札にしました', { cardName: { type: 'cn', cardSet: currentState.board.cardSet, cardId: id }, linkedCardName: { type: 'cn', cardSet: currentState.board.cardSet, cardId: linkedCard.cardId } }],
                                            proc: () => {
                                                appActions.moveCard({ from: id, to: [playerSide, 'used', null] });
                                            }
                                        });
                                    }
                                }
                            }
                            if (card.ownerSide === utils.flipSide(playerSide)) {
                                items['sendToOpponent'] = {
                                    name: t('[CARDNAME]を相手の捨て札にする', { cardName: cardData.name }), callback: () => {
                                        appActions.operate({
                                            log: ['log:[LINKEDCARDNAME]の下に封印されていた[CARDNAME]を、相手の捨て札にしました', { cardName: { type: 'cn', cardSet: currentState.board.cardSet, cardId: id }, linkedCardName: { type: 'cn', cardSet: currentState.board.cardSet, cardId: linkedCard.cardId } }],
                                            proc: () => {
                                                appActions.moveCard({ from: id, to: [utils.flipSide(playerSide), 'used', null] });
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        // 自分の手札で右クリック
                        let $handArea = $elem.closest(`.area.background[data-side=${playerSide}][data-region=hand]`);
                        let $handCard = $elem.closest(`.fbs-card[data-side=${playerSide}][data-region=hand]`);
                        if ($handArea.length >= 1 || $handCard.length >= 1) {
                            items = {};

                            // カードを個別に右クリック
                            if ($handCard.length >= 1) {
                                let id = $handCard.attr('data-object-id');
                                let card = board.getCard(id);
                                let cardData = CARD_DATA[currentState.board.cardSet][card.cardId];

                                // 伏せ札にして基本動作
                                items['basicAction'] = {
                                    name: t('伏せ札にして基本動作')
                                    , items: makeBasicActionCommandItems(playerSide, 'hand', id)
                                    , disabled: cardData.poison
                                }
                                items['sep'] = '----';

                                // 全手札を公開していない状態であれば、そのカードの公開/非公開操作も可能
                                if (!currentState.board.handOpenFlags[playerSide]) {

                                    if (currentState.board.handCardOpenFlags[playerSide][id]) {
                                        items['closeCard'] = {
                                            name: t('[CARDNAME]の公開を中止する', { cardName: cardData.name }), callback: () => {
                                                appActions.operate({
                                                    log: ['log:[CARDNAME]の公開を中止しました', { cardName: { type: 'cn', cardSet: currentState.board.cardSet, cardId: id } }],
                                                    proc: () => {
                                                        appActions.setHandCardOpenFlag({ side: playerSide, cardId: id, value: false });
                                                    }
                                                });
                                            }
                                        }
                                    } else {
                                        items['openCard'] = {
                                            name: t('[CARDNAME]を相手に公開する', { cardName: cardData.name }), callback: () => {
                                                appActions.operate({
                                                    log: ['log:[CARDNAME]を公開しました', { cardName: { type: 'cn', cardSet: currentState.board.cardSet, cardId: id } }],
                                                    proc: () => {
                                                        appActions.setHandCardOpenFlag({ side: playerSide, cardId: id, value: true });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }


                            // 全体の公開/非公開操作
                            if (currentState.board.handOpenFlags[playerSide]) {
                                items['close'] = {
                                    name: t('全手札の公開を中止する'), callback: () => {
                                        appActions.operate({
                                            log: ['log:手札の公開を中止しました', null],
                                            proc: () => {
                                                appActions.setHandOpenFlag({ side: playerSide, value: false });
                                            }
                                        });
                                    }
                                }
                            } else {
                                items['open'] = {
                                    name: t('全手札を相手に公開する'), disabled: () => {
                                        let board = new models.Board(appActions.getState().board);

                                        let cards = board.getRegionCards(playerSide, 'hand', null);
                                        return cards.length === 0;
                                    }, callback: () => {
                                        appActions.operate({
                                            log: ['log:手札を公開しました', null],
                                            proc: () => {
                                                appActions.setHandOpenFlag({ side: playerSide, value: true });
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        // 相手の手札で右クリック
                        if ($elem.closest(`.area.background[data-side=${opponentSide}][data-region=hand], .fbs-card[data-side=${opponentSide}][data-region=hand]`).length >= 1) {
                            items = {};

                            // 相手が決闘を開始している場合のみ実行可能
                            if (currentState.board.mariganFlags[opponentSide]) {
                                let opponentHandCards = board.getRegionCards(opponentSide, 'hand', null);
                                items['discard'] = {
                                    name: t('手札1枚を無作為に選んで捨て札にする')
                                    , disabled: opponentHandCards.length === 0
                                    , callback: () => {
                                        // ランダムにカードを選出
                                        let index = _.random(opponentHandCards.length - 1);
                                        let card = opponentHandCards[index];

                                        appActions.operate({
                                            log: ['log:相手の手札1枚を無作為に選び、捨て札にしました -> [CARDNAME]', { cardName: { type: 'cn', cardSet: currentState.board.cardSet, cardId: card.cardId } }],
                                            proc: () => {
                                                appActions.moveCard({ from: [opponentSide, 'hand', null], fromPosition: index, to: [opponentSide, 'used', null] });
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        // 自分の山札で右クリック
                        if ($elem.is(`.area.background[data-region=library][data-side=${playerSide}], .fbs-card[data-region=library][data-side=${playerSide}]`)) {

                            items = {
                                'draw': {
                                    name: t('1枚引く'), disabled: () => {
                                        let board = new models.Board(appActions.getState().board);

                                        let cards = board.getRegionCards(playerSide, 'library', null);
                                        return cards.length === 0;
                                    }, callback: () => {
                                        appActions.oprDraw({});
                                    }
                                },
                                'sep1': '---------',
                                'reshuffle': {
                                    name: t('再構成する'), callback: () => {
                                        appActions.oprReshuffle({ side: playerSide, lifeDecrease: true });
                                    }
                                },
                                'reshuffleWithoutDamage': {
                                    name: t('再構成する(ライフ減少なし)'), callback: () => {
                                        appActions.oprReshuffle({ side: playerSide, lifeDecrease: false });
                                    }
                                },
                            }
                        }

                        // オーラで右クリック
                        if ($elem.is(`.sakura-token[data-region=aura]`)) {
                            let id = $elem.attr('data-object-id');
                            let token = board.getSakuraToken(id);

                            items = {
                                'damage': {
                                    name: (token.side === playerSide ? t('オーラにNダメージ', { count: token.groupTokenDraggingCount }) : t('相手のオーラにNダメージ', { count: token.groupTokenDraggingCount })), callback: () => {
                                        appActions.operate({
                                            log: (token.side === playerSide ? ['log:オーラにNダメージを受けました', { count: token.groupTokenDraggingCount }] : ['log:相手のオーラにNダメージを与えました', { count: token.groupTokenDraggingCount }]),
                                            proc: () => {
                                                appActions.moveSakuraToken({
                                                    from: [token.side, token.region, token.linkedCardId]
                                                    , to: [null, 'dust', null]
                                                    , moveNumber: token.groupTokenDraggingCount
                                                });
                                            }
                                        });
                                    }
                                },
                            }
                        }
                        // ライフで右クリック
                        if ($elem.is(`.sakura-token[data-region=life]`)) {
                            let id = $elem.attr('data-object-id');
                            let token = board.getSakuraToken(id);

                            items = {
                                'damage': {
                                    name: (token.side === playerSide ? t('ライフにNダメージ', { count: token.groupTokenDraggingCount }) : t('相手のライフにNダメージ', { count: token.groupTokenDraggingCount })), callback: () => {
                                        appActions.operate({
                                            log: (token.side === playerSide ? ['log:ライフにNダメージを受けました', { count: token.groupTokenDraggingCount }] : ['log:相手のライフにNダメージを与えました', { count: token.groupTokenDraggingCount }]),
                                            proc: () => {
                                                appActions.moveSakuraToken({
                                                    from: [token.side, token.region, token.linkedCardId]
                                                    , to: [token.side, 'flair', null]
                                                    , moveNumber: token.groupTokenDraggingCount
                                                });
                                            }
                                        });
                                    }
                                },
                            }
                        }

                        if (items === null) {
                            return false;
                        } else {
                            return {
                                items: items,
                            };
                        }

                    }
                });

                // firebase初期化
                const firebaseAuthInfoList = Base64.decode(params.firebaseAuthInfo).split(' ');
                firebase.initializeApp({
                    apiKey: firebaseAuthInfoList[0],
                    authDomain: firebaseAuthInfoList[1],
                    databaseURL: firebaseAuthInfoList[2],
                    projectId: firebaseAuthInfoList[3],
                    storageBucket: firebaseAuthInfoList[4],
                    messagingSenderId: firebaseAuthInfoList[5],
                });
                const db = firebase.firestore();
                db.settings({ timestampsInSnapshots: true});
                appActions.setFirestore(db);

                // 初期データを取得し、メイン処理をスタート
                let sakurabaTablesRef = db.collection(StoreName.TABLES);
                let board: state.Board = null;
                let actionLogs: state.ActionLogRecord[] = null;
                let chatLogs: state.ChatLogRecord[] = null;
                let notifyLogs: state.NotifyLogRecord[] = null;
                let tableRef = sakurabaTablesRef.doc(params.tableId);
                
                tableRef.get().then((doc) => {
                    // まずはボードデータを取得して保持
                    board = (doc.data() as store.Table).board;

                    // 次にサブコレクションのログを全件取得 (NO順にソートする)
                    return tableRef.collection(StoreName.LOGS).orderBy('no').get();

                }).then((logsDoc) => {
                    // ログをアクションログとチャットログに分けて保持
                    let allLogs = logsDoc.docs.map(x => x.data() as state.LogRecord);
                    actionLogs = allLogs.filter(x => x.type === 'a') as state.ActionLogRecord[];
                    chatLogs = allLogs.filter(x => x.type === 'c') as state.ChatLogRecord[];
                    notifyLogs = allLogs.filter(x => x.type === 'n') as state.NotifyLogRecord[];

                    // ボード情報のセット
                    appActions.setBoard(board);

                    // 領域情報を再更新
                    appActions.updateBoardRegionInfo();

                    // ログ情報のセット
                    appActions.setActionLogs(actionLogs);
                    appActions.setChatLogs(chatLogs);
                    appActions.setNotifyLogs(notifyLogs);

                    // アプリケーション起動まで完了したら、ローダーの表示を隠す
                    $('#LOADER').removeClass('active');

                    // まだ名前が決定していなければ、名前の決定処理
                    // 観戦者かどうかで名前の処理を分ける
                    if (params.side === 'watcher') {
                        // 観戦者の場合
                        utils.userInputModal(`<p>${t('dialog:ふるよにボードシミュレーターへようこそ。あなたは観戦者として卓に参加します。')}</p><p>${t('観戦者名：')}</p>`, ($elem) => {
                            let watcherName = $('#INPUT-MODAL input').val() as string;
                            let sessionId = randomstring.generate({ readable: true, length: 16 });
                            if (watcherName === '') {
                                watcherName = `${t('観戦者')} ${sessionId}`;
                            }

                            // DBに名前を保存
                            db.collection(StoreName.TABLES).doc(params.tableId).collection(StoreName.WATCHERS).doc(sessionId).set({ name: watcherName }).then(function () {
                                // 現在のセッションIDを記憶
                                appActions.setCurrentWatcherSessionId(sessionId);

                                // 観戦者情報に追加
                                let st = appActions.getState();
                                let newWatchers = _.extend({}, st.board.watchers);
                                newWatchers[sessionId] = {name: watcherName};
                                appActions.setWatcherInfo({ watchers: newWatchers });

                                // Firestoreへログを送信
                                let newLogs = appActions.appendActionLog({
                                    text: ['log:観戦者として卓に参加しました', null]
                                }).actionLog;
                                utils.sendLogToFirestore(db, params.tableId, [newLogs[newLogs.length - 1]], params.side);

                                // 画面を閉じたら観戦者情報を削除する
                                $(window).on('beforeunload', function (e) {
                                    db.collection(StoreName.TABLES).doc(params.tableId).collection(StoreName.WATCHERS).doc(sessionId).delete().then(function(){
                                    });
                                    e.preventDefault();
                                    return undefined;
                                });
                            });
                        });

                    } else {
                        // 観戦者でない場合
                        if (board.playerNames[params.side] === null) {
                            let playerCommonName = (params.side === 'p1' ? t('プレイヤー1') : t('プレイヤー2'));
                            utils.userInputModal(`<p>${t('dialog:ふるよにボードシミュレーターへようこそ。あなたはSIDEとして卓に参加します。', { side: playerCommonName })}</p><p>${t('プレイヤー名：')}</p>`, ($elem) => {
                                let playerName = $('#INPUT-MODAL input').val() as string;
                                if (playerName === '') {
                                    playerName = playerCommonName;
                                }
                                appActions.operate({
                                    log: ['log:卓に参加しました', null],
                                    undoType: 'notBack',
                                    proc: () => {
                                        appActions.setPlayerName({ side: params.side as PlayerSide, name: playerName });
                                    }
                                });

                                utils.messageModal(t('dialog:ゲームを始める準備ができたら、まずは「メガミ選択」ボタンをクリックしてください。'));
                            });
                         }
                    }

                    // ここまでの処理が終わったら、変更時イベントを設定
                    // ボードデータ更新時の処理を紐づける
                    sakurabaTablesRef.doc(params.tableId)
                        .onSnapshot(function(doc){
                            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                            console.log(source, "table onSnapshot data: ", doc.data());
                            if (!doc.metadata.hasPendingWrites) {
                                let tableData = doc.data() as store.Table;
                                // 自分以外による変更であれば更新
                                if(tableData.updatedBy !== params.side){
                                    appActions.setBoard(tableData.board);
                                }
                            }
                        });

                    // ログ変更時に追加されたログを取得する処理
                    function getAppendedLogs<T extends state.LogRecord>(querySnapshot: firebase.firestore.QuerySnapshot, stateLogs: T[]){
                        // 現在受信済みの最大ログNOを取得
                        let maxLog = _.maxBy(stateLogs, log => log.no);
                        let maxLogNo = (maxLog ? maxLog.no : 0);

                        // どのログが追加されたログかを判定
                        let appendedLogs: T[] = [];
                        querySnapshot.docChanges().forEach(function (change) {
                            if (change.type === "added") {
                                let log = change.doc.data() as T;
                                if (log.no > maxLogNo) {
                                    appendedLogs.push(log);
                                }
                            }
                        });

                        // 追加されたログを返す
                        return appendedLogs;
                    }

                    // 操作ログ更新時の処理を紐づける
                    tableRef.collection(StoreName.LOGS).where('type', '==', 'a').orderBy('no')
                        .onSnapshot(function(querySnapshot){
                            var source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
                            console.log(source, "actionlogs onSnapshot: ");

                            let newState = appActions.getState();
                            let appendedLogs = getAppendedLogs(querySnapshot, newState.actionLog);

                            // 新しいログがあれば
                            if (appendedLogs.length >= 1) {

                                // ログ追加
                                appActions.appendReceivedActionLogs(appendedLogs);

                                // 受け取ったログをtoastrで表示
                                let targetLogs = appendedLogs.filter((log) => utils.logIsVisible(log, newState.side));

                                // ID別にグループ化 (グループのキーは p1 / p2 / 観戦者セッションIDのいずれか)
                                let grouped = _.groupBy(targetLogs, (log: state.ActionLogRecord) => (log.side === 'watcher' ? log.watcherSessionId : log.side));
                                for(let key in grouped){
                                    let logsInGroup = grouped[key];
                                    let isPlayer = (key === 'p1' || key === 'p2');
                                    let name = (isPlayer ? newState.board.playerNames[key] : logsInGroup[0].watcherName);
                                    let msg = logsInGroup.map((log) => utils.translateLog(log.body, newState.setting.language)).join('<br>'); // ログが多言語化に対応していれば、i18nextを通す
                                    toastr.info(msg, `${name}:`);
                                }
                            }
                        });


                    // チャットログ更新時の処理を紐づける
                    tableRef.collection(StoreName.LOGS).where('type', '==', 'c').orderBy('no')
                        .onSnapshot(function (querySnapshot) {
                            var source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
                            console.log(source, "chatlogs onSnapshot: ");

                            let newState = appActions.getState();
                            let appendedLogs = getAppendedLogs(querySnapshot, newState.chatLog);

                            // 新しいログがあれば
                            if (appendedLogs.length >= 1) {

                                // ログ追加
                                appActions.appendReceivedChatLogs(appendedLogs);

                                // 受け取ったログをtoastrで表示
                                let targetLogs = appendedLogs.filter((log) => utils.logIsVisible(log, newState.side));
                                // ID別にグループ化 (グループのキーは p1 / p2 / 観戦者セッションIDのいずれか)
                                let grouped = _.groupBy(targetLogs, (log: state.ChatLogRecord) => (log.side === 'watcher' ? log.watcherSessionId : log.side));
                                for (let key in grouped) {
                                    let logsInGroup = grouped[key];
                                    let isPlayer = (key === 'p1' || key === 'p2');
                                    let name = (isPlayer ? newState.board.playerNames[key] : logsInGroup[0].watcherName);
                                    let msg = logsInGroup.map((log) => log.body).join('<br>');
                                    toastr.success(msg, `${name}:`, { toastClass: 'toast chat' });
                                }
                            }
                        });

                    // 通知ログ更新時の処理を紐づける
                    tableRef.collection(StoreName.LOGS).where('type', '==', 'n').orderBy('no')
                        .onSnapshot(function (querySnapshot) {
                            var source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
                            console.log(source, "notifyLogs onSnapshot: ");

                            let newState = appActions.getState();
                            let appendedLogs = getAppendedLogs(querySnapshot, newState.notifyLog);

                            // 新しいログがあれば
                            if (appendedLogs.length >= 1) {

                                // ログ追加
                                appActions.appendReceivedNotifyLogs(appendedLogs);

                                // 受け取ったログをtoastrで表示
                                let targetLogs = appendedLogs.filter((log) => utils.logIsVisible(log, newState.side));
                                // ID別にグループ化 (グループのキーは p1 / p2のいずれか)
                                let grouped = _.groupBy(targetLogs, (log: state.NotifyLogRecord) => log.side);
                                for (let key in grouped) {
                                    let logsInGroup = grouped[key];
                                    let name = newState.board.playerNames[key];
                                    let msg = logsInGroup.map((log) => log.body).join('<br>');

                                    toastr.info(msg, t('NAMEより通知', { name: name }), {
                                        timeOut: 0
                                        , extendedTimeOut: 0
                                        , tapToDismiss: false
                                        , closeButton: true
                                    });
                                }
                            }
                        });

                    // 観戦者情報更新時の処理を紐づける
                    tableRef.collection(StoreName.WATCHERS)
                        .onSnapshot(function (querySnapshot) {
                            var source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
                            console.log(source, "watchers onSnapshot: ", querySnapshot.docs.map(d => [d.id, d.data()]));
                            let st = appActions.getState();

                            // サーバーから受信した場合、情報を更新
                            if(!querySnapshot.metadata.hasPendingWrites){
                                let watcherInfo: { [sessionId: string]: state.WatcherInfo } = {};
                                querySnapshot.docs.forEach(d => {
                                    watcherInfo[d.id] = {name: d.data().name};
                                });

                                // ステートの観戦者情報を更新
                                appActions.setWatcherInfo({ watchers: watcherInfo });
                            }
                        });
                });





                // // ★集計
                // // すべてのカード情報を取得
                // let allCards: [string, CardDataItem][] = [];
                // [currentState.board.cardSet, 'na-s3'].forEach((cardSet: CardSet) => {
                //     for (let key in CARD_DATA[cardSet]) {
                //         allCards.push([key, CARD_DATA[key]]);
                //     }
                //     {
                //         let costSummary: { [key: number]: number } = {};
                //         let costSummaryCardTitles: { [key: number]: string[] } = {};
                //         let targetCards = allCards.filter(([cardId, card]) => card.baseType === 'special' && card.cost !== undefined && /^[0-9]+$/.test(card.cost)) as [string, SpecialCardDataItem][];
                //         targetCards.forEach(([cardId, card]) => {
                //             let intCost = parseInt(card.cost);
                //             if (costSummary[intCost] === undefined) costSummary[intCost] = 0;
                //             if (costSummaryCardTitles[intCost] === undefined) costSummaryCardTitles[intCost] = [];
                //             costSummary[intCost] += 1;
                //             costSummaryCardTitles[intCost].push(card.name);
                //         });

                //         console.log(costSummaryCardTitles);
                //     }
                //     {
                //         let auraDamageSummary: { [key: string]: number } = {};
                //         let auraDamageSummaryCardTitles: { [key: string]: string[] } = {};
                //         let lifeDamageSummary: { [key: string]: number } = {};
                //         let lifeDamageSummaryCardTitles: { [key: string]: string[] } = {};

                //         let targetCards = allCards.filter(([cardId, card]) => card.damage !== undefined && card.megami !== 'yukihi' && /^[0-9-]+\/[0-9-]+$/.test(card.damage));
                //         targetCards.forEach(([cardId, card]) => {
                //             let [auraDamage, lifeDamage] = card.damage.split('/');

                //             if (auraDamageSummary[auraDamage] === undefined) auraDamageSummary[auraDamage] = 0;
                //             if (auraDamageSummaryCardTitles[auraDamage] === undefined) auraDamageSummaryCardTitles[auraDamage] = [];
                //             auraDamageSummary[auraDamage] += 1;
                //             auraDamageSummaryCardTitles[auraDamage].push(card.name);

                //             if (lifeDamageSummary[lifeDamage] === undefined) lifeDamageSummary[lifeDamage] = 0;
                //             if (lifeDamageSummaryCardTitles[lifeDamage] === undefined) lifeDamageSummaryCardTitles[lifeDamage] = [];
                //             lifeDamageSummary[lifeDamage] += 1;
                //             lifeDamageSummaryCardTitles[lifeDamage].push(card.name);
                //         });

                //         console.log(auraDamageSummaryCardTitles);
                //         console.log(lifeDamageSummaryCardTitles);
                //     }
                // });



                // toastrの標準オプションを設定
                toastr.options = {
                    hideDuration: 300
                    , showDuration: 300
                };

                // モーダルでEnterを押下した場合、ボタンを押下したものと扱う
                $('body').keydown(function (e) {
                    if (e.key === 'Enter') {
                        $('.modals.active .positive.button').click();
                    }
                });


                // ここからの処理はドラッグ＆ドロップ関係の処理のため、プレイヤーである場合のみ有効
                if (params.side !== 'watcher') {
                    let userAgent = window.navigator.userAgent.toLowerCase();
                    let isFirefox = userAgent.indexOf('firefox') >= 0;

                    // 前進ボタンの上にカーソルを置いたときの処理
                    $('#BOARD').on('mouseenter', '#FORWARD-BUTTON', function (e) {
                        // 間合いの右端をフォーカス
                        $(`.sakura-token[data-region=distance][data-dragging-count=1]`).addClass('focused');
                        // 自オーラ領域をハイライト
                        $(`.area.background[data-side=${params.side}][data-region=aura]`).addClass('over');
                    });
                    // 離脱ボタンの上にカーソルを置いたときの処理
                    $('#BOARD').on('mouseenter', '#LEAVE-BUTTON', function (e) {
                        // ダストの右端をフォーカス
                        $(`.sakura-token[data-region=dust][data-dragging-count=1]`).addClass('focused');
                        // 間合い領域をハイライト
                        $(`.area.background[data-region=distance]`).addClass('over');
                    });
                    // 後退ボタンの上にカーソルを置いたときの処理
                    $('#BOARD').on('mouseenter', '#BACK-BUTTON', function (e) {
                        // 自オーラの右端をフォーカス
                        $(`.sakura-token[data-side=${params.side}][data-region=aura][data-dragging-count=1]`).addClass('focused');
                        // 間合い領域をハイライト
                        $(`.area.background[data-region=distance]`).addClass('over');
                    });
                    // 纏いボタンの上にカーソルを置いたときの処理
                    $('#BOARD').on('mouseenter', '#WEAR-BUTTON', function (e) {
                        // ダストの右端をフォーカス
                        $(`.sakura-token[data-region=dust][data-dragging-count=1]`).addClass('focused');
                        // 自オーラ領域をハイライト
                        $(`.area.background[data-side=${params.side}][data-region=aura]`).addClass('over');
                    });
                    // 宿しボタンの上にカーソルを置いたときの処理
                    $('#BOARD').on('mouseenter', '#CHARGE-BUTTON', function (e) {
                        // 自オーラの右端をフォーカス
                        $(`.sakura-token[data-side=${params.side}][data-region=aura][data-dragging-count=1]`).addClass('focused');
                        // 自フレア領域をハイライト
                        $(`.area.background[data-side=${params.side}][data-region=flair]`).addClass('over');
                    });
                    // 全付与札の桜花結晶-1ボタンの上にカーソルを置いたときの処理
                    $('#BOARD').on('mouseenter', '#ALL-ENHANCE-DECREASE-BUTTON', function (e) {
                        // カード上桜花結晶の右端をフォーカス
                        $(`.sakura-token[data-region=on-card][data-dragging-count=1][data-on-enhance]`).addClass('focused');
                        // ダスト領域をハイライト
                        $(`.area.background[data-region=dust]`).addClass('over');
                    });

                    $('#BOARD').on('mouseleave', '#FORWARD-BUTTON, #BACK-BUTTON, #CHARGE-BUTTON, #LEAVE-BUTTON, #WEAR-BUTTON, #ALL-ENHANCE-DECREASE-BUTTON', function (e) {
                        $(`.sakura-token`).removeClass('focused');
                        $(`.area.background`).removeClass('over');
                    });

                    // 桜花結晶の上にカーソルを置いたときの処理
                    $('#BOARD').on('mouseenter', '.sakura-token', function (e) {
                        // 自分と同じ領域/グループで、dragCountが自分以下の要素をすべて選択扱いにする
                        let $this = $(this);
                        let side = $this.attr('data-side') as (PlayerSide | 'none');
                        let index = parseInt($this.attr('data-region-index'));
                        let group = $this.attr('data-group') as state.SakuraTokenGroup;
                        let draggingCount = parseInt($this.attr('data-dragging-count'));
                        if (draggingCount === 0) return false; // draggingCount=0はドラッグ非対象

                        let $tokens = $(`.sakura-token[data-side=${side}][data-region=${$this.attr('data-region')}][data-group=${group}][data-linked-card-id=${$this.attr('data-linked-card-id')}]`);
                        $tokens.filter((i, elem) => parseInt(elem.dataset.draggingCount) <= draggingCount).addClass('focused');
                        return true;
                    });
                    $('#BOARD').on('mouseleave', '.sakura-token', function (e) {
                        $(`.sakura-token`).removeClass('focused');
                    });

                    // ドラッグ開始
                    $('#BOARD').on('dragstart', '.fbs-card,.sakura-token', function (e) {
                        let currentState = appActions.getState();
                        if (currentState.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は実行不可能な操作

                        if (!currentState.board.mariganFlags[params.side]) {
                            utils.messageModal(t('dialog:決闘を開始するまでは、カードや桜花結晶の移動は行えません。'));
                            return false;
                        };

                        //(e.originalEvent as DragEvent).dataTransfer.setDragImage($(this.closest('.draw-region'))[0], 0, 0);
                        let objectId = $(this).attr('data-object-id');
                        let object = currentState.board.objects.find(c => c.id === objectId);

                        // カードの場合
                        if (object.type === 'card') {
                            // 封印されたカードのドラッグ移動はできない
                            if (object.region === 'on-card') {
                                utils.messageModal(t('dialog:封印されたカードを移動することはできません。右クリックより捨て札に送ってください。'));
                                return false;
                            }

                            // 桜花結晶が乗ったカードも移動できない
                            let boardModel = new models.Board(currentState.board);
                            let tokensOnCard = boardModel.getRegionSakuraTokens(currentState.side, 'on-card', object.id);
                            if (tokensOnCard.length >= 1) {
                                utils.messageModal(t('dialog:桜花結晶が乗ったカードを移動することはできません。'));
                                return false;
                            }

                            let $this = $(this);
                            let linkedCardId = $this.attr('data-linked-card-id');
                            this.style.opacity = '0.4';  // this / e.target is the source node.

                            let cardData = CARD_DATA[currentState.board.cardSet][object.cardId];

                            // 現在のエリアに応じて、選択可能なエリアを前面に移動し、選択したカードを記憶
                            // (同じ領域への移動、もしくは自分に自分を封印するような処理は行えない)
                            if (cardData.baseType === 'special') {
                                // 切札であれば、切札領域と追加札領域に移動可能
                                $(`.area.card-region.droppable[data-region=special]:not([data-side=${object.side}][data-region=${object.region}]), .area.card-region.droppable[data-region=extra]:not([data-side=${object.side}][data-region=${object.region}])`).css('z-index', ZIndex.HOVER_DROPPABLE);
                                dragInfo.draggingFrom = object;
                            } else if (cardData.baseType === 'transform') {
                                // Transformカードであれば、使用済領域と追加札領域に移動可能
                                $(`.area.card-region.droppable[data-region=used]:not([data-side=${object.side}][data-region=${object.region}]), .area.card-region.droppable[data-region=extra]:not([data-side=${object.side}][data-region=${object.region}])`).css('z-index', ZIndex.HOVER_DROPPABLE);
                                dragInfo.draggingFrom = object;
                            } else {
                                // 切札以外であれば、切札を除く他領域に移動可能
                                $(`.area.card-region.droppable:not([data-side=${object.side}][data-region=${object.region}][data-linked-card-id=${linkedCardId}]):not([data-region=special]):not([data-region=on-card][data-linked-card-id=${object.id}])`).css('z-index', ZIndex.HOVER_DROPPABLE);
                                dragInfo.draggingFrom = object;
                            }

                            // ポップアップを非表示にする
                            $('.fbs-card').popup('hide all');
                        }

                        // 桜花結晶の場合
                        if (object.type === 'sakura-token') {
                            let $this = $(this);
                            let tokenSide = $this.attr('data-side') as (PlayerSide | 'none');
                            let linkedCardId = $this.attr('data-linked-card-id');
                            let group = $this.attr('data-group') as state.SakuraTokenGroup;
                            let draggingCount = parseInt($this.attr('data-dragging-count'));
                            if (draggingCount === 0) return false; // draggingCount=0はドラッグ非対象

                            // 現在のエリアに応じて、選択可能なエリアを前面に移動し、選択した桜花結晶を記憶
                            let baseSelector = `.area.sakura-token-region.droppable:not([data-side=${tokenSide}][data-region=${object.region}][data-linked-card-id=${linkedCardId}])`;
                            if (object.artificial) {
                                // 造花結晶であれば、今の領域に応じて移動先が決まる
                                if (object.region === 'distance') {
                                    // 間合からの移動の場合は、所有者の燃焼済領域にのみ移動可能
                                    $(`${baseSelector}[data-side=${object.ownerSide}][data-region=burned]`).css('z-index', ZIndex.HOVER_DROPPABLE);
                                } else if (object.region === 'burned') {
                                    // 燃焼済領域からの移動の場合は、所有者のマシン領域にのみ移動可能
                                    $(`${baseSelector}[data-side=${object.ownerSide}][data-region=machine]`).css('z-index', ZIndex.HOVER_DROPPABLE);
                                } else {
                                    // マシン領域からの移動の場合は、所持者の燃焼済、間合のどちらかに移動可能
                                    $(`${baseSelector}[data-side=${object.ownerSide}][data-region=burned],${baseSelector}[data-region=distance]`).css('z-index', ZIndex.HOVER_DROPPABLE);
                                }
                            } else {
                                // 通常の桜花結晶であれば、自身以外の領域のうち、マシンと燃焼済を除く全領域に移動可能
                                $(`${baseSelector}:not([data-region=machine]):not([data-region=burned])`).css('z-index', ZIndex.HOVER_DROPPABLE);
                            }
                            dragInfo.draggingFrom = object;

                            // 移動数を記憶
                            dragInfo.sakuraTokenMoveCount = draggingCount;

                            // 自分と同じ領域/グループで、dragCountが自分以下の要素をすべて選択扱いにする
                            let $tokens = $(`.sakura-token[data-side=${tokenSide}][data-region=${$this.attr('data-region')}][data-group=${group}][data-linked-card-id=${$this.attr('data-linked-card-id')}]`);
                            $tokens.filter((i, elem) => parseInt(elem.dataset.draggingCount) <= draggingCount).css('opacity', '0.4');

                            // ドラッグゴースト画像を設定
                            let ghost: Element;
                            if (object.artificial) {
                                ghost = $(`#artificial-token-ghost-${draggingCount}-${object.ownerSide}${isFirefox ? '-firefox' : ''}`)[0];
                            } else {
                                $(`#sakura-token-ghost-many${isFirefox ? '-firefox' : ''} .dragging-count`).text(draggingCount);
                                ghost = (draggingCount >= 6 ? $(`#sakura-token-ghost-many${isFirefox ? '-firefox' : ''}`)[0] : $(`#sakura-token-ghost-${draggingCount}${isFirefox ? '-firefox' : ''}`)[0]);
                            }
                            (e.originalEvent as DragEvent).dataTransfer.setDragImage(ghost, 0, 0);

                            // 選択状態を解除
                            $(`.sakura-token`).removeClass('focused');

                        }

                        // dataTransferにダミーデータを設定 (FireFoxでは何かをsetDataしないと動かない)
                        (e.originalEvent as DragEvent).dataTransfer.setData('text', '');

                        return true;
                    });

                    $('#BOARD').on('dragend', '.fbs-card,.sakura-token', function (e) {
                        console.log('dragend', this);
                        processOnDragEnd();

                    });
                    $('#BOARD').on('dragover', '.droppable', function (e) {
                        if ($(this).hasClass('over-forbidden')) {
                            ((e.originalEvent as any) as DragEvent).dataTransfer.dropEffect = 'none';  // See the section on the DataTransfer object.
                            return false;
                        }
                        if (e.preventDefault) {
                            e.preventDefault(); // Necessary. Allows us to drop.
                        }

                        return false;
                    });

                    $('#BOARD').on('dragenter', '.area.droppable', function (e) {
                        console.log('dragenter', this);
                        let side = $(this).attr('data-side') as (PlayerSide | 'none');
                        let region = $(this).attr('data-region') as (CardRegion | SakuraTokenRegion);
                        let linkedCardId = $(this).attr('data-linked-card-id');
                        let currentState = appActions.getState();

                        // 毒カードの移動で、かつ移動先が伏せ札の場合は移動不可
                        if (dragInfo.draggingFrom.type === 'card') {
                            let toRegion = region as CardRegion;

                            if (CARD_DATA[currentState.board.cardSet][dragInfo.draggingFrom.cardId].poison && toRegion === 'hidden-used') {
                                $(`.area.droppable[data-side=${side}][data-region=${region}]`).addClass('over-forbidden');
                                $(`.area.background[data-side=${side}][data-region=${region}]`).addClass('over-forbidden');
                                return true;
                            }
                        }

                        // 桜花結晶の移動で、かつ移動先の最大値を超える場合は移動不可
                        // ただし移動対象が造花結晶で、かつ有効な桜花結晶数以下であれば、特例として移動可能 (騎動前進の可能性があるため)
                        if (dragInfo.draggingFrom.type === 'sakura-token') {
                            let token = dragInfo.draggingFrom;

                            let tokenRegion = region as SakuraTokenRegion;
                            let state = appActions.getState();
                            let boardModel = new models.Board(state.board);
                            let tokenCount = 0;
                            let rideForwardEnabled = false;
                            if (tokenRegion === 'distance') {
                                tokenCount = boardModel.getDistance();
                                if (token.artificial) {
                                    let activeSakuraTokens = boardModel.getDistanceSakuraTokens('normal');
                                    if (token.groupTokenDraggingCount <= activeSakuraTokens.length) {
                                        rideForwardEnabled = true;
                                    }
                                }
                            } else {
                                tokenCount = boardModel.getRegionSakuraTokens((side === 'none' ? null : side), tokenRegion, (linkedCardId === 'none' ? null : linkedCardId)).length;
                            }

                            if (tokenCount + dragInfo.sakuraTokenMoveCount > SAKURA_TOKEN_MAX[tokenRegion] && !rideForwardEnabled) {
                                $(`.area.droppable[data-side=${side}][data-region=${region}]`).addClass('over-forbidden');
                                $(`.area.background[data-side=${side}][data-region=${region}]`).addClass('over-forbidden');
                                return true;
                            }
                        }

                        if (region === 'on-card') {
                            console.log(`overcard ${linkedCardId}`);
                            $(`.fbs-card[data-object-id=${linkedCardId}]`).addClass('over');
                        } else {
                            $(`.area.background[data-side=${side}][data-region=${region}]`).addClass('over');
                        }
                        return true;
                    });

                    $('#BOARD').on('dragleave', '.area.droppable', function (e) {
                        console.log('dragleave', this);
                        let side = $(this).attr('data-side') as (PlayerSide | 'none');
                        let region = $(this).attr('data-region') as (CardRegion | SakuraTokenRegion);
                        let linkedCardId = $(this).attr('data-linked-card-id');

                        if (region === 'on-card') {
                            $(`.fbs-card[data-object-id=${linkedCardId}]`).removeClass('over').removeClass('over-forbidden');
                        } else {
                            $(`.area.background[data-side=${side}][data-region=${region}]`).removeClass('over').removeClass('over-forbidden');
                        }
                        $(`.area.droppable[data-side=${side}][data-region=${region}]`).removeClass('over').removeClass('over-forbidden');
                    });

                    let lastDraggingFrom: state.BoardObject = null;
                    $('#BOARD').on('drop', '.area', function (e) {
                        // this / e.target is current target element.
                        let $this = $(this);

                        // ドラッグ禁止状態の場合は処理しない
                        if ($(this).hasClass('over-forbidden')) {
                            return false;
                        }

                        // 現在のステートを取得
                        let currentState = appActions.getState();
                        let boardModel = new models.Board(currentState.board);

                        // 観戦者はドラッグできない
                        if (currentState.side === 'watcher') return false;

                        if (e.stopPropagation) {
                            e.stopPropagation(); // stops the browser from redirecting.
                        }

                        if (dragInfo.draggingFrom !== null) {

                            // カードを別領域に移動した場合
                            if (dragInfo.draggingFrom.type === 'card') {
                                let card = dragInfo.draggingFrom;
                                let toSide = $this.attr('data-side') as PlayerSide;
                                let toRegion = $this.attr('data-region') as CardRegion;
                                let toLinkedCardIdValue = $this.attr('data-linked-card-id');
                                let toLinkedCardId = (toLinkedCardIdValue === 'none' ? null : toLinkedCardIdValue);

                                // 他のカードを封印しているカードを、動かそうとした場合はエラー
                                let sealedCards = boardModel.getSealedCards(card.id);
                                if (sealedCards.length >= 1) {
                                    utils.messageModal(t("dialog:他のカードが封印されているため移動できません。封印されたカードを右クリックして、捨て札に送ってください。"));
                                    return false;
                                }
                                // 桜花結晶が乗っている札を、動かそうとした場合はエラー
                                let onCardTokens = boardModel.getRegionSakuraTokens(card.side, 'on-card', card.id);
                                if (onCardTokens.length >= 1) {
                                    utils.messageModal(t("dialog:桜花結晶が上に乗っているため移動できません。"));
                                    return false;
                                }

                                // 山札に移動し、かつ山札が1枚以上ある場合は特殊処理
                                if (toRegion === 'library' && boardModel.getRegionCards(toSide, toRegion, toLinkedCardId).length >= 1) {
                                    contextMenuShowingAfterDrop = true;
                                    dragInfo.lastDraggingCardBeforeContextMenu = card;
                            dragInfo.lastDragToSideBeforeContextMenu = toSide;
                                    $('#CONTEXT-DRAG-TO-LIBRARY').contextMenu({ x: e.pageX, y: e.pageY });
                                    return false;
                                } else {
                                    moveCardMain(card, toSide, toRegion, toLinkedCardId);
                                }
                            }

                            // 桜花結晶を別領域に移動した場合
                            if (dragInfo.draggingFrom.type === 'sakura-token') {
                                let sakuraToken = dragInfo.draggingFrom;

                                let toSideValue = $this.attr('data-side') as (PlayerSide | 'none');
                                let toSide = (toSideValue === 'none' ? null : toSideValue);
                                let toRegion = $this.attr('data-region') as SakuraTokenRegion;
                                let toLinkedCardIdValue = $(this).attr('data-linked-card-id');
                                let toLinkedCardId = (toLinkedCardIdValue === 'none' ? null : toLinkedCardIdValue);
                                let fromLinkedCard = (dragInfo.draggingFrom.linkedCardId === null ? undefined : boardModel.getCard(dragInfo.draggingFrom.linkedCardId));
                                let toLinkedCard = (toLinkedCardId === null ? undefined : boardModel.getCard(toLinkedCardId));

                                let logs: { text?: LogValue, body?: state.ActionLogBody, visibility?: LogVisibility }[] = [];
                                let fromRegionTitleLogBody = utils.getSakuraTokenRegionTitleLog(currentState.side, sakuraToken.side, sakuraToken.region, currentState.board.cardSet, fromLinkedCard);
                                let toRegionTitleLogBody = utils.getSakuraTokenRegionTitleLog(currentState.side, toSide, toRegion, currentState.board.cardSet, toLinkedCard);

                                // 間合に造花結晶を移動した場合は特殊処理 (騎動メニュー)
                                if (toRegion === 'distance' && sakuraToken.artificial) {
                                    contextMenuShowingAfterDrop = true;
                                    dragInfo.lastDraggingSakuraTokenBeforeContextMenu = sakuraToken;
                                    $('#CONTEXT-DRAG-ARTIFICIAL-TOKEN-TO-DISTANCE').contextMenu({ x: e.pageX, y: e.pageY });
                                    return false;
                                } else {
                                    // ログ内容を決定
                                    let tokenName: string = (sakuraToken.artificial ? t('造花結晶') : t('桜花結晶'));
                                    let isOpponent = sakuraToken.ownerSide && currentState.side !== sakuraToken.ownerSide;
                                    let log: state.ActionLogBody = {
                                          type: 'ls'
                                        , key: (isOpponent ? 'log:相手のTOKENをNつ移動しました：FROM → TO' : 'log:TOKENをNつ移動しました：FROM → TO')
                                        , params: { count: dragInfo.sakuraTokenMoveCount, from: fromRegionTitleLogBody, to: toRegionTitleLogBody, token: tokenName }
                                    };


                                    // 一部の移動ではログを変更
                                    if (sakuraToken.region === 'machine' && toRegion === 'burned') {
                                        log = {
                                            type: 'ls'
                                            , key: (isOpponent ? 'log:相手のマシンの造花結晶をNつ燃焼済にしました' : 'log:マシンの造花結晶をNつ燃焼済にしました')
                                            , params: { count: dragInfo.sakuraTokenMoveCount, token: tokenName }
                                        };
                                    }
                                    if (sakuraToken.region === 'distance' && toRegion === 'burned') {
                                        log = {
                                            type: 'ls'
                                            , key: 'log:間合の造花結晶をNつ燃焼済にしました'
                                            , params: { count: dragInfo.sakuraTokenMoveCount, token: tokenName }
                                        };
                                    }
                                    if (sakuraToken.region === 'burned' && toRegion === 'machine') {
                                        log = {
                                            type: 'ls'
                                            , key: (isOpponent ? 'log:相手の燃焼済の造花結晶をNつ回復しました' : 'log:燃焼済の造花結晶をNつ回復しました')
                                            , params: { count: dragInfo.sakuraTokenMoveCount, token: tokenName }
                                        };
                                    }
                                    logs.push({ body: log });

                                    appActions.operate({
                                        logParams: logs,
                                        proc: () => {
                                            appActions.moveSakuraToken({
                                                from: [sakuraToken.side, sakuraToken.region, sakuraToken.linkedCardId]
                                                , fromGroup: sakuraToken.group
                                                , to: [toSide, toRegion, toLinkedCardId]
                                                , moveNumber: dragInfo.sakuraTokenMoveCount
                                            });
                                        }
                                    });
                                }
                            }

                        }

                        return false;
                    });

                    // ドラッグゴースト画像を1秒後に表示
                    setTimeout(function () {
                        $('.drag-ghost').show();
                    }, 1000);
                }
            });


    } catch (ex) {
        console.error(ex);
        alert(t("システムエラーが発生しました。"));
        $.ajax({
            url: '/.error-send'
            , type: 'post'
            , contentType: 'application/json'
            , data: JSON.stringify({ error: ex.message, stack: ex.stack })
        });
    }
});