import { h } from "hyperapp";
import _ from "lodash";
import { Megami, MEGAMI_DATA } from "sakuraba";

/** カード */
interface Param {
    left: number;
    top: number;
    zoom: number;

    megami: Megami;
    opened: boolean;
}
/** メガミタロット */
export const MegamiTarot = (p: Param) => {
    // スタイル決定
    let styles: Partial<CSSStyleDeclaration> = {
          width: `${116 * p.zoom}px`
        , height: `${228 * p.zoom}px`
        , left: `${p.left * p.zoom}px`
        , top: `${p.top * p.zoom}px`
        , position: 'absolute'
    };

    if(p.opened){
        let megamiData = MEGAMI_DATA[p.megami];
        let imageName = (megamiData.anotherID ? `tarot_${megamiData.tarotNo}_${megamiData.anotherID.toLowerCase()}` : `tarot_${megamiData.tarotNo}`)
        return <img src={`//inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/furuyoni_na/tarots/resized/en/${imageName}.png`} style={styles} />;
    } else {
        return <img src="//inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/furuyoni_na/tarots/tarotback_emboss.png" style={styles} />;
    }
}