import { h } from "hyperapp";
import * as utils from "sakuraba/utils";
import * as sakuraba from "sakuraba";
import dragInfo from "sakuraba/dragInfo";
import _ from "lodash";

/** カード */
interface Param {
    left: number;
    top: number;
    zoom: number;
    stackedCount: number;
}
/** メガミタロット */
export const MegamiTarots = (p: Param) => {
    // ベーススタイル決定
    let styles: Partial<CSSStyleDeclaration> = {
          width: `${94 * p.zoom}px`
        , height: `${185 * p.zoom}px`
        , position: 'absolute'
  };

  // 1枚ずつ積み重ねて表示
  let tarots: JSX.Element[] = [];
  let cx = p.left;
  let cy = p.top;
  for(let i = 0; i < p.stackedCount; i++){
      tarots.push(<img src="//inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/furuyoni_na/tarots/tarotback_emboss.png" style={_.assign({}, styles, {left: `${cx * p.zoom}px`, top: `${cy * p.zoom}px`})} />);
      cx += 3;
      cy += 3;
  }
  return tarots;
}