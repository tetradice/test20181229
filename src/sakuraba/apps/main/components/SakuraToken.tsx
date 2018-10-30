import { h } from "hyperapp";

/** 桜花結晶 */
export const SakuraToken = (p: {
    target: state.SakuraToken
  , left: number
  , top: number
}) => (state: state.State, actions) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${26 * state.zoom}px`
        , height: `${26 * state.zoom}px`
    };

    let draggable = true;
    return <div 
      class={`sakura-token${p.target.artificial ? (p.target.ownerSide === 'p1' ? ' artificial p1' : ' artificial p2') : ''}`}
      data-object-id={p.target.id}
      data-side={p.target.side || 'none'}
      data-region={p.target.region}
      data-linked-card-id={p.target.linkedCardId || 'none'}
      data-region-index={p.target.indexOfRegion}
      data-group={p.target.group}
      data-dragging-count={p.target.groupTokenDraggingCount}
      id={'board-object-' + p.target.id}
      key={'sakura-token-' + p.target.id}
      style={styles}>
    </div>;
}