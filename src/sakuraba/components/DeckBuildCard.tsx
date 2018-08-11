import { h } from "hyperapp";
import * as utils from "sakuraba/utils";
import * as sakuraba from "sakuraba";
import { ActionsType } from "sakuraba/actions";

/** カード */
interface Param {
    target: state.Card;
    left: number;
    top: number;
    selected?: boolean;
    onclick?: Function;
    zoom: number;
}
export const DeckBuildCard = (p: Param) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${(p.target.rotated ? p.left + ((140 - 100) / 2) : p.left) * p.zoom}px`
        , top: `${(p.target.rotated ? p.top - ((140 - 100) / 2) : p.top) * p.zoom}px`
        , width: `${100 * p.zoom}px`
        , height: `${140 * p.zoom}px`
    };
    let cardData = sakuraba.CARD_DATA[p.target.cardId];
    let className = "fbs-card open-normal clickable";
    if(p.selected) className += " selected";

    const setPopup = (element) => {
        // SemanticUI ポップアップ初期化
        $(element).popup({
            delay: {show: 500, hide: 0},
        });
    }

    const oncreate = (element) => {
        setPopup(element);
    }
    const onupdate = (element) => {
        setPopup(element);
    }

    return (
        <div
            key={p.target.id}
            class={className}
            id={'board-object-' + p.target.id}
            style={styles}
            data-object-id={p.target.id}
            data-region={p.target.region}
            onclick={p.onclick}
            ondblclick={ondblclick}
            oncreate={oncreate}
            onupdate={onupdate}
            data-html={utils.getDescriptionHtml(p.target.cardId)}            
        >
            {(p.target.opened ? cardData.name : '')}
        </div>
    );
}