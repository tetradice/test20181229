import { h } from "hyperapp";
import { ActionsType } from "../actions";

/** 領域枠 */
interface Param {
    region: CardRegion;
    side: PlayerSide;
    
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
        , position: 'relative'
    };
    if(state.draggingFromCard !== null && p.region !== state.draggingFromCard.region){
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
        actions.cardDragEnter({side: p.side, region: p.region});
    };
    const dragleave = (e: DragEvent) => {
        actions.cardDragLeave();
    };
    const drop = (e: DragEvent) => {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        let currentState = actions.getState();
        
        // カードを移動 (リージョンが空でなければ)
        if(currentState.draggingHoverCardRegion){
            actions.memorizeBoardHistory(); // Undoのために履歴を記憶
            actions.moveCard({
                  fromSide: currentState.side
                , from: currentState.draggingFromCard.region
                , fromIndex: currentState.draggingFromCard.indexOfRegion
                , toSide: (currentState.side === 'p1' ? 'p2' : 'p1')
                , to: currentState.draggingHoverCardRegion
            });
        }

        return false;
    };

    return (
        <div
         class="area droppable"
         style={styles}
         key={`CardAreaDroppable_${p.side}_${p.region}`}
         ondragover={dragover}
         ondragenter={dragenter}
         ondragleave={dragleave}
         ondrop={drop}
         ></div>
    );
}