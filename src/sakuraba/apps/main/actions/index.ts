
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
import firestoreActions from './firestore';
let actionsTemp7 = Object.assign({}, actionsTemp6, firestoreActions);
import miscActions from './misc';
let actionsTemp8 = Object.assign({}, actionsTemp7, miscActions);
import notifyLogActions from './notifyLog';
let actionsTemp9 = Object.assign({}, actionsTemp8, notifyLogActions);

import { WiredActions } from 'hyperapp-types';

export const actions = actionsTemp9;

export type ActionsType = WiredActions<state.State, typeof actions>;