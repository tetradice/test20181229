import { h } from "hyperapp";
import { ActionsType } from "../actions";
import { Megami } from "../../sakuraba";

/** コントロールパネル */
export const ControlPanel = () => (state: state.State, actions: ActionsType) => {
    let reset = () => {
        console.log('clicked');
        actions.resetBoard();
        if(state.socket) state.socket.emit('reset_board', {boardId: state.boardId});
    }

    let megamiSelect = () => {
        let megami2Rule: SemanticUI.Form.Field = {identifier: 'megami2', rules: [{type: 'different[megami1]', prompt: '同じメガミを選択することはできません。'}]};
        $('#MEGAMI-SELECT-MODAL .ui.form').form({
            fields: {
                megami2: megami2Rule
            }
        });
        $('#MEGAMI-SELECT-MODAL').modal({closable: false, autofocus: false, onShow: function(){
            let megamis = state.board.megamis[state.side];

            // メガミが選択済みであれば、あらかじめドロップダウンに設定しておく
            if(megamis[state.side].length >= 1){
                $('#MEGAMI1-SELECTION').val(megamis[0]);
                $('#MEGAMI2-SELECTION').val(megamis[1]);
            }
            
        }, onApprove:function(){
            if(!$('#MEGAMI-SELECT-MODAL .ui.form').form('validate form')){
                return false;
            }
            

            // 選択したメガミを設定
            let megamis = [$('#MEGAMI1-SELECTION').val() as Megami, $('#MEGAMI2-SELECTION').val() as Megami];

        
            return undefined;
        }}).modal('show');
    }

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
                        <td>{state.board.playerNames.p1}</td>
                    </tr>
                    <tr>
                        <td>プレイヤー2</td>
                        <td>{state.board.playerNames.p2}</td>
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