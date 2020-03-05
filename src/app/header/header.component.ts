import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {ChangeView} from '../store/actions/view-state.actions';
import * as fromApp from '../store/reducers/app.reducers';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {environment} from '../../environments/environment.prod';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isCollapsed = false;
  public header_view_state = '';
  public environment_chinese = environment.chinese;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('view_state').subscribe(
      (a_view) => {
        if (a_view !== undefined) {
          this.header_view_state = a_view[0].current_view;
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }

  homepageClick() {
    window.open('/', '_self');
  }

  viewStateChoose(clicked_view_state: string) {
    this.store.dispatch(new ChangeView(clicked_view_state));
  }

  setHeaderLogoImage() {
    if (environment.chinese) {
      return 'assets/img/welleastern_chinese_logo_horizontal.png';
    } else {
      return 'assets/img/welleastern_logo.svg';
    }
  }

  // https://angularfirebase.com/lessons/bootstrap-4-collapsable-navbar-work-with-angular/

}
