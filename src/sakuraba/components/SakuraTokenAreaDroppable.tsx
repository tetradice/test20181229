import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as utils from "../utils";

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
    if(state.draggingFromSakuraToken !== null && p.region !== state.draggingFromSakuraToken.region){
        styles.zIndex = '9999';
    }
    const dragover = (e: DragEvent) => {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
    };
    const dragenter = (e: DragEvent) => {
        actions.sakuraTokenDragEnter(p.region);
    };
    const dragleave = (e: DragEvent) => {
        actions.sakuraTokenDragLeave();
    };
    const drop = (e: DragEvent) => {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        let currentState = actions.getState();
        
        // 桜花結晶を移動 (リージョンが空でなければ)
        if(state.draggingHoverSakuraTokenRegion){
            actions.moveSakuraToken({
                fromSide: currentState.side
              , from: currentState.draggingFromSakuraToken.region
              , toSide: utils.flipSide(currentState.side)
              , to: currentState.draggingHoverSakuraTokenRegion
          });
      }

        return false;
    };

    return (
        <div
         class="area droppable"
         style={styles}
         key={`SakuraTokenAreaDroppable_${p.side}_${p.region}`}
         ondragover={dragover}
         ondragenter={dragenter}
         ondragleave={dragleave}
         ondrop={drop}
         ></div>
    );
}