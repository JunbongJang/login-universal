import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ViewStateModels} from './store/models/view-state.models';
import {ChangeView, LoginGoto} from './store/actions/view-state.actions';
import * as fromApp from './store/reducers/app.reducers';
import {Title} from '@angular/platform-browser';
import * as ViewStateActions from './store/actions/view-state.actions';
import {environment} from '../environments/environment.prod';
import * as Bowser from 'bowser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  view_states: Observable<ViewStateModels[]>;
  app_view_state = '';

  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private route: ActivatedRoute,
              private titleService: Title) {
  }

  ngOnInit() {
    const url = new URL(window.location.href);
    console.log(window.location.href);
    console.log(Bowser.parse(window.navigator.userAgent).platform.type);

    let goto_url = url.searchParams.get('goto');
    // if (Bowser.parse(window.navigator.userAgent).platform.type === 'mobile') {
    //   if (goto_url.includes('www.easternschool.co.kr')) { // reroute the mobile user to mobile friendly page
    //     goto_url = 'https://www.welleastern.co.kr/onacademy/korea.html';
    //   }
    // }

    const route_type = url.searchParams.get('route_type');

    this.view_states = this.store.select('view_state');
    this.view_states.subscribe(
      (a_view) => {
        if (a_view !== undefined && a_view[0].current_view !== null) {
          // console.log('app componenet view_state: ' + a_view[0].current_view);
          this.app_view_state = a_view[0].current_view;
          this.setTitleForState(a_view[0].current_view);
          window.scroll(0, 0);
         this.router.navigate([a_view[0].current_view]);

        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );

    if (route_type === null || route_type === '') {
      // nothing, go to default page which is login page.
    } else if (route_type.indexOf('find') === 0) {
      this.store.dispatch(new ChangeView('find/id'));
    } else if (route_type.indexOf('signup') === 0) {
      this.store.dispatch(new ChangeView('signup/agree'));
    } else {
      // nothing, go to default page.
    }

    if (goto_url === null || goto_url === '') {
        goto_url = '/';
    }
    this.store.dispatch(new LoginGoto(goto_url));
  }

  setTitleForState(current_state: string) {
    if (environment.chinese) {
      if (current_state === ViewStateActions.LOGIN_STATE) {
        this.titleService.setTitle('WellEastern Login');

      } else if (current_state === ViewStateActions.SIGNUP_AGREE_STATE) {
        this.titleService.setTitle('WellEastern Signup');
      } else if (current_state === ViewStateActions.FIND_ID_STATE) {
        this.titleService.setTitle('WellEastern Find ID');
      }
    } else {
      if (current_state === ViewStateActions.LOGIN_STATE) {
        this.titleService.setTitle('웰이스턴 로그인');
      } else if (current_state === ViewStateActions.SIGNUP_AGREE_STATE) {
        this.titleService.setTitle('웰이스턴 회원가입');
      } else if (current_state === ViewStateActions.FIND_ID_STATE) {
        this.titleService.setTitle('웰이스턴 ID/PW 찾기');
      }
    }
  }

}
