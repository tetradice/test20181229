import { h } from "hyperapp";
import { ActionsType } from "../actions";

/** 領域枠 */
interface Param {
    region: SakuraTokenRegion;
    
    left: number;
    top: number;
    width: number;
    height: number;
}

export const SakuraTokenAreaDroppable = (p: Param) => (state: state.State, actions: ActionsType) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left}px`
        , top: `${p.top}px`
        , width: `${p.width}px`
        , height: `${p.height}px`
        , position: 'relative'
    };
    if(state.draggingFromCard !== null && p.region !== state.draggingFromSakuraToken.region){
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
        //actions.sakuraTokenDragEnter(p.region);
    };
    const dragleave = (e: DragEvent) => {
        //actions.sakuraTokenDragLeave();
    };
    const drop = (e: DragEvent) => {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        
        // 桜花結晶を移動 (リージョンが空でなければ)
        if(state.draggingHoverSakuraTokenRegion){
            //actions.moveCard({from: state.draggingFromSakuraToken.region, fromIndex: state.draggingFromSakuraToken.indexOfRegion, to: state.draggingHoverSakuraTokenRegion});
        }

        return false;
    };

    return (
        <div
         class="area droppable"
         style={styles}
         key={"SakuraTokenAreaDroppable_" + p.region}
         ondragover={dragover}
         ondragenter={dragenter}
         ondragleave={dragleave}
         ondrop={drop}
         ></div>
    );
}