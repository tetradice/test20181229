import { h } from "hyperapp";
import * as utils from "sakuraba/utils";
import * as sakuraba from "sakuraba";
import { ActionsType } from "../actions";
import dragInfo from "sakuraba/dragInfo";
import { Card } from "sakuraba/apps/common/components";

/** カード */
type Type = 'board' | 'modal';
interface Param {
    target: state.Card;
    left: number;
    top: number;
}
export const BoardCard = (p: Param) => (state: state.State, actions: ActionsType) => {
    // 手札公開判定
    let handOpened = false;
    if(state.side === p.target.side && state.board.handCardOpenFlags[p.target.side][p.target.id]){
        handOpened = true;
    }

    // 公開判定
    let opened = (
        p.target.openState === 'opened'
        || (p.target.openState === 'ownerOnly' && p.target.side === state.side)
        || (p.target.openState === 'ownerOnly' && p.target.side === state.viewingSide && state.side === 'watcher' && state.handViewableFromCurrentWatcher)
    );
    // リバース表示判定
    let reversed = p.target.side === utils.flipSide(state.viewingSide);

    // 説明表示判定
    // 表向きであるか、自分の伏せ札であるか、自分の切り札であれば説明を見ることができる
    // また観戦者の場合で、手札公開フラグONの場合も説明を見ることができる
    let known = (
        opened
        || (p.target.region === 'hidden-used' && p.target.side === state.side)
        || (p.target.region === 'special' && p.target.side === state.side)
    )

    // ドラッグ可否判定
    let libraryCards = state.board.objects.filter(o => o.type === 'card' && o.side === p.target.side && o.region === p.target.region);
    let draggable = true;
    let clickableClass = true;
    if(state.side === 'watcher'){
        // 観戦者はドラッグもクリックも不可能
        draggable = false;
        clickableClass = known; // この場合、説明を表示可能である場合に限り、クリック可能クラスを付与
    } else {
         // 山札にあって、かつ一番上のカードでない場合はドラッグ不可
        if(p.target.region === 'library' && p.target.indexOfRegion !== (libraryCards.length - 1)){
            draggable = false;
            clickableClass = false; // この場合、クリック可能クラスも付与しない
        }
    }

    // ボード上のカードをダブルクリックした場合の処理
    const onDoubleClickAtBoard = (element) => {
        // 観戦者なら何もしない
        if(state.side === 'watcher'){
            return false;
        };
        if(!state.board.mariganFlags[state.side]){
            utils.messageModal('決闘を開始するまでは、カードや桜花結晶の操作は行えません。');
            return false;
        };
        const data = sakuraba.CARD_DATA[state.board.cardSet][p.target.cardId];

        // 切札なら裏返す
        if(data.baseType === 'special'){
            actions.oprSetSpecialUsed({objectId: p.target.id, value: !p.target.specialUsed});
        }

        // 山札なら1枚引く
        if(data.baseType === 'normal' && p.target.region === 'library'){
            actions.oprDraw({});
        }
        return true;
    }



    // そのカードが開いた状態での適正距離を持っていれば、カードの所有プレイヤーが傘を開いているかどうかを判定
    let useOpenedData = false;
    const cardData = sakuraba.CARD_DATA[state.board.cardSet][p.target.cardId];
    if(cardData.rangeOpened !== undefined && state.board.umbrellaStatus[p.target.ownerSide] === 'opened'){
        useOpenedData = true;
    }
    
    return (
        <Card
            cardSet={state.board.cardSet}
            opened={opened}
            handOpened={handOpened}
            clickableClass={clickableClass}
            useOpenedCardData={useOpenedData}
            reversed={reversed}
            descriptionViewable={known}
            ondblclick={onDoubleClickAtBoard}
            draggable={draggable}
            zoom={state.zoom}
            {...p}
        ></Card>
    );
}