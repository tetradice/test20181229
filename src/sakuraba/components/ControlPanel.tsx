import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as sakuraba from "../../sakuraba";

/** コントロールパネル */
export const ControlPanel = () => (state: state.State, actions: ActionsType) => {
    let reset = () => {
        console.log('clicked');
        actions.resetBoard();
        if(state.socket) state.socket.emit('reset_board', {boardId: state.boardId});
    }

    /** メガミ選択処理 */
    let megamiSelect = () => {

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

            return undefined;
        }}).modal('show');

        $('#MEGAMI1-SELECTION, #MEGAMI2-SELECTION').on('change', function(e){
            updateMegamiSelectModalView();
        });
    }
    let board = state.board;

    return (
        <div id="CONTROL-PANEL">
            <button class="ui basic button" onclick={reset}>★ボードリセット</button><br />

            <button class={`ui basic button`} onclick={megamiSelect}>メガミ選択</button>
            <button class={`ui basic button ${state.board.megamis[state.side] !== null ? '' : 'disabled'}`}>デッキ構築</button>
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