import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as utils from "sakuraba/utils";

/** 領域枠 */
interface Param {
    region: SakuraTokenRegion;
    side?: PlayerSide;
    
    left: number;
    top: number;
    width: number;
    height: number;
}

export const SakuraTokenAreaDroppable = (p: Param) => (state: state.State, actions: ActionsType) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${p.width * state.zoom}px`
        , height: `${p.height * state.zoom}px`
        , position: 'relative'
    };

    return (
        <div
         class="area droppable"
         style={styles}
         data-side={p.side}
         data-region={p.region}
         key={`SakuraTokenAreaDroppable_${p.side}_${p.region}`}
         ></div>
    );
}