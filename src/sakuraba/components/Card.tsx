import { h } from "hyperapp";

// 説明を取得する関数
function getDescriptionHtml(): string{
    let cardTitleHtml = `<ruby><rb>${this.card.data.name}</rb><rp>(</rp><rt>${this.card.data.ruby}</rt><rp>)</rp></ruby>`
    let html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`

    html += `</div><div class='ui content'>`

    let typeCaptions = [];
    if(this.card.data.types.indexOf('attack') >= 0) typeCaptions.push("<span style='color: red; font-weight: bold;'>攻撃</span>");
    if(this.card.data.types.indexOf('action') >= 0) typeCaptions.push("<span style='color: blue; font-weight: bold;'>行動</span>");
    if(this.card.data.types.indexOf('enhance') >= 0) typeCaptions.push("<span style='color: green; font-weight: bold;'>付与</span>");
    if(this.card.data.types.indexOf('reaction') >= 0) typeCaptions.push("<span style='color: purple; font-weight: bold;'>対応</span>");
    if(this.card.data.types.indexOf('fullpower') >= 0) typeCaptions.push("<span style='color: gold; font-weight: bold;'>全力</span>");
    html += `${typeCaptions.join('/')}`;
    if(this.card.data.range !== undefined){
        html += `<span style='margin-left: 1em;'>適正距離${this.card.data.range}</span>`
    }
    html += `<br>`;
    if(this.card.data.baseType === 'special'){
        html += `<div class='ui top right attached label'>消費: ${this.card.data.cost}</div>`;
    }
    if(this.card.data.types.indexOf('enhance') >= 0){
        html += `納: ${this.card.data.capacity}<br>`;
    }
    if(this.card.data.damage !== undefined){
        html += `${this.card.data.damage}<br>`;
    }
    html += `${this.card.data.text.replace('\n', '<br>')}`;
    html += `</div>`;
    return html;
}

/** カード */
export const Card = (params: {target: state.Card, left: number, top: number}) => (state: state.State, actions) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${params.left}px`
        , top: `${params.top}px`
    };
    return <div class="fbs-card" id={'board-object-' + params.target.id} style={styles} draggable="true" data-html={getDescriptionHtml()}></div>;
}