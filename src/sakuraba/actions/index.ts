import logActions from './log';
import cardActions from './card';
import boardActions from './board';
import * as acts from '../typings/actions'

export const actions = Object.assign(logActions, cardActions, boardActions);
export type ActionsType = acts.WiredActions<state.State, typeof actions>;
