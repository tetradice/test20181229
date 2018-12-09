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
    hideBorder?: boolean;
}

export const CardAreaBackground = (p: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${p.width * state.zoom}px`
        , height: `${p.height * state.zoom}px`
    };
    if(p.hideBorder){
        styles.border = 'none';
    }

    // 自分の手札領域で、かつ公開済みの場合
    let handOpened = false;
    if(p.region === 'hand' && p.side === state.side && state.board.handOpenFlags[state.side]){
        styles.border = '1px blue solid';
        handOpened = true;
    }

    return (
        <div
            class={"area background ui segment"}
            style={styles}
            key={`CardAreaBackground_${p.side}_${p.region}`}
            data-region={p.region}
            data-side={p.side}
        >
            <div class="area-title" style={{fontSize: `${(15 * state.zoom)}px`, right: `${8 * state.zoom}px`, top: `${4 * state.zoom}px`}}>{p.title}</div>
            <div class="card-count">{p.cardCount}</div>
            {handOpened ? <div style="color: blue; position: absolute; bottom: 4px; right: 4px;">【手札公開中】</div> : null}
        </div>
    );
}