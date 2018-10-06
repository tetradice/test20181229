import logActions from './log';
import cardActions from './card';
import boardActions from './board';
import sakuraTokenActions from './sakuraToken';
import miscActions from './misc';
import { WiredActions } from 'hyperapp-types';

let actionsTemp = Object.assign({}, logActions, cardActions, boardActions);
let actionsTemp2 = Object.assign({}, actionsTemp, sakuraTokenActions, miscActions);

export const actions = actionsTemp2;

export type ActionsType = WiredActions<state.State, typeof actions>;