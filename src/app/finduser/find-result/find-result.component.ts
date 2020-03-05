import { Component, OnInit } from '@angular/core';
import {ChangeView} from '../../store/actions/view-state.actions';
import * as ViewStateActions from '../../store/actions/view-state.actions';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/reducers/app.reducers';

@Component({
  selector: 'app-find-result',
  templateUrl: './find-result.component.html',
  styleUrls: ['./find-result.component.css']
})
export class FindResultComponent implements OnInit {

  find_user_result = '';

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    this.store.select('view_state').subscribe(
      (a_view) => {
        if (a_view !== undefined) {
          this.find_user_result = a_view[2].current_view;
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }

}
