import { h } from "hyperapp";

/** 桜花結晶 */
export const SakuraToken = (params: {target: state.SakuraToken}) => (state: state.State, actions) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${40}px`
        , top: `${20}px`
    };
    return <div class="sakura-token" draggable="true" id={'board-object-' + params.target.id} styles={styles}></div>;
}