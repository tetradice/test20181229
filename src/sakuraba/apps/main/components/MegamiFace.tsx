import { h } from "hyperapp";
import { ActionsType } from "../actions";
import { Megami } from "sakuraba";
import { ZIndex } from "sakuraba/const";

/** メガミ顔 */
export const MegamiFace = (p: {megami: Megami, left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${240 * 2 * state.zoom}px`
        , height: `${80 * 2 * state.zoom}px`
        , position: 'absolute'
        , opacity: '0.1'
        , zIndex: `${ZIndex.MEGAMI_FACE}`
    };

    return <img style={styles} src={`http://inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/megami/face/${p.megami}_240x80.png`} />;
}