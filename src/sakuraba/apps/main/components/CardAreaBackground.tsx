import { h } from "hyperapp";

/** 領域枠 */
interface Param {
    region: CardRegion;
    side: PlayerSide;
    title: string;

    left: number;
    top: number;
    width: number;
    height: number;

    cardCount?: number;
}

export const CardAreaBackground = (p: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${p.width * state.zoom}px`
        , height: `${p.height * state.zoom}px`
        , position: 'relative'
    };

    return (
        <div
            class={"area background ui segment"}
            style={styles}
            key={`CardAreaBackground_${p.side}_${p.region}`}
            data-region={p.region}
            data-side={p.side}
        >
            <div class="area-title" style={{fontSize: `${(15 * state.zoom)}px`}}>{p.title}</div>
            <div class="card-count">{p.cardCount}</div>
        </div>
    );
}