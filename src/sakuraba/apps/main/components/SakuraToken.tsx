import { h } from "hyperapp";

/** 桜花結晶 */
export const SakuraToken = (p: {target: state.SakuraToken, left: number, top: number, draggingCount: number}) => (state: state.State, actions) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${26 * state.zoom}px`
        , height: `${26 * state.zoom}px`
    };

    let draggable = true;
    return <div 
      class="sakura-token"
      draggable={draggable}
      data-object-id={p.target.id}
      data-side={p.target.side}
      data-region={p.target.region}
      data-region-index={p.target.indexOfRegion}
      data-dragging-count={p.draggingCount}
      id={'board-object-' + p.target.id}
      key={'sakura-token-' + p.target.id}
      style={styles}>
    </div>;
}