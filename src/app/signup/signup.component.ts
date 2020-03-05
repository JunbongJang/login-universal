import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import * as ViewStateActions from '../store/actions/view-state.actions';
import {ChangeView} from '../store/actions/view-state.actions';
import * as fromApp from '../store/reducers/app.reducers';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
    this.store.select('view_state').subscribe(
      (a_view) => {
        if (a_view !== undefined) {
          // console.log('signup componenet view_state: ' + a_view[0].current_view);
          if (a_view[0].current_view === ViewStateActions.SIGNUP_AGREE_STATE ||
            a_view[0].current_view === ViewStateActions.SIGNUP_REGISTER_STATE) {
            // this.router.navigate([a_view[0].current_view]);
          } else if (a_view[0].current_view === 'signup') {
            this.store.dispatch(new ChangeView('signup/agree'));
          }
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }

}
