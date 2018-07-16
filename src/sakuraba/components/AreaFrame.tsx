import { h } from "hyperapp";
import * as sakuraba from '../../sakuraba';

/** 領域枠 */
interface Param {
    left: number;
    top: number;
    width: number;
    height: number;

    cardCount?: number;
}

export const AreaFrame = (p: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left}px`
        , top: `${p.top}px`
        , width: `${p.width}px`
        , height: `${p.height}px`
        , position: 'relative'
    };

    return (
        <div class="area background ui segment" style={styles}>
            <div class="card-count">{p.cardCount}</div>
        </div>
    );
}