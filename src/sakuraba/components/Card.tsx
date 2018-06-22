import { h } from "hyperapp";
import * as sakuraba from '../../sakuraba';

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
    if(cardData.types.indexOf('fullpower') >= 0) typeCaptions.push("<span style='color: gold; font-weight: bold;'>全力</span>");
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
export const Card = (params: {target: state.Card, left: number, top: number}) => (state: state.State, actions) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${params.left}px`
        , top: `${params.top}px`
    };
    let cardData = sakuraba.CARD_DATA[params.target.cardId];
    let className = "fbs-card";
    if(params.target.opened){
        className += " open-normal";
    } else {
        className += " back-normal";
    }

    return (
        <div
            class={className}
            id={'board-object-' + params.target.id}
            style={styles}
            draggable="true"
            data-html={getDescriptionHtml(params.target.cardId)}>
            {(params.target.opened ? cardData.name : '')}
        </div>
    );
}