import { h } from "hyperapp";

/** 桜花結晶 */
export const SakuraToken = (p: {target: state.SakuraToken, left: number, top: number}) => (state: state.State, actions) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left}px`
        , top: `${p.top}px`
    };

    let draggable = true;
    return <div 
      class="sakura-token"
      draggable={draggable}
      data-object-id={p.target.id}
      data-region={p.target.region}
      ondragstart={(elem) => { $(elem).popup('hide all'); actions.sakuraTokenDragStart(p.target); }}
      ondragend={() => actions.sakuraTokenDragEnd()}
      id={'board-object-' + p.target.id}
      key={'sakura-token-' + p.target.id}
      style={styles}>
    </div>;
}