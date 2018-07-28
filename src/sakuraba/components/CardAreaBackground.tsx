import { h } from "hyperapp";

/** 領域枠 */
interface Param {
    region: CardRegion;

    left: number;
    top: number;
    width: number;
    height: number;

    cardCount?: number;
}

export const CardAreaBackground = (p: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left}px`
        , top: `${p.top}px`
        , width: `${p.width}px`
        , height: `${p.height}px`
        , position: 'relative'
    };

    return (
        <div
            class={"area background ui segment " + (state.draggingHoverCardRegion === p.region ? 'over' : '')}
            style={styles}
            key={"CardAreaBackground_" + p.region}
            data-region={p.region}    
        >
            <div class="card-count">{p.cardCount}</div>
        </div>
    );
}