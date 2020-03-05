import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ServerService} from '../server/server.service';
import {Store} from '@ngrx/store';
import {ChangeView} from '../store/actions/view-state.actions';
import * as fromApp from '../store/reducers/app.reducers';
import {concatMap, mergeMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  goto_url = '';
  login_failed = false;

  constructor(private serverService: ServerService,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'user_id': new FormControl(null, [Validators.required]), // this.correctID.bind(this)
      'user_pass': new FormControl(null, [Validators.required])
    });

    this.store.select('view_state').subscribe(
      (a_view) => {
        if (a_view !== undefined && a_view[1].current_view !== null) {
          // console.log('login componenet view_state: ' + a_view[1].current_view);
          this.goto_url = a_view[1].current_view;
          // this.checkLoggedInUser();
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }

  /**
   * validator for user id
   * @param {FormControl} control
   * @returns {{[p: string]: boolean}}
   */
  correctID(control: FormControl): {[s: string]: boolean} {
    if (control !== null && control.value !== null) {
      const id_regex = /[a-z0-9-_]{6,}/;
      console.log(control.value.match(id_regex) );
      let valid_id = false;
      if (control.value.match(id_regex) !== null) {
        valid_id = (<RegExpMatchArray>control.value.match(id_regex))[0] === control.value;
      }
      if (valid_id) {
        return null;
      } else {
        return {'answerIsWrong': true};
      }
    }
    return null;
  }

  loginUser() {
    if (this.goto_url.includes('/IMENTOR/') || this.goto_url.includes('easternschool.')) {

      forkJoin([
        this.serverService.loginEasternUser(this.loginForm.get('user_id').value, this.loginForm.get('user_pass').value),
        this.serverService.loginUser(this.loginForm.get('user_id').value, this.loginForm.get('user_pass').value, this.goto_url)
      ]).subscribe( responseList => {
            console.log('loginUser response: ' + responseList);
            // alert(responseList[0]);
            // console.log(responseList[1]);
            if (responseList[1].includes('successfully logged in: ')) {
              this.login_failed = false;
              if (this.goto_url === '') {
                window.open('/', '_self');
              } else {
                window.open(this.goto_url, '_self');
              }
            } else {
              this.login_failed = true;
              this.loginForm.reset();
            }
          }, (error) => {
            alert('error: HTTP connection denied');
            console.log(error);
          });
    } else {
      forkJoin([
        // this.serverService.loginHelloIris(this.loginForm.get('user_id').value, this.loginForm.get('user_pass').value),
        // this.serverService.loginSaySay(this.loginForm.get('user_id').value, this.loginForm.get('user_pass').value),
        // this.serverService.loginVocabTraining(this.loginForm.get('user_id').value, this.loginForm.get('user_pass').value),
        this.serverService.loginUser(this.loginForm.get('user_id').value, this.loginForm.get('user_pass').value, this.goto_url)
      ]).subscribe( responseList => {
            console.log('response list: ');
            console.log(responseList[0]);
            // console.log(responseList[1]);
            // console.log(responseList[2]);

            // important!!!, the index should equal the index of last item in the fork join list.
            if (responseList[0].includes('successfully logged in: ')) {
              this.login_failed = false;
              if (this.goto_url === '') {
                window.open('/', '_self');
              } else {
                if (this.goto_url.includes('voca.welleastern.co.kr/')) {
                  window.open(this.goto_url + '?userid=' + this.loginForm.get('user_id').value + '&password=' + this.loginForm.get('user_pass').value, '_self');
                } else {
                  window.open(this.goto_url, '_self');
                }
              }
            } else {
              this.login_failed = true;
              this.loginForm.reset();
            }
          },
          (error) => {
            alert('error: HTTP connection denied');
            console.log(error);
         });
    }

  }

  // https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
  isMobileAndTablet() {
    let check = false;
    (function(a) {
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent || navigator.vendor || (<any>window).opera);
    return check;
  }

  checkLoggedInUser() {
    this.serverService.checkLoggedInUser().subscribe(
      (loggedin_reply) => {
        console.log('checkLoggedInUser: ' + loggedin_reply);
        if (loggedin_reply.indexOf('Already Logged in, ') === 0) {
          this.login_failed = false;
          if (this.goto_url === '') {
            window.open('/', '_self');
          } else {
            window.open(this.goto_url, '_self');
          }
        }
      },
      (error) => {
        alert('error: HTTP connection denied');
        console.log(error);
      }
    );
  }

  viewStateChoose(clicked_view_state: string) {
    this.store.dispatch(new ChangeView(clicked_view_state));
  }

}
