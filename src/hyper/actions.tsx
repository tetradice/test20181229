import * as state from './state'
import { ActionsType, ActionResult } from 'hyperapp';

interface Acts {
    getBoardSide: (side: state.PlayerSide) => (s: state.Root) => state.BoardSide;
}

const actions: ActionsType<state.Root, Acts> = {
    getBoardSide: (side) => (state) => {
        if(side === 1) return state.board.p1Side;
        if(side === 2) return state.board.p2Side;
        return null;
    }
};

export default actions;