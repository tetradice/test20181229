import { h, app } from "hyperapp";
import { ActionsType } from "../actions";
import * as sakuraba from "../../sakuraba";
import * as utils from "../utils";
import { Card } from "./Card";
import * as styles from "./ControlPanel.css"
import * as devtools from 'hyperapp-redux-devtools';

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

        // 選択カード数、ボタン等の表示更新
        function updateDeckCounts(){
            let normalCardCount = $('#DECK-BUILD-MODAL .fbs-card.open-normal.selected').length;
            let specialCardCount = $('#DECK-BUILD-MODAL .fbs-card.open-special.selected').length;

            let normalColor = (normalCardCount > 7 ? 'red' : (normalCardCount < 7 ? 'blue' : 'black'));
            $('#DECK-NORMAL-CARD-COUNT').text(normalCardCount).css({color: normalColor, fontWeight: (normalColor === 'black' ? 'normal' : 'bold')});
            let specialColor = (specialCardCount > 3 ? 'red' : (specialCardCount < 3 ? 'blue' : 'black'));
            $('#DECK-SPECIAL-CARD-COUNT').text(specialCardCount).css({color: specialColor, fontWeight: (specialColor === 'black' ? 'normal' : 'bold')});

            if(normalCardCount === 7 && specialCardCount === 3){
                $('#DECK-BUILD-MODAL .positive.button').removeClass('disabled');
            } else {
                $('#DECK-BUILD-MODAL .positive.button').addClass('disabled');
            }
        }

        // デッキ構築モーダル内のカードをクリック
        $('body').on('click', '#DECK-BUILD-MODAL .fbs-card', function(e){
            // 選択切り替え
            $(this).toggleClass('selected');

            // 選択数の表示を更新
            updateDeckCounts();
        });

        // デッキ構築ボタン
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
        let view = () => {
            let cardElements: JSX.Element[] = [];
            cardIds.forEach((cardIdsInRow, r) => {
                cardIdsInRow.forEach((cardId, c) => {
                    
                    let card = utils.createCard(`deck-${cardId}`, cardId, null);
                    card.opened = true;
                    let top = 4 + r * (160 + 8);
                    let left = 4 + c * (100 + 8);
                    
                    cardElements.push(<Card target={card} left={left} top={top}></Card>);
                });
            });
            return(
                <div class="ui modal transition visible active" id="MEGAMI-SELECT-MODAL">
                    <div class="content">
                        <div class="description" style="margin-bottom: 2em;">
                            <p>使用するカードを選択してください。</p>
                        </div>
                        <div class={styles.outer}>
                            <div class={styles.cardArea} id="DECK-BUILD-CARD-AREA">
                                {cardElements}
                            </div>
                        </div>
                        <div class={styles.countCaption}>通常札: <span id="DECK-NORMAL-CARD-COUNT"></span>/7　　切札: <span id="DECK-SPECIAL-CARD-COUNT"></span>/3</div>
                    </div>
                    <div class="actions">
                        <div class="ui positive labeled icon button disabled">
                            決定 <i class="checkmark icon"></i>
                        </div>
                        <div class="ui black deny button">
                            キャンセル
                        </div>
                    </div>
                    </div>
            );
        }   


        
        // すでに選択しているカードは選択済みとする
        // let selectedIds: string[] = [];
        // selectedIds = selectedIds.concat(myBoardSide.library.map(c => c.id));
        // selectedIds = selectedIds.concat(myBoardSide.specials.map(c => c.id));
        // console.log(selectedIds);
        // if(selectedIds.length >= 1){
        //     let selector = selectedIds.map(id => `#DECK-BUILD-CARD-AREA [data-card-id=${id}]`).join(',');
        //     $(selector).addClass('selected');
        // }

        let settings: SemanticUI.ModalSettings = {
            closable: false, autofocus: false,
            onShow: function () {
                // 選択数の表示を更新
                updateDeckCounts();

                // ポップアップの表示をセット
                devtools(app)({}, {}, view, document.getElementById('DECK-BUILD-AREA'));
            },
            onApprove: function () {
                // 選択したカードを自分の山札、切札にセット
                //let normalCards: any = $('#DECK-BUILD-MODAL .fbs-card.open-normal.selected').map((i, elem) => new sakuraba.Card($(elem).attr('data-card-id'))).get();
                //myBoardSide.library = normalCards as sakuraba.Card[];
                //let specialCards: any = $('#DECK-BUILD-MODAL .fbs-card.open-special.selected').map((i, elem) => new sakuraba.Card($(elem).attr('data-card-id'))).get();
                //myBoardSide.specials = specialCards as sakuraba.Card[];
                //console.log(myBoardSide);

                // カードの初期化、配置、ポップアップ設定などを行う
                //updatePhaseState(true);

                // socket.ioでイベント送信
                //state.socket.emit('deck_build', {boardId: params.boardId, side: params.side, library: myBoardSide.library, specials: myBoardSide.specials});
                
            },
            onHide: function () {
                // カード表示をクリア
                $('#DECK-BUILD-CARD-AREA').empty();
            }
        }
        $('#DECK-BUILD-MODAL').modal(settings).modal('show');

    }

    let board = state.board;

    return (
        <div id="CONTROL-PANEL">
            <button class="ui basic button" onclick={reset}>★ボードリセット</button><br />

            <button class={`ui basic button`} onclick={megamiSelect}>メガミ選択</button>
            <button class={`ui basic button ${state.board.megamis[state.side] !== null ? '' : 'disabled'}`} onclick={deckBuild}>デッキ構築</button>
            <button class={`ui basic button ${'disabled'}`}>最初の手札を引く</button>

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
        </div>
    );
}