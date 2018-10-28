import { h } from "hyperapp";

interface Param {
    left: number;
    top: number;
    width: number;

    tokenCount: number;
}

export const MasterDistanceCaption = (p: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , position: 'absolute'
        , width: `${p.width * state.zoom}px`
        , height: `${48 * state.zoom}px`
        , color: 'silver'
        , zIndex: '2'
        , textAlign: 'right'
        , fontSize: `${10 * state.zoom}px`
        , paddingRight: `${8 * state.zoom}px`
    };

    return (
        <div style={styles}>達人の間合: {p.tokenCount}</div>
    );
}