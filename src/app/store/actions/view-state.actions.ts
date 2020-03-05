// Section 1
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

// Section 2
export const CHANGE_VIEW = 'CHANGE_VIEW';
export const LOGIN_GOTO = 'LOGIN_GOTO';
export const FIND_USER_RESULT = 'FIND_USER';

export const LOGIN_STATE  = 'login';
export const SIGNUP_REGISTER_STATE  = 'signup/register';
export const SIGNUP_AGREE_STATE  = 'signup/agree';
export const FIND_ID_STATE  = 'find/id';
export const FIND_PASS_STATE  = 'find/pass';
export const FIND_RESULT_STATE  = 'find/result';



// Section 3
export class ChangeView implements Action {
  readonly type = CHANGE_VIEW;

  constructor(public payload: string) {
  }
}

export class LoginGoto implements  Action {
  readonly type = LOGIN_GOTO;

  constructor(public payload: string) {
  }
}

export class FindUserResult implements  Action {
  readonly type = FIND_USER_RESULT;

  constructor(public payload: string) {
  }
}

// Section 4
export type ViewStateActions = ChangeView | LoginGoto | FindUserResult;
