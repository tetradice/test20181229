import { h } from "hyperapp";

/** カード */
interface Param {
    left: number;
    top: number;
    zoom: number;
    stackedCount: number;
    baseClass: string;
}
/** 積み重ねたカード */
export const StackedCards = (p: Param) => {
    // ベーススタイル決定
    let styles: Partial<CSSStyleDeclaration> = {
          width: `${100 * p.zoom}px`
        , height: `${140 * p.zoom}px`
        , position: 'absolute'
  };

  // 1枚ずつ積み重ねて表示
  let cards: JSX.Element[] = [];
  let cx = p.left;
  let cy = p.top;
  for(let i = 0; i < p.stackedCount; i++){
      cards.push(<div class={`fbs-card ${p.baseClass}`} style={Object.assign({}, styles, {left: `${cx * p.zoom}px`, top: `${cy * p.zoom}px`})} />);
      cx += 2;
      cy += 4;
  }
  return cards;
}