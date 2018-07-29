import { h, app } from "hyperapp";
import { ActionsType } from "../actions";
import * as sakuraba from "../../sakuraba";
import * as utils from "../utils";
import { Card } from "./Card";
import * as css from "./ControlPanel.css"
import { withLogger } from "@hyperapp/logger"

/** コントロールパネル */
export const ControlPanel = () => (state: state.State, actions: ActionsType) => {
    let reset = () => {
        console.log('clicked');
        actions.resetBoard();
        if(state.socket) state.socket.emit('reset_board', {boardId: state.boardId});
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
            actions.setMegamis({side: state.side, megami1: megamis[0], megami2: megamis[1]});
            if(state.socket){
                state.socket.emit('megami_select', {boardId: state.boardId, side: state.side, megamis: megamis});
            }

            return undefined;
        }}).modal('show');

        $('#MEGAMI1-SELECTION, #MEGAMI2-SELECTION').on('change', function(e){
            updateMegamiSelectModalView();
        });
    }

    /** デッキ構築処理 */
    let deckBuild = () => {
        let cards = utils.getCards(state, 'library');
        let initialState = {
            shown: true,
            selectedCardIds: cards.filter(c => c.cardId).map(c => c.cardId),
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
            let view = (state: typeof initialState, actions: typeof actDefinitions) => {
                if(!state.shown) return null;

                let cardElements: JSX.Element[] = [];
                cardIds.forEach((cardIdsInRow, r) => {
                    cardIdsInRow.forEach((cardId, c) => {
                        let card = utils.createCard(`deck-${cardId}`, cardId, null);
                        card.opened = true;
                        let top = 4 + r * (160 + 8);
                        let left = 4 + c * (100 + 8);
                        let selected = state.selectedCardIds.indexOf(cardId) >= 0;
                        
                        cardElements.push(<Card target={card} left={left} top={top} selected={selected} onclick={() => actions.selectCard(cardId)}></Card>);
                    });
                });

                let normalCardCount = state.selectedCardIds.filter(cardId => sakuraba.CARD_DATA[cardId].baseType === 'normal').length;
                let specialCardCount = state.selectedCardIds.filter(cardId => sakuraba.CARD_DATA[cardId].baseType === 'special').length;

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
                                <div class={okButtonClass} onclick={() => {actions.hide(); resolve(state)}}>
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
            // 確定した場合、デッキを保存し、桜花結晶を追加
            actions.setDeckCards({cardIds: finalState.selectedCardIds});
            let newState: state.State = actions.getState();

            // サーバーに送信
            state.socket.emit('deck_build', {boardId: newState.boardId, side: newState.side, addObjects: newState.board.objects});
        }).catch((reason) => {
            
        });
    }

    let handSet = () => {
        utils.confirmModal('手札を引くと、それ以降メガミやデッキの変更は行えなくなります。<br>よろしいですか？', () => {
            actions.moveCard({from: 'library', fromSide: state.side, to: 'hand', toSide: state.side, moveNumber: 3});

            // socket.ioでイベント送信
            let newState: state.State = (actions.getState() as any);
            state.socket.emit('board_object_set', {boardId: state.boardId, side: state.side, objects: newState.board.objects});
        });
    };

    let board = state.board;
    let deckBuilded = utils.getCards(state, 'library').length >= 1;

    return (
        <div id="CONTROL-PANEL">
            <button class="ui basic button" onclick={reset}>★ボードリセット</button><br />

            <button class={`ui basic button`} onclick={megamiSelect}>メガミ選択</button>
            <button class={`ui basic button ${state.board.megamis[state.side] !== null ? '' : 'disabled'}`} onclick={deckBuild}>デッキ構築</button>
            <button class={`ui basic button ${deckBuilded ? '' : 'disabled'}`} onclick={handSet}>最初の手札を引く</button>

            <table class="ui definition table" style={{ width: '25em' }}>
                <tbody>
                    <tr>
                        <td class="collapsing">プレイヤー1</td>
                        <td>{board.playerNames.p1} {(board.megamis.p1 !== null ? `(選択メガミ: ${sakuraba.MEGAMI_DATA[board.megamis.p1[0]].name}、${sakuraba.MEGAMI_DATA[board.megamis.p1[1]].name})` : '')}</td>
                    </tr>
                    <tr>
                        <td>プレイヤー2</td>
                        <td>{board.playerNames.p2}</td>
                    </tr>
                    <tr>
                        <td>観戦者</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

<div class="ui sub header">ボードサイズ</div>
<div class="ui selection dropdown" oncreate={(e) => $(e).dropdown('set selected', '100')}>

  <input type="hidden" name="boardSize" onchange={(e) => {return actions.setZoom(Number($(e.target).val()) * 0.01)}} />
  <i class="dropdown icon"></i>
  <div class="default text"></div>
  <div class="menu">
  <div class="item" data-value="80">80%</div>
    <div class="item" data-value="90">90%</div>
    <div class="item" data-value="100">100%</div>
    <div class="item" data-value="110">110%</div>
    <div class="item" data-value="120">120%</div>
  </div>
</div>

        </div>
    );
}