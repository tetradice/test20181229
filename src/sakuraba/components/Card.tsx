import { h } from "hyperapp";
import * as sakuraba from '../../sakuraba';
import { ActionsType } from "../actions";

// 説明を取得する関数
function getDescriptionHtml(cardId: string): string{
    let cardData = sakuraba.CARD_DATA[cardId];
    let cardTitleHtml = `<ruby><rb>${cardData.name}</rb><rp>(</rp><rt>${cardData.ruby}</rt><rp>)</rp></ruby>`
    let html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`

    html += `</div><div class='ui content'>`

    let typeCaptions = [];
    if(cardData.types.indexOf('attack') >= 0) typeCaptions.push("<span style='color: red; font-weight: bold;'>攻撃</span>");
    if(cardData.types.indexOf('action') >= 0) typeCaptions.push("<span style='color: blue; font-weight: bold;'>行動</span>");
    if(cardData.types.indexOf('enhance') >= 0) typeCaptions.push("<span style='color: green; font-weight: bold;'>付与</span>");
    if(cardData.types.indexOf('reaction') >= 0) typeCaptions.push("<span style='color: purple; font-weight: bold;'>対応</span>");
    if(cardData.types.indexOf('fullpower') >= 0) typeCaptions.push("<span style='color: #E0C000; font-weight: bold;'>全力</span>");
    html += `${typeCaptions.join('/')}`;
    if(cardData.range !== undefined){
        html += `<span style='margin-left: 1em;'>適正距離${cardData.range}</span>`
    }
    html += `<br>`;
    if(cardData.baseType === 'special'){
        html += `<div class='ui top right attached label'>消費: ${cardData.cost}</div>`;
    }
    if(cardData.types.indexOf('enhance') >= 0){
        html += `納: ${cardData.capacity}<br>`;
    }
    if(cardData.damage !== undefined){
        html += `${cardData.damage}<br>`;
    }
    html += `${cardData.text.replace('\n', '<br>')}`;
    html += `</div>`;
    return html;
}




/** カード */
interface Param {
    target: state.Card;
    left: number;
    top: number;
    onclick?: Function;
    selected?: boolean;
}
export const Card = (p: Param) => (state: state.State, actions: ActionsType) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left}px`
        , top: `${p.top}px`
    };
    let cardData = sakuraba.CARD_DATA[p.target.cardId];
    let className = "fbs-card";
    if(p.target.opened){
        className += " open-normal";
    } else {
        className += " back-normal";
    }
    if(p.selected){
        className += " selected";
    }
    if(p.target.id === state.draggingFromObjectId){
        className += " dragging";
    }

    const oncreate = (element) => {
        console.log("elem", element);

        // SemanticUI ポップアップ初期化
        $(element).popup({
            delay: {show: 500, hide: 0},
            onShow: function(): false | void{
                actions.cardDragEnd();
            },
        });
    }

    return (
        <div
            class={className}
            id={'board-object-' + p.target.id}
            style={styles}
            draggable="true"
            onclick={p.onclick}
            ondragstart={() => actions.cardDragStart(p.target.id)}
            ondragend={() => actions.cardDragEnd()}
            oncreate={oncreate}
            data-html={getDescriptionHtml(p.target.cardId)}            
        >
            {(p.target.opened ? cardData.name : '')}
        </div>
    );
}