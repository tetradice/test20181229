import { h } from "hyperapp";
import { ActionsType } from "../actions";

/** プレイヤー名 */
export const PlayerNameDisplay = (p: {side: PlayerSide, left: number, top: number, width: number}) => (state: state.State, actions: ActionsType) => {
    // 名前未決定の場合は表示しない
    if(!state.board.playerNames[p.side]){
        return null;
    }

    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${p.width * state.zoom}px`
        , position: 'absolute'
        , fontWeight: 'bold'
        , textAlign: 'center'
    };

    return <div style={styles}>{state.board.playerNames[p.side]}</div>;
}