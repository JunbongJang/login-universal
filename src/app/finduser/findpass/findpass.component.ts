import {Component, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ServerService} from '../../server/server.service';
import {Store} from '@ngrx/store';
import {ChangeView, FindUserResult} from '../../store/actions/view-state.actions';
import * as fromApp from '../../store/reducers/app.reducers';

@Component({
  selector: 'app-findpass',
  templateUrl: './findpass.component.html',
  styleUrls: ['./findpass.component.css']
})
export class FindpassComponent implements OnInit {

  findPassForm: FormGroup;
  search_info_span = '';
  message_being_sent = false;

  constructor(private serverService: ServerService,
              private renderer: Renderer2,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.findPassForm = new FormGroup({
      'user_id': new FormControl(null, [Validators.required]),
      'user_name': new FormControl(null, [Validators.required]),
      'user_email': new FormControl(null, [Validators.required, Validators.email])
    });
  }

  findUserPassword() {
    if (this.findPassForm.valid) {
      this.message_being_sent = true;
      this.search_info_span = '';
      this.serverService.findUserPassword(this.findPassForm.get('user_id').value, this.findPassForm.get('user_name').value, this.findPassForm.get('user_email').value).subscribe(
        (text_data) => {
          // console.log('success: ' + text_data);
          if (text_data.includes('비밀번호를 이메일로 발송했습니다')) {
            this.store.dispatch(new FindUserResult(text_data));
            this.store.dispatch(new ChangeView('find/result'));
          } else {
            this.search_info_span = text_data;
            this.findPassForm.reset();
          }
          this.message_being_sent = false;
        },
        (error) => {
          console.log('error');
          console.log(error);
        });
    } else {
      if (this.findPassForm.get('user_id').invalid) {
        this.search_info_span = '아이디를 입력하세요!';
        this.renderer.selectRootElement('#findpass_user_id').focus();
      } else if (this.findPassForm.get('user_name').invalid) {
        this.search_info_span = '이름을 입력하세요!';
        this.renderer.selectRootElement('#findpass_user_name').focus();
      } else if (this.findPassForm.get('user_email').invalid) {
        this.search_info_span = '올바른 이메일을 입력하세요!';
        this.renderer.selectRootElement('#findpass_user_email').focus();
      }
    }
  }

}
