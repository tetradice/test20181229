import { h } from "hyperapp";

/** 領域枠 */
interface Param {
    region: CardRegion;
    
    left: number;
    top: number;
    width: number;
    height: number;
}

export const CardAreaDroppable = (p: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left}px`
        , top: `${p.top}px`
        , width: `${p.width}px`
        , height: `${p.height}px`
        , position: 'relative'
    };
    if(state.draggingFromCard !== null && p.region !== state.draggingFromCard.region){
        styles.zIndex = '9999';
    }

    return (
        <div class="area droppable" style={styles} key={"CardAreaDroppable_" + p.region}>
        </div>
    );
}