import moveActions from './move';
import logActions from './log';
import cardActions from './card';

export const actions = Object.assign(moveActions, logActions, cardActions);
export type ActionsType = typeof actions;