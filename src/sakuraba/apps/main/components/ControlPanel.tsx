import { h, app, Children } from "hyperapp";
import { ActionsType } from "../actions";
import * as utils from "sakuraba/utils";
import * as css from "./ControlPanel.css"
import * as models from "sakuraba/models";
import toastr from "toastr";


// ルール編集メモ

// 第二幕、新幕の選択
// アンドゥ制約（山札を引いた後のUndoは可能か？）
// ライフ制限解除
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
        if(state.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は実行不可能な操作
        let side = state.side;

        $('#INPUT-MODAL input').val(state.board.playerNames[state.side]);
        utils.userInputModal(`<p>新しいプレイヤー名を入力してください。</p>`, ($elem) => {
            let playerName = $('#INPUT-MODAL input').val() as string;
            actions.operate({
                log: `プレイヤー名を変更しました`,
                proc: () => {
                    actions.setPlayerName({side: side, name: playerName});
                }
            });
        });
    }

    let board = state.board;
    let boardModel = new models.Board(board);
    let deckBuilded = (state.side !== 'watcher' && boardModel.getSideCards(state.side).length >= 1);

    // 基本動作
    let basicAction = (from: [PlayerSide, SakuraTokenRegion, null], to: [PlayerSide, SakuraTokenRegion, null], title: string) => {
        let logs: {text: string, visibility?: LogVisibility}[] = [];
        logs.push({text: `${title}を行いました`});
        
        actions.operate({
            log: logs,
            proc: () => {
                actions.moveSakuraToken({
                  from: from
                , to: to
                , moveNumber: 1
                });
            }
        });
    }

    // コマンドボタンの決定
    let commandButtons: Children = null;

    if(state.side === 'watcher'){
        // 観戦者である場合の処理 (何も表示しない)
    } else {
        // プレイヤーである場合の処理
        if(state.board.firstDrawFlags[state.side]){
            // 最初の手札を引いたあとの場合 (桜花決闘)
            let distanceCount = boardModel.getRegionSakuraTokens(null, 'distance', null).length;
            let dustCount = boardModel.getRegionSakuraTokens(null, 'dust', null).length;
            let myAuraCount = boardModel.getRegionSakuraTokens(state.side, 'aura', null).length;
            let onCardTokenFound = (state.board.objects.find(o => o.type === 'sakura-token' && o.region === 'on-card') ? true : false);
            let side = state.side;

            commandButtons = (
                <div class={css.commandButtons}>
                <div class={css.currentPhase}>- 桜花決闘 -</div>
                <div class="ui basic buttons" style="margin-right: 10px;">
                    <button
                    id="FORWARD-BUTTON"
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${distanceCount >= 1 && myAuraCount < 5 ? '' : 'disabled'}`}
                    onclick={() => basicAction([null, 'distance', null], [side, 'aura', null], '前進')}>前進</button>
                    <button
                    id="LEAVE-BUTTON"
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${dustCount >= 1 && distanceCount < 10 ? '' : 'disabled'}`}
                    onclick={() => basicAction([null, 'dust', null], [null, 'distance', null], '離脱')}>離脱</button>
                </div>
                <div class="ui basic buttons" style="margin-right: 10px;">
                    <button
                    id="BACK-BUTTON" 
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${myAuraCount >= 1 && distanceCount < 10 ? '' : 'disabled'}`}
                    onclick={() => basicAction([side, 'aura', null], [null, 'distance', null], '後退')}>後退</button>
                </div>
                <div class="ui basic buttons" style="margin-right: 10px;">
                    <button
                    id="WEAR-BUTTON" 
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${dustCount >= 1 && myAuraCount < 5 ? '' : 'disabled'}`}
                    onclick={() => basicAction([null, 'dust', null], [side, 'aura', null], '纏い')}>纏い</button>
                </div>
                <div class="ui basic buttons" style="margin-right: 10px;">
                    <button
                    id="CHARGE-BUTTON" 
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${myAuraCount >= 1 ? '' : 'disabled'}`}
                    onclick={() => basicAction([side, 'aura', null], [side, 'flair', null], '宿し')}>宿し</button>
                </div>
                <br />
                <button
                    id="ALL-ENHANCE-DECREASE-BUTTON"
                    class={`ui basic button ${onCardTokenFound ? '' : 'disabled'}`}
                    style="margin-top: 5px;"
                    onclick={() => actions.oprRemoveSakuraTokenfromAllEnhanceCard()}>全付与札の桜花結晶-1</button>

                </div>
            );
        }
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
        if(state.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は実行不可能な操作
        let side = state.side;

        let opponentName = state.board.playerNames[utils.flipSide(state.side)];

        let notifyType = $('[name=notifyType]').val();
        if(notifyType === 'ready'){
            state.socket.emit('notify', {tableId: state.tableId, senderSide: state.side, message: `準備できました`});
        }
        if(notifyType === 'turnEnd'){
            state.socket.emit('notify', {tableId: state.tableId, senderSide: state.side, message: `ターンを終了しました`});
        }
        if(notifyType === 'reaction'){
            state.socket.emit('notify', {tableId: state.tableId, senderSide: state.side, message: `対応します`});
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

    let menu = (
        <button class="ui basic button dropdown" oncreate={dropdownCreate}>
            メニュー
            <i class="dropdown icon"></i>
            <div class="menu">
                {state.side === 'watcher' ? null : <div class="item" onclick={playerNameChange}>プレイヤー名の変更</div>}
                {state.side === 'watcher' ? null : <div class="item" onclick={reset}>ボードリセット (初期化)</div>}
                <div class="item" onclick={() => actions.toggleActionLogVisible()}>
                    {(state.actionLogVisible ? <i class="check icon"></i> : null)}
                    操作ログを表示
                                </div>
                <div class="item" onclick={audioPlay}>BGM再生</div>
                <div class="item">卓情報</div>
                <div class="divider"></div>
                <div class="item">このサイトについて (バージョン、著作権情報)</div>
            </div>
        </button>
    );
    let undoPanel = (
        <div class="ui icon basic buttons">
        <button class={`ui button ${state.boardHistoryPast.length === 0 ? 'disabled' : ''}`} onclick={() => actions.undoBoard()}><i class="undo alternate icon"></i></button>
        <button class={`ui button ${state.boardHistoryFuture.length === 0 ? 'disabled' : ''}`}  onclick={() => actions.redoBoard()}><i class="redo alternate icon"></i></button>
        </div>
    );
    let notifyPanel = (
        <div>
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
        </div>
    );
    // 観戦者の場合元に戻すボタン、通知パネルの表示はなし
    // またメニューも簡易版にする
    if(state.side === 'watcher'){
        notifyPanel = null;
        undoPanel = null;
    }

    return (
        <div id="CONTROL-PANEL" style={{left: `${1340 * state.zoom + 20}px`}}>    
            {undoPanel}&nbsp;
            {menu}<br />

            {commandButtons}



            <table class="ui definition table" style={{ width: '100%', fontSize: 'small' }}>
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

{notifyPanel}

<div class="ui sub header">ボードサイズ</div>
<div class="ui selection dropdown" oncreate={(e) => $(e).dropdown('set selected', state.zoom * 10)}>

  <input type="hidden" name="boardSize" onchange={(e) => {return actions.setZoom(Number($(e.target).val()) * 0.1)}} />
  <i class="dropdown icon"></i>
  <div class="default text"></div>
  <div class="menu">
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