import { h, app, Children } from "hyperapp";
import { ActionsType } from "../actions";
import * as sakuraba from "sakuraba";
import * as utils from "sakuraba/utils";
import * as css from "./ControlPanel.css"
import * as models from "sakuraba/models";
import { Card, ProcessButton } from "sakuraba/apps/common/components";
import * as apps from "sakuraba/apps";
import { t } from "i18next";
import i18next = require("i18next");

// メガミ選択ダイアログでのボタン表示更新
function updateMegamiSelectModalView() {
    let megami1 = $('#MEGAMI1-SELECTION').val() as string;
    let megami2 = $('#MEGAMI2-SELECTION').val() as string;

    if (megami1 !== '' && megami2 !== '') {
        $('#MEGAMI-SELECT-MODAL .positive.button').removeClass('disabled');
    } else {
        $('#MEGAMI-SELECT-MODAL .positive.button').addClass('disabled');
    }
}

/** 処理を進めるためのボタンを表示 */
export const MainProcessButtons = (p: {left: number}) => (state: state.State, actions: ActionsType) => {
    if(state.side === 'watcher') return null; // 観戦者は表示しない
    let side = state.side;

    /** メガミ選択処理 */
    let megamiSelect = function(){
        if(state.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は実行不可能な操作
        let side = state.side;

        if(state.setting.cardImageEnabledTestEn){
            new Promise<sakuraba.Megami[]>((resolve, reject) => {
                let st = apps.megamiSelectModal.State.create(
                      state.board.cardSet
                    , side
                    , state.zoom
                    , state.setting
                    , resolve
                    , reject
                );
                apps.megamiSelectModal.run(st, document.getElementById('COMMON-MODAL-PLACEHOLDER'));
            }).then((selectedMegamis) => {
            });

            
        } else {
            // ドロップダウンの選択肢を設定
            $('#MEGAMI1-SELECTION').empty().append('<option></option>');
            $('#MEGAMI2-SELECTION').empty().append('<option></option>');
            for (let megami of utils.getMegamiKeys(state.board.cardSet)) {
                $('#MEGAMI1-SELECTION').append(`<option value='${megami}'>${utils.getMegamiDispNameWithSymbol(state.setting.language.uniqueName, megami)}</option>`);
                $('#MEGAMI2-SELECTION').append(`<option value='${megami}'>${utils.getMegamiDispNameWithSymbol(state.setting.language.uniqueName, megami)}</option>`);
            }

            $.fn.form.settings.rules.originalMegamiEqual = function (value) {
                let megami1 = $('#MEGAMI1-SELECTION').val() as sakuraba.Megami;
                let megami2 = $('#MEGAMI2-SELECTION').val() as sakuraba.Megami;
                let megami1Base = (sakuraba.MEGAMI_DATA[megami1].base || megami1);
                let megami2Base = (sakuraba.MEGAMI_DATA[megami2].base || megami2);

                return megami1Base !== megami2Base;
            };
            let megami2Rule: SemanticUI.Form.Field = {
                identifier: 'megami2'
                , rules: [
                    { type: 'originalMegamiEqual', prompt: t('同じメガミを選択することはできません。') }
                ]
            };
            $('#MEGAMI-SELECT-MODAL .ui.form').form({
                fields: {
                    megami2: megami2Rule
                }
            });
            $('#MEGAMI-SELECT-MODAL').modal({
                closable: false, autofocus: false, onShow: function () {
                    let megamis = state.board.megamis[state.side];

                    // メガミが選択済みであれば、あらかじめドロップダウンに設定しておく
                    if (megamis !== null && megamis.length >= 1) {
                        $('#MEGAMI1-SELECTION').val(megamis[0]);
                        $('#MEGAMI2-SELECTION').val(megamis[1]);
                    }
                    updateMegamiSelectModalView(); // 表示を更新

                }, onApprove: function () {
                    if (!$('#MEGAMI-SELECT-MODAL .ui.form').form('validate form')) {
                        return false;
                    }

                    // 選択したメガミを設定
                    let megamis = [$('#MEGAMI1-SELECTION').val() as sakuraba.Megami, $('#MEGAMI2-SELECTION').val() as sakuraba.Megami];

                    actions.operate({
                        log: ['log:メガミを選択しました', null],
                        proc: () => {
                            //actions.appendActionLog({text: `-> ${utils.getMegamiDispName(megamis[0])}、${utils.getMegamiDispName(megamis[1])}`, hidden: true});
                            actions.setMegamis({ side: side, megami1: megamis[0], megami2: megamis[1] });
                        }
                    });

                    return undefined;
                }
            }).modal('show');

            $('#MEGAMI1-SELECTION, #MEGAMI2-SELECTION').on('change', function (e) {
                updateMegamiSelectModalView();
            });
        }


    }

    /** デッキ構築処理 */
    let boardModel = new models.Board(state.board);
    let deckBuild = () => {
        if(state.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は実行不可能な操作
        let side = state.side;

        let initialState = {
            shown: true,
            selectedCardIds: boardModel.getSideCards(state.side).filter(c => c.cardId).map(c => c.cardId),
        };

        // モーダル表示処理
        let promise = new Promise(function(resolve, reject){
            let cardIds: string[][] = [[], [], []];

            // 1柱目の通常札 → 2柱目の通常札 → 1柱目の切札＋2柱目の切札 順に設定
            cardIds[0] = utils.getMegamiCardIds(state.board.megamis[state.side][0], state.board.cardSet, 'normal');
            cardIds[1] = utils.getMegamiCardIds(state.board.megamis[state.side][1], state.board.cardSet, 'normal');
            cardIds[2] = utils.getMegamiCardIds(state.board.megamis[state.side][0], state.board.cardSet, 'special');
            cardIds[2] = cardIds[2].concat(utils.getMegamiCardIds(state.board.megamis[state.side][1], state.board.cardSet, 'special'));


            // デッキ構築エリアをセット
            let actDefinitions = {
                hide: () => {
                    return {shown: false};
                },
                selectCard: (cardId: string) => (state: typeof initialState) => {
                    let newSelectedCardIds = state.selectedCardIds.concat([]);

                    if(newSelectedCardIds.indexOf(cardId) >= 0){
                        // 選択OFF
                        newSelectedCardIds.splice(newSelectedCardIds.indexOf(cardId), 1);
                    } else {
                        // 選択ON
                        newSelectedCardIds.push(cardId)
                    }

                    return {selectedCardIds: newSelectedCardIds};
                },
            };
            let view = (deckBuildState: typeof initialState, actions: typeof actDefinitions) => {
                if(!deckBuildState.shown) return null;

                let cardElements: JSX.Element[] = [];
                cardIds.forEach((cardIdsInRow, r) => {
                    cardIdsInRow.forEach((cardId, c) => {
                        let card = utils.createCard(`deck-${cardId}`, cardId, null, side);
                        card.openState = 'opened';
                        let top = 4 + r * (160 + 8);
                        let left = 4 + c * (100 + 8);
                        let selected = deckBuildState.selectedCardIds.indexOf(cardId) >= 0;
                        
                        cardElements.push(<Card clickableClass target={card} cardData={boardModel.getCardData(card, state.setting.language, state.setting.cardImageEnabledTestEn)} opened descriptionViewable left={left} top={top} selected={selected} onclick={() => actions.selectCard(cardId)} zoom={state.zoom}></Card>);
                    });
                });

                let normalCardCount = deckBuildState.selectedCardIds.filter(cardId => sakuraba.CARD_DATA[state.board.cardSet][cardId].baseType === 'normal').length;
                let specialCardCount = deckBuildState.selectedCardIds.filter(cardId => sakuraba.CARD_DATA[state.board.cardSet][cardId].baseType === 'special').length;

                let normalColor = (normalCardCount > 7 ? 'red' : (normalCardCount < 7 ? 'blue' : 'black'));
                let normalCardCountStyles: Partial<CSSStyleDeclaration> = {color: normalColor, fontWeight: (normalColor === 'black' ? 'normal' : 'bold')};
                let specialColor = (specialCardCount > 3 ? 'red' : (specialCardCount < 3 ? 'blue' : 'black'));
                let specialCardCountStyles: Partial<CSSStyleDeclaration> = {color: specialColor, fontWeight: (specialColor === 'black' ? 'normal' : 'bold')};

                let okButtonClass = "ui positive labeled icon button";
                if(normalCardCount !== 7 || specialCardCount !== 3) okButtonClass += " disabled";

                return(
                    <div class={"ui dimmer modals page visible active " + css.modalTop}>
                        <div class="ui modal visible active">
                            <div class="content">
                                <div class="description" style={{marginBottom: '2em'}}>
                                    <p>{utils.nl2brJsx(t('dialog:使用するカードを選択してください。'))}</p>
                                </div>
                                <div class={css.outer}>
                                    <div class={css.cardArea} id="DECK-BUILD-CARD-AREA">
                                        {cardElements}
                                    </div>
                                </div>
                                <div class={css.countCaption}>{t('通常札')}: <span style={normalCardCountStyles}>{normalCardCount}</span>/7　　{t('切札')}: <span style={specialCardCountStyles}>{specialCardCount}</span>/3</div>
                            </div>
                            <div class="actions">
                                <div class={okButtonClass} onclick={() => {actions.hide(); resolve(deckBuildState)}}>
                                    {t('決定')} <i class="checkmark icon"></i>
                                </div>
                                <div class="ui black deny button" onclick={() => {actions.hide(); reject()}}>
                                {t('キャンセル')}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }   
            app(initialState, actDefinitions, view, document.getElementById('DECK-BUILD-MODAL'));
        });

        // モーダル終了後の処理
        promise.then((finalState: typeof initialState) => {
            // 確定した場合、デッキを保存
            actions.operate({
                log: ['log:デッキを構築しました', null],
                proc: () => {
                    actions.setDeckCards({cardIds: finalState.selectedCardIds});
                }
            });
        }).catch((reason) => {
            
        });
    }

    let megamiOpen = () => {
        if(state.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は実行不可能な操作
        let side = state.side;

        let megamiNameLogBody: state.ActionLogBody = [
            {
                type: 'ls'
                , key: 'メガミ名-MEGAMI1、MEGAMI2'
                , params: {
                    megami1: { type: 'mn', megami: board.megamis[state.side][0] }
                    , megami2: { type: 'mn', megami: board.megamis[state.side][1] }
                }
            }
        ];

        utils.confirmModal(t('dialog:選択したメガミ2柱を公開します。この操作を行うと、それ以降メガミの変更は行えません。よろしいですか？'), () => {
            actions.operate({
                log: ['log:選択したメガミを公開しました', null],
                undoType: 'notBack',
                proc: () => {
                    actions.appendActionLog({ indent: true, body: megamiNameLogBody});
                    actions.setMegamiOpenFlag({side: side, value: true});
                }
            });
        });
    };
    let firstHandSet = () => {
        utils.confirmModal(t('dialog:手札を引くと、それ以降デッキの変更は行えません。よろしいですか？'), () => {
            actions.oprFirstDraw();
        });
    };

    let board = state.board;
    let deckBuilded = (boardModel.getSideCards(state.side).length >= 1);

    // コマンドボタンの決定
    let processButtons: Children = null;
    let top1 = 500;
    let top2 = 600;

    // プレイヤーである場合の処理
    if(state.board.mariganFlags[state.side]){
        // 手札の引き直しをするかどうかを確定した後は表示しない
    } else if(state.board.firstDrawFlags[state.side]){
        // 最初の手札を引いた後

        const marigan = () => {
            // マリガンダイアログを起動
            let board = new models.Board(state.board);
            
            new Promise<state.Card[]>((resolve, reject) => {
                let cards = board.getRegionCards(side, 'hand', null);
                let st = apps.mariganModal.State.create(state.board.cardSet, side, cards, state.zoom, state.setting, resolve, reject);
                apps.mariganModal.run(st, document.getElementById('COMMON-MODAL-PLACEHOLDER'));            
            }).then((selectedCards) => {
                // 一部のカードを山札の底に戻し、同じ枚数だけカードを引き直す
                actions.operate({
                    undoType: 'notBack',
                    log: ['log:手札N枚を山札の底に置き、同じ枚数のカードを引き直しました', {count: selectedCards.length}],
                    proc: () => {
                        // 選択したカードを山札の底に移動
                        selectedCards.forEach(card => {
                            actions.moveCard({from: card.id, to: [side, 'library', null], toPosition: 'first', cardNameLogging: true, cardNameLogTitleKey: 'log:CardNamePrefix-山札へ戻す'});
                        });

                        // 手札n枚を引く
                        actions.draw({number: selectedCards.length});
            
                        // マリガンフラグON
                        actions.setMariganFlag({side: side, value: true});

                        // 盤面をセットアップ
                        actions.oprBoardSetup();
                    }
                })

                utils.messageModal(t("dialog:桜花決闘を開始しました。場のカードや桜花結晶を移動したい場合は、マウスでドラッグ操作を行ってください。"));
            });
        };

        const notMarigan = () => {
            utils.confirmModal(t("dialog:手札の引き直しを行わずに、決闘を開始します。よろしいですか？"), () => {
                // マリガンフラグON
                actions.setMariganFlag({side: side, value: true});

                // 盤面のカードや桜花結晶などを配置して、メッセージを表示
                actions.oprBoardSetup({});
                utils.messageModal(t("dialog:桜花決闘を開始しました。場のカードや桜花結晶を移動したい場合は、マウスでドラッグ操作を行ってください。"));

            });

        }

        processButtons = (
            <div>
                <ProcessButton left={p.left} top={top1} zoom={state.zoom} onclick={marigan} primary>{t('手札を引き直して決闘を開始')}</ProcessButton>
                <ProcessButton left={p.left} top={top2} zoom={state.zoom} onclick={notMarigan}>{t('決闘を開始')}</ProcessButton>
            </div>
        );
    } else if(state.board.megamiOpenFlags[state.side]){
        // 選択したメガミを公開済みの場合
        processButtons = (
            <div>
                <ProcessButton left={p.left} top={top1} zoom={state.zoom} onclick={deckBuild} primary={!deckBuilded}>{t('デッキ構築')}</ProcessButton>
                {deckBuilded ? <ProcessButton left={p.left} top={top2} zoom={state.zoom} onclick={firstHandSet} primary disabled={!deckBuilded}>{t('最初の手札を引く')}</ProcessButton> : null}
            </div>
        );
    } else if(state.board.playerNames[state.side] !== null) {
        // まだメガミを公開済みでなく、プレイヤー名は決定済みである場合
        let megamiSelected = state.board.megamis[state.side] !== null;

        processButtons = (
            <div>
                <ProcessButton left={p.left} top={top1} zoom={state.zoom} onclick={megamiSelect} primary={!megamiSelected}>{t('メガミ選択')}</ProcessButton>
                {megamiSelected ? <ProcessButton left={p.left} top={top2} zoom={state.zoom} onclick={megamiOpen} primary  disabled={!megamiSelected}>{t('選択したメガミを公開')}</ProcessButton> : null}
            </div>
        );
    }
    return processButtons;
}