import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as sakuraba from "sakuraba";
import * as utils from "sakuraba/utils";

/** 領域枠 */
interface Param {
    region: CardRegion;
    side: PlayerSide;
    linkedCardId: string;
    
    left: number;
    top: number;
    width: number;
    height: number;
}

export const CardAreaDroppable = (p: Param) => (state: state.State, actions: ActionsType) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${p.width * state.zoom}px`
        , height: `${p.height * state.zoom}px`
    };

    return (
        <div
         class="area droppable card-region"
         style={styles}
         data-side={p.side}
         data-region={p.region}
         data-linked-card-id={p.linkedCardId || 'none'}
         key={`CardAreaDroppable_${p.side}_${p.region}_${p.linkedCardId}`}
         ></div>
    );
}