import {ActionReducerMap} from '@ngrx/store';
import * as fromViewState from './view-state.reducers';
import {ViewStateModels} from '../models/view-state.models';

export interface AppState {
  view_state: ViewStateModels[];
}

export const reducers: ActionReducerMap<AppState> = {
  view_state: fromViewState.viewStateReducer
};
