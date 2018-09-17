import { h } from "hyperapp";

/** 領域枠 */
interface Param {
    region: SakuraTokenRegion;
    side?: PlayerSide;
    title: string;

    left: number;
    top: number;
    width: number;
    height: number;

    tokenCount?: number;
}

export const SakuraTokenAreaBackground = (p: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${p.width * state.zoom}px`
        , height: `${p.height * state.zoom}px`
    };


    return (
        <div
            class={"area background sakura-token-region ui segment "}
            style={styles}
            data-side={p.side || 'none'}
            data-region={p.region}
            key={`SakuraTokenAreaBackground_${p.side}_${p.region}`}
        >
            <div class="area-title" style={{fontSize: `${(15 * state.zoom)}px`}}>{p.title}</div>
            
        </div>
    );
}