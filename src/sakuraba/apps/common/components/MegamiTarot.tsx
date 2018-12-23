import { h } from "hyperapp";
import _ from "lodash";

/** カード */
interface Param {
    left: number;
    top: number;
    zoom: number;

    opened: boolean;
}
/** メガミタロット */
export const MegamiTarot = (p: Param) => {
    // スタイル決定
    let styles: Partial<CSSStyleDeclaration> = {
          width: `${94 * p.zoom}px`
        , height: `${185 * p.zoom}px`
        , left: `${p.left * p.zoom}px`
        , top: `${p.top * p.zoom}px`
        , position: 'absolute'
  };

    return <img src="//inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/furuyoni_na/tarots/tarotback_emboss.png" style={_.assign({}, styles, { left: `${cx * p.zoom}px`, top: `${cy * p.zoom}px` })} />;
}