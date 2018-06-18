import { h } from "hyperapp";

/** 集中力 */
export const Vigor = (params: {target: state.Vigor, left: number, top: number}) => (state: state.State, actions) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${40}px`
        , top: `${20}px`
    };
    return <div class="fbs-vigor-card" id={'board-object-' + params.target.id}>
        <div class="vigor0"></div>
        <div class="vigor1"></div>
        <div class="vigor2"></div>
    </div>;
}