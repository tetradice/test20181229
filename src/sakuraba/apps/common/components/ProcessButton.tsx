import { h } from "hyperapp";

export const ProcessButton = (p: {
      left: number
    , top: number
    , zoom: number
    , onclick: Function
    , disabled?: boolean
    , primary?: boolean
}, children: JSX.Element) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * p.zoom}px`
        , top: `${p.top * p.zoom}px`
        , width: `${240 * p.zoom}px`
        , height: `${50 * p.zoom}px`
        , position: 'absolute'
    };

    return <button class={`ui button` + (p.disabled ? ' disabled' : '') + (p.primary ? ' primary' : '')} style={styles} onclick={p.onclick}>{children}</button>
}