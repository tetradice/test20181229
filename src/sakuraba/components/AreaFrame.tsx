import { h } from "hyperapp";
import * as sakuraba from '../../sakuraba';

/** 領域枠 */
interface Param {
    left: number;
    top: number;
    width: number;
    height: number;
}

export const AreaFrame = (params: Param) => (state: state.State) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${params.left}px`
        , top: `${params.top}px`
        , width: `${params.width}px`
        , height: `${params.height}px`
        , position: 'relative'
    };

    return (
        <div class="area background ui segment" style={styles}>
        </div>
    );
}