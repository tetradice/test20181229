import moveActions from './move';
import logActions from './log';

export const actions = Object.assign(moveActions, logActions);
export type ActionsType = typeof actions;