import { Component, OnInit } from '@angular/core';
import * as ViewStateActions from '../store/actions/view-state.actions';
import { Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/reducers/app.reducers';
import {ChangeView, LoginGoto} from '../store/actions/view-state.actions';

@Component({
  selector: 'app-finduser',
  templateUrl: './finduser.component.html',
  styleUrls: ['./finduser.component.css']
})
export class FinduserComponent implements OnInit {

  finduser_current_view = '';

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {

    this.store.select('view_state').subscribe(
      (a_view) => {
        if (a_view !== undefined) {
          // console.log('signup componenet view_state: ' + a_view[0].current_view);
          if (a_view[0].current_view === ViewStateActions.FIND_ID_STATE ||
            a_view[0].current_view === ViewStateActions.FIND_PASS_STATE ||
            a_view[0].current_view === ViewStateActions.FIND_RESULT_STATE) {
            this.finduser_current_view = a_view[0].current_view;
            // this.router.navigate([a_view[0].current_view]);
          } else if (a_view[0].current_view === 'find') {
            this.store.dispatch(new ChangeView('find/id'));
          }
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }

  finduserChangeView(view_state: string) {
    this.store.dispatch(new ChangeView(view_state));
  }

}
