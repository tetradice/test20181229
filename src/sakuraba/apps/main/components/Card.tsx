import { h } from "hyperapp";
import * as utils from "sakuraba/utils";
import * as sakuraba from "sakuraba";
import { ActionsType } from "../actions";
import dragInfo from "sakuraba/dragInfo";

/** カード */
interface Param {
    target: state.Card;
    left: number;
    top: number;
}
export const Card = (p: Param) => (state: state.State, actions: ActionsType) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${(p.target.rotated ? p.left + ((140 - 100) / 2) : p.left) * state.zoom}px`
        , top: `${(p.target.rotated ? p.top - ((140 - 100) / 2) : p.top) * state.zoom}px`
        , width: `${100 * state.zoom}px`
        , height: `${140 * state.zoom}px`
    };
    let cardData = sakuraba.CARD_DATA[p.target.cardId];
    let className = "fbs-card";

    // 公開判定
    let opened = (p.target.openState === 'opened' || (p.target.openState === 'ownerOnly' && p.target.side === state.side));

    if(opened){
        className += " open-normal";
    } else {
        className += (cardData.baseType === 'special' ? " back-special" : " back-normal");
    }
    if(p.target.rotated) className += " rotated";
    if(p.target.side === utils.flipSide(state.side)) className += " opponent-side"; 

    // 対象のカードが他のカードを封印可能で、かつ公開状態である場合に限り、他のカードをドロップ可能
    if(cardData.sealable && p.target.openState === 'opened'){
        className += " card-droppable";
    }
    // 対象のカードが付与で、かつ使用済み領域か切札領域に表向きである場合に限り、桜花結晶をドロップ可能
    if(cardData.types.find(t => t === 'enhance') && p.target.openState === 'opened'){
        className += " sakura-token-droppable";
    }

    const setPopup = (element) => {
        // SemanticUI ポップアップ初期化
        $(element).popup({
            hoverable: true,
            delay: {show: 500, hide: 500},
            onShow: function(): false | void{
                // 表向きであるか、自分の伏せ札であるか、自分の切り札であれば説明を見ることができる
                let known = (
                    p.target.openState === 'opened'
                    || (p.target.openState === 'ownerOnly' && p.target.side === state.side)
                    || (p.target.region === 'hidden-used' && p.target.side === state.side)
                    || (p.target.region === 'special' && p.target.side === state.side)
                )
                if(!known) return false;

                if(dragInfo.draggingFrom !== null) return false;
            },
        });
    }

    const oncreate = (element) => {
        //if(state.draggingFromCard !== null) return;
        setPopup(element);
    }
    const onupdate = (element) => {
        //if(state.draggingFromCard !== null) return;
        setPopup(element);
    }
    const ondblclick = (element) => {
        const data = sakuraba.CARD_DATA[p.target.cardId];

        // 切札なら裏返す
        if(data.baseType === 'special'){
            actions.oprSetSpecialUsed({objectId: p.target.id, value: !p.target.specialUsed});
        }

        // 山札なら1枚引く
        if(data.baseType === 'normal' && p.target.region === 'library'){
            actions.oprDraw();
        }
    }

    // ドラッグ可否判定
    let libraryCards = state.board.objects.filter(o => o.type === 'card' && o.side === p.target.side && o.region === p.target.region);
    let draggable = true;
    if(p.target.region === 'special'){
        draggable = false; // 切り札はドラッグ不可
        className += " clickable" // クリックは可能
    }
    if(p.target.region === 'library' && p.target.indexOfRegion !== (libraryCards.length - 1)) draggable = false; // 山札にあって、かつ一番上のカードでない場合はドラッグ不可

    return (
        <div
            key={p.target.id}
            class={className}
            id={'board-object-' + p.target.id}
            style={styles}
            draggable={draggable}
            data-object-id={p.target.id}
            data-side={p.target.side}
            data-region={p.target.region}
            ondblclick={ondblclick}
            oncreate={oncreate}
            onupdate={onupdate}
            data-html={utils.getDescriptionHtml(p.target.cardId)}            
        >
            <div class="card-name">{(opened ? cardData.name : '')}</div>
        </div>
    );
}