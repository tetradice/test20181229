import { app } from 'hyperapp';
import { withLogger } from "@hyperapp/logger"

import view from './view';
import { actions, ActionsType } from './actions';
import { State } from './state';

export { State }; // 型定義をエクスポート
export function run(state: State, container: Element | null): ActionsType {
    return withLogger(app)(state, actions, view, container);
}