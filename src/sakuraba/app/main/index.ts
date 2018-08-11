import { app } from 'hyperapp';
import { withLogger } from "@hyperapp/logger"

import view from './view';
import { actions, ActionsType } from './actions';

export function createInitialState(): any{
    return {};
}

export function launch(state: any, container: Element | null): ActionsType {
    return withLogger(app)(state, actions, view, container);
} 