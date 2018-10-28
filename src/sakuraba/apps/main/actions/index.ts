
import chatLogActions from './chatLog';
let actionsTemp1 = Object.assign({}, chatLogActions);
import actionLogActions from './actionLog';
let actionsTemp2 = Object.assign({}, actionsTemp1, actionLogActions);
import cardActions from './card';
let actionsTemp3 = Object.assign({}, actionsTemp2, cardActions);
import boardActions from './board';
let actionsTemp4 = Object.assign({}, actionsTemp3, boardActions);
import sakuraTokenActions from './sakuraToken';
let actionsTemp5 = Object.assign({}, actionsTemp4, sakuraTokenActions);
import settingActions from './setting';
let actionsTemp6 = Object.assign({}, actionsTemp5, settingActions);
import miscActions from './misc';
let actionsTemp7 = Object.assign({}, actionsTemp6, miscActions);

import { WiredActions } from 'hyperapp-types';
import board from './board';

export const actions = actionsTemp7;

export type ActionsType = WiredActions<state.State, typeof actions>;