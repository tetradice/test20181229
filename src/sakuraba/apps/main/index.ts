import { app } from 'hyperapp';
import { withLogger } from "@hyperapp/logger"

import view from './view';
import { actions, ActionsType } from './actions';

export function run(state: state.State, container: Element | null): ActionsType {
    let appFunction = (state.environment === 'development' ? withLogger(app) : app);
    return appFunction(state, actions, view, container);
}