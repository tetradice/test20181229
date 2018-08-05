import { h } from "hyperapp";
import * as utils from "../utils";
import * as sakuraba from '../../sakuraba';
import { ActionsType } from "../actions";

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
    if(p.target.opened){
        className += " open-normal";
    } else {
        className += " back-normal";
    }
    if(p.target.rotated) className += " rotated";
    if(p.target.side === utils.flipSide(state.side)) className += " opponent-side"; 
    if(state.draggingFromCard && p.target.id === state.draggingFromCard.id) className += " dragging";

    const setPopup = (element) => {
        // SemanticUI ポップアップ初期化
        $(element).popup({
            delay: {show: 500, hide: 0},
            onShow: function(): false | void{
                if(!p.target.known.p1) return false;

                let st = actions.getState();
                if(st.draggingFromCard !== null) return false;
            },
        });
    }

    const oncreate = (element) => {
        if(state.draggingFromCard !== null) return;
        setPopup(element);
    }
    const onupdate = (element) => {
        if(state.draggingFromCard !== null) return;
        setPopup(element);
    }
    const ondblclick = (element) => {
        const data = sakuraba.CARD_DATA[p.target.cardId];

        // 切札なら裏返す
        if(data.baseType === 'special'){
            actions.flipCard(p.target.id);
        }
    }
    let draggable = p.target.region !== 'library' || p.target.indexOfRegion === (state.board.objects.filter(o => o.type === 'card' && o.region === p.target.region).length - 1);

    return (
        <div
            key={p.target.id}
            class={className}
            id={'board-object-' + p.target.id}
            style={styles}
            draggable={draggable}
            data-object-id={p.target.id}
            data-region={p.target.region}
            ondblclick={ondblclick}
            ondragstart={(elem) => { $(elem).popup('hide all'); actions.cardDragStart(p.target); }}
            ondragend={() => actions.cardDragEnd()}
            oncreate={oncreate}
            onupdate={onupdate}
            data-html={utils.getDescriptionHtml(p.target.cardId)}            
        >
            {(p.target.opened ? cardData.name : '')}
        </div>
    );
}