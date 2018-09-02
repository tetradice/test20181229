import { h, app, Children } from "hyperapp";
import { ActionsType } from "../actions";
import * as sakuraba from "sakuraba";
import * as utils from "sakuraba/utils";
import * as css from "./ControlPanel.css"
import { withLogger } from "@hyperapp/logger"
import { DeckBuildCard } from "../../common/components";
import * as models from "sakuraba/models";
import toastr from "toastr";


// ルール編集メモ

// 第二幕、新幕の選択
// アンドゥ制約（山札を引いた後のUndoは可能か？）
// ライフ無制限
// 原初札あり
// デッキ枚数無制限


/** コントロールパネル */
export const ControlPanel = () => (state: state.State, actions: ActionsType) => {
    let reset = () => {
        utils.confirmModal('卓を初期状態に戻します。（操作ログは初期化されません）<br>この操作は相手プレイヤーに確認を取ってから行ってください。<br><br>よろしいですか？', () => {
            actions.operate({
                log: `ボードリセットを行いました`,
                proc: () => {
                    actions.resetBoard();
                }
            });
        })
    }

    let playerNameChange = () => {
        $('#INPUT-MODAL input').val(state.board.playerNames[state.side]);
        utils.userInputModal(`<p>新しいプレイヤー名を入力してください。</p>`, ($elem) => {
            let playerName = $('#INPUT-MODAL input').val() as string;
            actions.operate({
                log: `プレイヤー名を変更しました`,
                proc: () => {
                    actions.setPlayerName({side: state.side, name: playerName});
                }
            });
        });
    }

    /** ポップアップ初期化 */
    function setPopup(){
        // ポップアップ初期化
        $('[data-html],[data-content]').popup({
            delay: {show: 500, hide: 0},
            onShow: function(): false | void{
                //if(draggingFrom !== null) return false;
            },
        });
    }

    /** メガミ選択処理 */
    let megamiSelect = function(){
        // メガミ選択ダイアログでのボタン表示更新
        function updateMegamiSelectModalView(){
            let megami1 = $('#MEGAMI1-SELECTION').val() as string;
            let megami2 = $('#MEGAMI2-SELECTION').val() as string;

            if(megami1 !== '' && megami2 !== ''){
                $('#MEGAMI-SELECT-MODAL .positive.button').removeClass('disabled');
            } else {
                $('#MEGAMI-SELECT-MODAL .positive.button').addClass('disabled');
            }
        }
        
        // ドロップダウンの選択肢を設定
        $('#MEGAMI1-SELECTION').empty().append('<option></option>');
        $('#MEGAMI2-SELECTION').empty().append('<option></option>');
        for(let key in sakuraba.MEGAMI_DATA){
            let data = sakuraba.MEGAMI_DATA[key];
            $('#MEGAMI1-SELECTION').append(`<option value='${key}'>${data.name} (${data.symbol})</option>`);
            $('#MEGAMI2-SELECTION').append(`<option value='${key}'>${data.name} (${data.symbol})</option>`);
        }
    

        let megami2Rule: SemanticUI.Form.Field = {identifier: 'megami2', rules: [{type: 'different[megami1]', prompt: '同じメガミを選択することはできません。'}]};
        $('#MEGAMI-SELECT-MODAL .ui.form').form({
            fields: {
                megami2: megami2Rule
            }
        });
        $('#MEGAMI-SELECT-MODAL').modal({closable: false, autofocus: false, onShow: function(){
            let megamis = state.board.megamis[state.side];

            // メガミが選択済みであれば、あらかじめドロップダウンに設定しておく
            if(megamis !== null && megamis.length >= 1){
                $('#MEGAMI1-SELECTION').val(megamis[0]);
                $('#MEGAMI2-SELECTION').val(megamis[1]);
            }
            
        }, onApprove:function(){
            if(!$('#MEGAMI-SELECT-MODAL .ui.form').form('validate form')){
                return false;
            }
            
            // 選択したメガミを設定
            let megamis = [$('#MEGAMI1-SELECTION').val() as sakuraba.Megami, $('#MEGAMI2-SELECTION').val() as sakuraba.Megami];

            actions.operate({
                log: `メガミを選択しました`,
                proc: () => {
                    //actions.appendActionLog({text: `-> ${utils.getMegamiDispName(megamis[0])}、${utils.getMegamiDispName(megamis[1])}`, hidden: true});
                    actions.setMegamis({side: state.side, megami1: megamis[0], megami2: megamis[1]});
                }
            });

            return undefined;
        }}).modal('show');

        $('#MEGAMI1-SELECTION, #MEGAMI2-SELECTION').on('change', function(e){
            updateMegamiSelectModalView();
        });
    }

    /** デッキ構築処理 */
    let boardModel = new models.Board(state.board);
    let deckBuild = () => {
        let initialState = {
            shown: true,
            selectedCardIds: boardModel.getSideCards(state.side).filter(c => c.cardId).map(c => c.cardId),
        };

        // モーダル表示処理
        let promise = new Promise(function(resolve, reject){
            let cardIds: string[][] = [[], [], []];

            // 1柱目の通常札 → 2柱目の通常札 → すべての切札 順にソート
            for(let key in sakuraba.CARD_DATA){
                let data = sakuraba.CARD_DATA[key];
                if(data.megami === state.board.megamis[state.side][0] && data.baseType === 'normal'){
                    cardIds[0].push(key);
                }
                if(data.megami === state.board.megamis[state.side][1] && data.baseType === 'normal'){
                    cardIds[1].push(key);
                }
                if(state.board.megamis[state.side].indexOf(data.megami) >= 0 && data.baseType === 'special'){
                    cardIds[2].push(key);
                }
            }

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
                        let card = utils.createCard(`deck-${cardId}`, cardId, null, state.side);
                        card.openState = 'opened';
                        let top = 4 + r * (160 + 8);
                        let left = 4 + c * (100 + 8);
                        let selected = deckBuildState.selectedCardIds.indexOf(cardId) >= 0;
                        
                        cardElements.push(<DeckBuildCard target={card} left={left} top={top} selected={selected} onclick={() => actions.selectCard(cardId)} zoom={state.zoom}></DeckBuildCard>);
                    });
                });

                let normalCardCount = deckBuildState.selectedCardIds.filter(cardId => sakuraba.CARD_DATA[cardId].baseType === 'normal').length;
                let specialCardCount = deckBuildState.selectedCardIds.filter(cardId => sakuraba.CARD_DATA[cardId].baseType === 'special').length;

                let normalColor = (normalCardCount > 7 ? 'red' : (normalCardCount < 7 ? 'blue' : 'black'));
                let normalCardCountStyles: Partial<CSSStyleDeclaration> = {color: normalColor, fontWeight: (normalColor === 'black' ? 'normal' : 'bold')};
                let specialColor = (specialCardCount > 3 ? 'red' : (specialCardCount < 3 ? 'blue' : 'black'));
                let specialCardCountStyles: Partial<CSSStyleDeclaration> = {color: specialColor, fontWeight: (specialColor === 'black' ? 'normal' : 'bold')};

                let okButtonClass = "ui positive labeled icon button";
                if(normalCardCount !== 7 || specialCardCount !== 3) okButtonClass += " disabled";

                return(
                    <div class={"ui dimmer modals page visible active " + css.modalTop} oncreate={() => setPopup()}>
                        <div class="ui modal visible active">
                            <div class="content">
                                <div class="description" style={{marginBottom: '2em'}}>
                                    <p>使用するカードを選択してください。</p>
                                </div>
                                <div class={css.outer}>
                                    <div class={css.cardArea} id="DECK-BUILD-CARD-AREA">
                                        {cardElements}
                                    </div>
                                </div>
                                <div class={css.countCaption}>通常札: <span style={normalCardCountStyles}>{normalCardCount}</span>/7　　切札: <span style={specialCardCountStyles}>{specialCardCount}</span>/3</div>
                            </div>
                            <div class="actions">
                                <div class={okButtonClass} onclick={() => {actions.hide(); resolve(deckBuildState)}}>
                                    決定 <i class="checkmark icon"></i>
                                </div>
                                <div class="ui black deny button" onclick={() => {actions.hide(); reject()}}>
                                    キャンセル
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }   
            withLogger(app)(initialState, actDefinitions, view, document.getElementById('DECK-BUILD-MODAL'));
        });

        // モーダル終了後の処理
        promise.then((finalState: typeof initialState) => {
            // 確定した場合、デッキを保存
            actions.operate({
                log: `デッキを構築しました`,
                proc: () => {
                    actions.setDeckCards({cardIds: finalState.selectedCardIds});
                }
            });
        }).catch((reason) => {
            
        });
    }

    let megamiOpen = () => {
        utils.confirmModal('選択したメガミ2柱を公開します。<br><br>この操作を行うと、それ以降メガミの変更は行えません。<br>よろしいですか？', () => {
            actions.operate({
                log: `選択したメガミを公開しました`,
                undoType: 'notBack',
                proc: () => {
                    actions.appendActionLog({text: `-> ${utils.getMegamiDispName(board.megamis[state.side][0])}、${utils.getMegamiDispName(board.megamis[state.side][1])}`});
                    actions.setMegamiOpenFlag({side: state.side, value: true});
                    utils.messageModal("次に、右上の「デッキ構築」ボタンをクリックし、デッキの構築を行ってください。");
                }
            });
        });
    };
    let firstHandSet = () => {
        utils.confirmModal('手札を引くと、それ以降デッキの変更は行えません。<br>よろしいですか？', () => {
            actions.oprBoardSetup({side: state.side});
        });
    };

    let board = state.board;
    let deckBuilded = boardModel.getSideCards(state.side).length >= 1;


    // コマンドボタンの決定
    let commandButtons: Children = null;
    if(state.board.firstDrawFlags[state.side]){
        // 最初の手札を引いたあとの場合
        commandButtons = (
            <div class={css.commandButtons}>
            <div class={css.currentPhase}>- 桜花決闘 -</div>
            </div>
        );
    } else if(state.board.megamiOpenFlags[state.side]){
        // 選択したメガミを公開済みの場合
        commandButtons = (
            <div class={css.commandButtons}>
            <div class={css.currentPhase}>- 眼前構築 -</div>
            <button class={`ui basic button ${deckBuilded ? '' : 'focused-button'}`} onclick={deckBuild}>デッキ構築</button>
            <button class={`ui basic button ${deckBuilded ? 'focused-button' : 'disabled'}`} onclick={firstHandSet}>最初の手札を引く</button>
            </div>
        );
    } else {
        // まだメガミを公開済みでない場合
        let megamiSelected = state.board.megamis[state.side] !== null;
        commandButtons = (
            <div class={css.commandButtons}>
            <div class={css.currentPhase}>- 双掌繚乱 -</div>
            <button class={`ui basic button ${megamiSelected ? '' : 'focused-button'}`} onclick={megamiSelect}>メガミ選択</button>
            <button class={`ui basic button ${megamiSelected ? 'focused-button' : 'disabled'}`} onclick={megamiOpen}>選択したメガミを公開</button>
            </div>
        );
    }

    // メガミ表示の決定
    let megamiCaptionP1 = "";
    let megamiCaptionP2 = "";

    if(board.megamis.p1 !== null){
        if(state.side === 'p1' || board.megamiOpenFlags.p1){
            // プレイヤー1のメガミ名を表示可能な場合 (自分がプレイヤー1である or プレイヤー1のメガミが公開されている)
            megamiCaptionP1 = ` - ${utils.getMegamiDispName(board.megamis.p1[0])}、${utils.getMegamiDispName(board.megamis.p1[1])}`
        } else {
            // プレイヤー1のメガミ名を表示不可能な場合
            megamiCaptionP1 = ` - ？？？、？？？`
        }
    }
    if(board.megamis.p2 !== null){
        if(state.side === 'p2' || board.megamiOpenFlags.p2){
            // プレイヤー2のメガミ名を表示可能な場合 (自分がプレイヤー2である or プレイヤー2のメガミが公開されている)
            megamiCaptionP2 = ` - ${utils.getMegamiDispName(board.megamis.p2[0])}、${utils.getMegamiDispName(board.megamis.p2[1])}`
        } else {
            // プレイヤー2のメガミ名を表示不可能な場合
            megamiCaptionP2 = ` - ？？？、？？？`
        }
    }
   
    let notify = () => {
        let opponentName = state.board.playerNames[utils.flipSide(state.side)];

        let notifyType = $('[name=notifyType]').val();
        if(notifyType === 'ready'){
            state.socket.emit('notify', {boardId: state.boardId, senderSide: state.side, message: `準備できました`});
        }
        if(notifyType === 'turnEnd'){
            state.socket.emit('notify', {boardId: state.boardId, senderSide: state.side, message: `ターンを終了しました`});
        }
        if(notifyType === 'reaction'){
            state.socket.emit('notify', {boardId: state.boardId, senderSide: state.side, message: `対応します`});
        }

        // 送信完了
        toastr.success(`${opponentName}へ通知しました。`, '', {timeOut: 5000});

        // ドロップダウンを元に戻す
        $('[name=notifyType]').closest('.dropdown').dropdown('set selected', '-');
    };

    const dropdownCreate = (e) => {
        $(e).dropdown({action: 'hide'});
    };

    const audioPlay = () => {
        const bgm = new Audio('/audio/sword_dance.mp3');
        bgm.volume = 0.5;
        bgm.loop = true;
        bgm.play();
    };

    return (
        <div id="CONTROL-PANEL">    
            <div class="ui icon basic buttons">
                <button class={`ui button ${state.boardHistoryPast.length === 0 ? 'disabled' : ''}`} onclick={() => actions.undoBoard()}><i class="undo alternate icon"></i></button>
                <button class={`ui button ${state.boardHistoryFuture.length === 0 ? 'disabled' : ''}`}  onclick={() => actions.redoBoard()}><i class="redo alternate icon"></i></button>
            </div>
            <button class="ui basic button dropdown" oncreate={dropdownCreate}>
                メニュー
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" onclick={playerNameChange}>プレイヤー名の変更</div>
                    <div class="item" onclick={reset}>ボードリセット (初期化)</div>
                    <div class="item" onclick={() => actions.toggleActionLogVisible()}>
                        {(state.actionLogVisible ? <i class="check icon"></i> : null)}
                        操作ログを表示
                    </div>
                    <div class="item" onclick={audioPlay}>BGM再生</div>
                    <div class="item">卓情報</div>
                    <div class="divider"></div>
                    <div class="item">このサイトについて (バージョン、著作権情報)</div>
                </div>
            </button><br />

            {commandButtons}



            <table class="ui definition table" style={{ width: '25em' }}>
                <tbody>
                    <tr>
                        <td class="collapsing">プレイヤー1</td>
                        <td>{board.playerNames.p1} {megamiCaptionP1}</td>
                    </tr>
                    <tr>
                        <td>プレイヤー2</td>
                        <td>{board.playerNames.p2} {megamiCaptionP2}</td>
                    </tr>
                    <tr>
                        <td>観戦者</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

<div class="ui sub header">相手プレイヤーへ通知</div>
<div class="ui selection dropdown" oncreate={(e) => $(e).dropdown('set selected', '-')}>

  <input type="hidden" name="notifyType" />
  <i class="dropdown icon"></i>
  <div class="default text"></div>
  <div class="menu">
    <div class="item" data-value="-"></div>
    <div class="item" data-value="ready">準備できました</div>
    <div class="item" data-value="turnEnd">ターンを終了しました</div>
    <div class="item" data-value="reaction">対応します</div>
  </div>
</div>
<button class="ui basic button" onclick={notify}>送信</button>

<div class="ui sub header">ボードサイズ</div>
<div class="ui selection dropdown" oncreate={(e) => $(e).dropdown('set selected', state.zoom * 10)}>

  <input type="hidden" name="boardSize" onchange={(e) => {return actions.setZoom(Number($(e.target).val()) * 0.1)}} />
  <i class="dropdown icon"></i>
  <div class="default text"></div>
  <div class="menu">
    <div class="item" data-value="5">5</div>
    <div class="item" data-value="6">6</div>
    <div class="item" data-value="7">7</div>
    <div class="item" data-value="8">8</div>
    <div class="item" data-value="9">9</div>
    <div class="item" data-value="10">10</div>
    <div class="item" data-value="11">11</div>
    <div class="item" data-value="12">12</div>
  </div>
</div>



        </div>
    );
}