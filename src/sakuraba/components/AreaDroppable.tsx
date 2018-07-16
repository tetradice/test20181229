import { h } from "hyperapp";

/** 領域枠 */
interface Param {
    key: string;
    
    left: number;
    top: number;
    width: number;
    height: number;
}

export const AreaDroppable = (p: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left}px`
        , top: `${p.top}px`
        , width: `${p.width}px`
        , height: `${p.height}px`
        , position: 'relative'
    };

    return (
        <div class="area droppable" style={styles} key={p.key}>
        </div>
    );
}