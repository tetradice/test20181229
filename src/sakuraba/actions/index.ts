import moveActions from './move';
import logActions from './log';
import cardActions from './card';
import boardActions from './board';

export const actions = Object.assign(moveActions, logActions, cardActions, boardActions);
export type ActionsType = typeof actions;