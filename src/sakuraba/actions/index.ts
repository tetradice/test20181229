import logActions from './log';
import cardActions from './card';
import boardActions from './board';
import sakuraTokenActions from './sakuraToken';
import { WiredActions } from '@tetradice/hyperapp-types';

export const actions = Object.assign(logActions, cardActions, boardActions, sakuraTokenActions);
export type ActionsType = WiredActions<state.State, typeof actions>;
