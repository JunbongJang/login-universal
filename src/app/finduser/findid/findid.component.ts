import {Component, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ServerService} from '../../server/server.service';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/reducers/app.reducers';
import {ChangeView, FindUserResult} from '../../store/actions/view-state.actions';

@Component({
  selector: 'app-findid',
  templateUrl: './findid.component.html',
  styleUrls: ['./findid.component.css']
})
export class FindidComponent implements OnInit {

  findIDForm: FormGroup;
  search_info_span = '';

  constructor(private serverService: ServerService,
              private renderer: Renderer2,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.findIDForm = new FormGroup({
      'user_name': new FormControl(null, [Validators.required]), // this.correctID.bind(this)
      'user_email': new FormControl(null, [Validators.required, Validators.email])
    });
  }

  findUserID() {
    if (this.findIDForm.valid) {
      this.search_info_span = '';
      this.serverService.findUserID(this.findIDForm.get('user_name').value, this.findIDForm.get('user_email').value).subscribe(
        (text_data) => {
         if (text_data === '1') {
            this.search_info_span = this.findIDForm.get('user_name').value + '님의 회원 정보를 찾을 수 없습니다';
            this.findIDForm.reset();
          } else {
           this.store.dispatch(new FindUserResult(text_data));
           this.store.dispatch(new ChangeView('find/result'));
         }
        },
        (error) => {
          console.log('error');
          console.log(error);
        });
    } else {
      if (this.findIDForm.get('user_name').invalid) {
        this.search_info_span = '이름을 입력하세요!';
        this.renderer.selectRootElement('#findid_user_name').focus();
      } else if (this.findIDForm.get('user_email').invalid) {
        this.search_info_span = '올바른 이메일을 입력하세요!';
        this.renderer.selectRootElement('#findid_user_email').focus();
      }
    }


  }

}
