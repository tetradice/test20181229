import logActions from './log';
import cardActions from './card';
import boardActions from './board';
import sakuraTokenActions from './sakuraToken';
import miscActions from './misc';
import { WiredActions } from '@tetradice/hyperapp-types';

let actionsTemp = Object.assign(logActions, cardActions, boardActions, sakuraTokenActions);
let actionsTemp2 = Object.assign(actionsTemp, miscActions);

export const actions = actionsTemp2;

export type ActionsType = WiredActions<state.State, typeof actions>;
