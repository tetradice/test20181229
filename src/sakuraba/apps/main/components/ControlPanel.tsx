import { h, app, Children } from "hyperapp";
import { ActionsType } from "../actions";
import * as utils from "sakuraba/utils";
import * as css from "./ControlPanel.css"
import * as models from "sakuraba/models";
import toastr from "toastr";
import { BOARD_BASE_WIDTH, StoreName } from "sakuraba/const";
import * as apps from "sakuraba/apps"
import i18next, { t } from 'i18next';

/** コントロールパネル */
export const ControlPanel = () => (state: state.State, actions: ActionsType) => {
    let reset = () => {
        utils.confirmModal(t('dialog:卓を初期状態に戻します。（操作ログは初期化されません）この操作は相手プレイヤーに確認を取ってから行ってください。よろしいですか？'), () => {
            actions.operate({
                log: ['log:ボードリセットを行いました', null],
                proc: () => {
                    actions.resetBoard();
                }
            });
        })
    }

    // カードセット変更
    let changeCardSet = () => {
        let currentState = actions.getState();

        let promise = new Promise<CardSet>((resolve, reject) => {
            let modalState = apps.cardSetSelectModal.State.create(
                  currentState.board.cardSet
                , resolve
                , reject
            );

            apps.cardSetSelectModal.run(modalState, document.getElementById('COMMON-MODAL-PLACEHOLDER'));
        }).then((newCardSet) => {
            actions.operate({
                log: ['log:カードセットをCARDSETに変更しました', { cardSet: { type: 'cs', cardSet: newCardSet}}],
                proc: () => {
                    actions.resetBoard({ newCardSet: newCardSet });
                }
            });

        });


    }


    let playerNameChange = () => {
        if(state.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は実行不可能な操作
        let side = state.side;

        $('#INPUT-MODAL input').val(state.board.playerNames[state.side]);
        utils.userInputModal(`<p>${t('dialog:新しいプレイヤー名を入力してください。')}</p>`, ($elem) => {
            let playerName = $('#INPUT-MODAL input').val() as string;
            actions.operate({
                log: ['log:プレイヤー名を変更しました', null],
                proc: () => {
                    actions.setPlayerName({side: side, name: playerName});
                }
            });
        });
    }

    let board = state.board;
    let boardModel = new models.Board(board);
    let deckBuilded = (state.side !== 'watcher' && boardModel.getSideCards(state.side).length >= 1);

    // コマンドボタンの決定
    let commandButtons: Children = null;

    if(state.side === 'watcher'){
        // 観戦者である場合の処理
        commandButtons = (
            <div class={css.commandButtons}>
            <div class={css.currentPhase}>{t('- 観戦 -')}</div>
            </div>
        );
    } else {
        // プレイヤーである場合の処理
        if(state.board.firstDrawFlags[state.side]){
            // 最初の手札を引いたあとの場合 (桜花決闘)
            let basicActionEnableState = boardModel.checkBasicActionEnabled(state.side);
            let onCardTokenFound = (state.board.objects.find(o => o.type === 'sakura-token' && o.region === 'on-card') ? true : false);
            let side = state.side;

            let innerCommandButtons = (
                <div>
                <div class="ui basic buttons" style="margin-right: 10px;">
                    <button
                    id="FORWARD-BUTTON"
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${basicActionEnableState.forward ? '' : 'disabled'}`}
                    onclick={() => actions.oprBasicAction({from: [null, 'distance', null], to: [side, 'aura', null], actionTitleKey: '前進', costType: null})}>{i18next.t('前進')}</button>
                    <button
                    id="LEAVE-BUTTON"
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${basicActionEnableState.leave ? '' : 'disabled'}`}
                    onclick={() => actions.oprBasicAction({from: [null, 'dust', null], to: [null, 'distance', null], actionTitleKey: '離脱', costType: null})}>{i18next.t('離脱')}</button>
                </div>
                <div class="ui basic buttons" style="margin-right: 10px;">
                    <button
                    id="BACK-BUTTON" 
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${basicActionEnableState.back ? '' : 'disabled'}`}
                    onclick={() => actions.oprBasicAction({from: [side, 'aura', null], to: [null, 'distance', null], actionTitleKey: '後退', costType: null})}>{i18next.t('後退')}</button>
                </div>
                <div class="ui basic buttons" style="margin-right: 10px;">
                    <button
                    id="WEAR-BUTTON" 
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${basicActionEnableState.wear ? '' : 'disabled'}`}
                    onclick={() => actions.oprBasicAction({from: [null, 'dust', null], to: [side, 'aura', null], actionTitleKey: '纏い', costType: null})}>{i18next.t('纏い')}</button>
                </div>
                <div class="ui basic buttons" style="margin-right: 10px;">
                    <button
                    id="CHARGE-BUTTON" 
                    style="padding-left: 1em; padding-right: 1em;"
                    class={`ui button ${basicActionEnableState.charge ? '' : 'disabled'}`}
                    onclick={() => actions.oprBasicAction({from: [side, 'aura', null], to: [side, 'flair', null], actionTitleKey: '宿し', costType: null})}>{i18next.t('宿し')}</button>
                </div>
                <br />
                <button
                    id="ALL-ENHANCE-DECREASE-BUTTON"
                    class={`ui basic button ${onCardTokenFound ? '' : 'disabled'}`}
                    style="margin-top: 5px;"
                    onclick={() => actions.oprRemoveSakuraTokenfromAllEnhanceCard()}>{t('全付与札の桜花結晶-1')}</button>
                </div>
            );
            // 決闘開始操作を行っていなければ、コマンドボタンはまだ表示しない
            if(!state.board.mariganFlags[state.side]){
                innerCommandButtons = null;
            }

            commandButtons = (
                <div class={css.commandButtons}>
                <div class={css.currentPhase}>{t('- 桜花決闘 -')}</div>
                {innerCommandButtons}

                </div>
            );
        } else if(state.board.megamiOpenFlags[state.side]){
            commandButtons = (
                <div class={css.commandButtons}>
                    <div><span class={css.currentPhase} style="white-space: nowrap">{t('- 眼前構築 -')}</span>
                        <span style="white-space: nowrap">
                            <span class={css.currentCardSet}>{t('カードセット')}: {utils.getCardSetName(state.board.cardSet)}</span>
                            <button class={`ui basic button tiny ${css.cardSetChangeButton}`} onclick={changeCardSet}>{t('変更')}</button>
                        </span>
                    </div>
                </div>
            );
        } else if(state.board.playerNames[state.side] !== null){
            commandButtons = (
                <div class={css.commandButtons}>
                    <div><span class={css.currentPhase} style="white-space: nowrap">{t('- 双掌繚乱 -')}</span>
                        <span style="white-space: nowrap">
                            <span class={css.currentCardSet}>{t('カードセット')}: {utils.getCardSetName(state.board.cardSet)}</span>
                            <button class={`ui basic button tiny ${css.cardSetChangeButton}`} onclick={changeCardSet}>{t('変更')}</button>
                        </span>
                    </div>
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
            megamiCaptionP1 = ` - ${t('メガミ名-MEGAMI1、MEGAMI2', {
                 megami1: utils.getMegamiDispNameWithSymbol(state.setting.language.uniqueName, board.megamis.p1[0])
                 , megami2: utils.getMegamiDispNameWithSymbol(state.setting.language.uniqueName, board.megamis.p1[1])
                })}`
        } else {
            // プレイヤー1のメガミ名を表示不可能な場合
            megamiCaptionP1 = ` - ${t('メガミ名-？？？、？？？')}`
        }
    }
    if(board.megamis.p2 !== null){
        if(state.side === 'p2' || board.megamiOpenFlags.p2){
            // プレイヤー2のメガミ名を表示可能な場合 (自分がプレイヤー2である or プレイヤー2のメガミが公開されている)
            megamiCaptionP2 = ` - ${t('メガミ名-MEGAMI1、MEGAMI2', {
                 megami1: utils.getMegamiDispNameWithSymbol(state.setting.language.uniqueName, board.megamis.p2[0])
                 , megami2: utils.getMegamiDispNameWithSymbol(state.setting.language.uniqueName, board.megamis.p2[1])
                })}`
        } else {
            // プレイヤー2のメガミ名を表示不可能な場合
            megamiCaptionP2 = ` - ${t('メガミ名-？？？、？？？')}`
        }
    }

    // 観戦者名表示の決定
    let watcherNameElements: JSX.Element[] = [];
    let firstWatcher = true;
    for(let sessionId in state.board.watchers){
        let watcher = state.board.watchers[sessionId];
    
        let name = watcher.name;
        if(!firstWatcher) watcherNameElements.push(<span>、</span>);
        watcherNameElements.push((state.currentWatcherSessionId === sessionId ? (<span style={{color: 'blue'}}>{name}</span>) : (<span>{name}</span>)));

        firstWatcher = false;
    }


    // 通知
    let notifyData = [
        {message: t('通知-ターンを終了しました'), key: 'turnEnd'},
        {message: t('通知-対応します'), key: 'reaction'},
    ];
    let notifyValueChanged = (e) => {
        let val = $(e.target).val();
        let $button = $('#NOTIFY-SEND-BUTTON');
        if(val === '-'){
            $button.addClass('disabled');
        } else {
            $button.removeClass('disabled');
        }
    };
    let notify = () => {
        if(state.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は実行不可能な操作
        let side = state.side;

        let opponentName = state.board.playerNames[utils.flipSide(state.side)];

        let notifyType = $('[name=notifyType]').val();
        let notifyItem = notifyData.find(item => item.key === notifyType);

        // 通知ログを追加
        let newNotifyLogs = actions.appendNotifyLog({ text: notifyItem.message}).notifyLog;
        let appendedNotifyLog = newNotifyLogs[newNotifyLogs.length - 1];

        // Firestoreへ通知ログを送信
        utils.sendLogToFirestore(state.firestore, state.tableId, [appendedNotifyLog], state.side);

        // 送信完了
        toastr.success(t('Oへ通知しました。', {opponent: opponentName}), '', {timeOut: 5000});

        // ドロップダウンを元に戻す
        $('[name=notifyType]').closest('.dropdown').dropdown('set selected', '-');
    };

    const dropdownCreate = (e) => {
        $(e).dropdown({action: 'hide'});
    };


    const aboutThisService = () => {
        utils.showModal("#ABOUT-MODAL");
    }

    const quizOpen = () => {
        let st = apps.quizWindow.State.create(state.board.cardSet, state.setting.language);
        apps.quizWindow.run(st, document.getElementById('QUIZ-WINDOW-CONTAINER'));            
    };

    let menu = (
        <div class="ui basic button dropdown" oncreate={dropdownCreate}>
            {t('メニュー')}
            <i class="dropdown icon"></i>
            <div class="menu">
                {state.side === 'watcher' ? null : <div class="item" onclick={playerNameChange}>{t('プレイヤー名の変更')}</div>}
                {state.side === 'watcher' ? null : <div class="item" onclick={reset}>{t('ボードリセット')}</div>}
                <div class="item" onclick={() => actions.toggleActionLogVisible()}>
                    {(state.actionLogVisible ? <i class="check icon"></i> : null)}
                    {t('操作ログを表示')}
                                </div>
                <div class="item" onclick={() => actions.toggleBgmPlaying()}>
                    {(state.bgmPlaying ? <i class="check icon"></i> : null)}
                    {t('BGM再生')}
                </div>
                <div class="item" onclick={() => actions.toggleSettingVisible()}>
                    {(state.settingVisible ? <i class="check icon"></i> : null)}
                    {t('設定')}
                </div>
                <div class="divider"></div>
                <div class="item" onclick={() => actions.toggleCardListVisible()}>
                    {t('カードリスト')}
                </div>
                <div class="item" onclick={quizOpen}>
                    {t('ミニゲーム-ふるよにミニクイズ')}
                </div>
                <div class="divider"></div>
                <div class="item" onclick={() => location.href = "/"}>
                    {t('卓から離れる')}
                </div>
                <div class="divider"></div>
                <div class="item" onclick={aboutThisService} style={{lineHeight: '1.5'}}>{utils.nl2brJsx(t('ふるよにボードシミュレーターについて(バージョン、著作権情報、連絡先)'))}</div>
            </div>
        </div>
    );
    let undoPanel = (
        <div class="ui icon basic buttons">
        <button class={`ui button ${state.boardHistoryPast.length === 0 ? 'disabled' : ''}`} onclick={() => actions.undoBoard()}><i class="undo alternate icon"></i></button>
        <button class={`ui button ${state.boardHistoryFuture.length === 0 ? 'disabled' : ''}`}  onclick={() => actions.redoBoard()}><i class="redo alternate icon"></i></button>
        </div>
    );
    let notifyPanel = (
        <div>
            <div class="ui sub header">{t('相手プレイヤーへ通知')}</div>
            <div class="ui selection dropdown" oncreate={(e) => $(e).dropdown('set selected', '-')}>

                <input type="hidden" name="notifyType" onchange={notifyValueChanged} />
                <i class="dropdown icon"></i>
                <div class="default text"></div>
                <div class="menu">
                    <div class="item" data-value="-"></div>
                    {notifyData.map(item => <div class="item" data-value={item.key}>{item.message}</div>)}
                </div>
            </div>
            <button class="ui basic button disabled" id="NOTIFY-SEND-BUTTON" onclick={notify}>{t('送信')}</button>
        </div>
    );

    let watchSideChanged = (e) => {
        let val = $(e.target).val();
        if(val === 'p1-handviewing'){
            actions.setWatcherViewingSide({value: 'p1', handViewable: true});
        }
        if(val === 'p2-handviewing'){
            actions.setWatcherViewingSide({value: 'p2', handViewable: true});
        }
        if(val === 'p1'){
            actions.setWatcherViewingSide({value: 'p1', handViewable: false});
        }
        if(val === 'p2'){
            actions.setWatcherViewingSide({value: 'p2', handViewable: false});
        }
        
    };

    let watchSidePanel = (
        <div>
            <div class="ui sub header">{t('視点')}</div>
            <div class="ui selection dropdown" style={{width: '20em'}} oncreate={(e) => $(e).dropdown('set selected', 'p1')}>

                <input type="hidden" name="watchSide" onchange={watchSideChanged} />
                <i class="dropdown icon"></i>
                <div class="default text"></div>
                <div class="menu">
                    <div class="item" data-value="p1">{t('プレイヤー1側')}</div>
                    <div class="item" data-value="p1-handviewing">{t('プレイヤー1側（手札も見る）')}</div>
                    <div class="item" data-value="p2">{t('プレイヤー2側')}</div>
                    <div class="item" data-value="p2-handviewing">{t('プレイヤー2側（手札も見る）')}</div>
                </div>
            </div>
        </div>
    );

    let helpButton = (
        <button class="ui basic button" onclick={() => actions.toggleHelpVisible()}>
        <i class="icon question circle outline"></i>
        {t('操作説明')}
        </button>
    );
    // 観戦者の場合元に戻すボタン、操作説明ボタン、通知パネルの表示はなし
    // またメニューも簡易版にする
    if(state.side === 'watcher'){
        notifyPanel = null;
        undoPanel = null;
        helpButton = null;
    }

    // プレイヤーの場合視点パネルの表示は無し
    if(state.side !== 'watcher'){
        watchSidePanel = null;
    }

    // ボードサイズドロップダウン作成時処理
    const boardSizeDropdownCreate = function(e){
        $(e).dropdown({
            direction: 'upward'
        }).dropdown('set selected', Math.round(state.zoom * 10));
    }

    return (
        <div id="CONTROL-PANEL" style={{left: `${BOARD_BASE_WIDTH * state.zoom + 10}px`}}>    
            {undoPanel}&nbsp;
            {helpButton}
            {menu}<br />

            {commandButtons}



            <table class="ui definition table" style={{ width: '95%', fontSize: 'small' }}>
                <tbody>
                    <tr>
                        <td class="collapsing">{t('プレイヤー1')}</td>
                        <td style={state.side === 'p1' ? {color: 'blue'} : null}>{board.playerNames.p1} {megamiCaptionP1}</td>
                    </tr>
                    <tr>
                        <td>{t('プレイヤー2')}</td>
                        <td style={state.side === 'p2' ? {color: 'blue'} : null}>{board.playerNames.p2} {megamiCaptionP2}</td>
                    </tr>
                    <tr>
                        <td>{t('観戦者')}</td>
                        <td>{watcherNameElements}</td>
                    </tr>
                </tbody>
            </table>

{notifyPanel}
{watchSidePanel}

<div class="ui sub header">{t('ボードサイズ')}</div>
<div class="ui selection dropdown" oncreate={boardSizeDropdownCreate}>

  <input type="hidden" name="boardSize" onchange={(e) => {return actions.setZoom(Number($(e.target).val()) * 0.1)}} />
  <i class="dropdown icon"></i>
  <div class="default text"></div>
  <div class="menu">
    <div class="item" data-value="6">6</div>
    <div class="item" data-value="7">7</div>
    <div class="item" data-value="8">8</div>
    <div class="item" data-value="9">9</div>
    <div class="item" data-value="10">10</div>
  </div>
</div>



        </div>


    );
}