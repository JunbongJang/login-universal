import { Action } from '@ngrx/store';
import { ViewStateModels } from '../models/view-state.models';
import * as ViewStateActions from '../actions/view-state.actions';

// Section 1
const initialState1: ViewStateModels = {
  current_view: ViewStateActions.LOGIN_STATE
};
const initialState2: ViewStateModels = {
  current_view: ViewStateActions.LOGIN_STATE
};
const initialState3: ViewStateModels = {
  current_view: ViewStateActions.FIND_RESULT_STATE
};

// Section 2
export function viewStateReducer(state: ViewStateModels[] = [initialState1, initialState2, initialState3], action: ViewStateActions.ViewStateActions) {

  // Section 3
  switch (action.type) {
    case ViewStateActions.CHANGE_VIEW:
      // console.log('CHANGE_VIEW: ' + action.payload);
      state[0].current_view = action.payload;
      return [...state];

    case ViewStateActions.LOGIN_GOTO:
      // console.log('LOGIN_GOTO: ' + action.payload);
      state[1].current_view = action.payload;
      return [...state];

    case ViewStateActions.FIND_USER_RESULT:
      // console.log('FIND_USER_RESULT: ' + action.payload);
      state[2].current_view = action.payload;
      return [...state];


    default:
      console.log('view-state DEFAULT');
      return state;
  }
}
