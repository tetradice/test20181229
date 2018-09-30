import { h } from "hyperapp";
import * as utils from "sakuraba/utils";
import * as sakuraba from "sakuraba";
import dragInfo from "sakuraba/dragInfo";

/** カード */
interface Param {
    target: state.Card;
    left: number;
    top: number;
    selected?: boolean;
    onclick?: Function;
    ondblclick?: Function;
    opened: boolean;
    reversed?: boolean;
    useOpenedCardData?: boolean;

    zoom: number;
    descriptionViewable: boolean;
    draggable?: boolean;
    handOpened?: boolean;
}
export const Card = (p: Param) => {
    // スタイル決定
    // 選択済みカードの場合、罫線が1px大きくなるため、leftとtopから1を引く
    let styles: Partial<CSSStyleDeclaration> = {
        left: `${(p.target.rotated ? p.left + ((140 - 100) / 2) : p.left) * p.zoom - (p.selected || p.handOpened ? 1 : 0)}px`
      , top: `${(p.target.rotated ? p.top - ((140 - 100) / 2) : p.top) * p.zoom - (p.selected || p.handOpened ? 1 : 0)}px`
      , width: `${100 * p.zoom}px`
      , height: `${140 * p.zoom}px`
  };

    if (p.target.region === 'on-card') {
        styles.zIndex = `${90 - p.target.indexOfRegion}`;
    } else if (p.target.discharged) {
        // 帯電解除していれば表示順序を上げる (横向きになるため)
        styles.zIndex = `${150 - p.target.indexOfRegion}`;
    } else {
        styles.zIndex = `${100}`;
    }

  let cardData = sakuraba.CARD_DATA[p.target.cardId];
  let className = "fbs-card";

  // 選択済み、もしくは手札公開中の場合は、選択済みスタイルを付与
  if(p.selected || p.handOpened) className += " selected";

  // 公開判定
  if(p.opened){
      className += " open-normal";
  } else {
      if(cardData.poison){
        className += " back-poison";
      } else if(cardData.baseType === 'special'){
        className += " back-special";
      } else {
        className += " back-normal";
      }
      
  }
  if(p.target.rotated) className += " rotated";
  if(p.reversed) className += " opponent-side"; 

  const setPopup = (element) => {
      // SemanticUI ポップアップ初期化
      $(element).popup({
          hoverable: true,
          delay: {show: 500, hide: 0},
          onShow: function(): false | void{
              if(!p.descriptionViewable) return false;

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

  let typeCaptions = [];
  if(p.opened){
      if(cardData.types.indexOf('attack') >= 0) typeCaptions.push(<span class='card-type-attack'>攻</span>);
      if(cardData.types.indexOf('action') >= 0) typeCaptions.push(<span class='card-type-action'>行</span>);
      if(cardData.types.indexOf('enhance') >= 0) typeCaptions.push(<span class='card-type-enhance'>付</span>);
      if(cardData.types.indexOf('variable') >= 0) typeCaptions.push(<span class='card-type-variable'>不</span>);
      if(cardData.types.indexOf('reaction') >= 0) typeCaptions.push(<span class='card-type-reaction'>対</span>);
      if(cardData.types.indexOf('fullpower') >= 0) typeCaptions.push(<span class='card-type-fullpower'>全</span>);
  }
  
  return (
      <div
          key={p.target.id}
          class={className}
          id={'board-object-' + p.target.id}
          style={styles}
          draggable={p.draggable}
          data-object-id={p.target.id}
          data-side={p.target.side}
          data-region={p.target.region}
          data-linked-card-id={p.target.linkedCardId || 'none'}
          onclick={p.onclick}
          ondblclick={p.ondblclick}
          oncreate={oncreate}
          onupdate={onupdate}
          data-html={utils.getDescriptionHtml(p.target.cardId)}            
      >
          <div class="card-name">{(p.opened ? cardData.name : '')}</div>
          {p.opened ?
          <div>
            <div style={{position: 'absolute', top: (p.reversed ? `${24 * p.zoom}px` : null), bottom: (p.reversed ? null : `${24 * p.zoom}px`), left: (p.reversed ? null : `${4 * p.zoom}px`), right: (p.reversed ? `${4 * p.zoom}px` : null)}}>{typeCaptions}</div>
            <div style={{position: 'absolute', top: (p.reversed ? `${4 * p.zoom}px` : null), bottom: (p.reversed ? null : `${4 * p.zoom}px`), left: (p.reversed ? null : `${4 * p.zoom}px`), right: (p.reversed ? `${4 * p.zoom}px` : null)}}>{(cardData.types[0] === 'enhance' ? `納${cardData.capacity}` : (p.useOpenedCardData ? cardData.rangeOpened : cardData.range))}</div>
            <div style={{position: 'absolute', top: (p.reversed ? `${4 * p.zoom}px` : null), bottom: (p.reversed ? null : `${4 * p.zoom}px`), left: (p.reversed ? `${4 * p.zoom}px` : null), right: (p.reversed ? null : `${4 * p.zoom}px`)}}>{(p.useOpenedCardData ? cardData.damageOpened : cardData.damage)}</div>
          </div>
          : null}
          {p.handOpened ? <div style="white-space: nowrap; color: blue; position: absolute; bottom: 4px; right: 0;">【公開中】</div> : null}
      </div>
  );
}