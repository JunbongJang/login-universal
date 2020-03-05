import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {ChangeView} from '../../store/actions/view-state.actions';
import * as fromApp from '../../store/reducers/app.reducers';
declare var $: any;

@Component({
  selector: 'app-agree',
  templateUrl: './agree.component.html',
  styleUrls: ['./agree.component.css']
})
export class AgreeComponent implements OnInit {

  @ViewChild('agree_form', {static: false}) agree_form: NgForm;

  agree_form_value = {
    agree_1: 'false',
    agree_2: 'false',
    user_type: 'none'
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  openPopup(page: string, name: string, width: string, height: string, top: string, left: string) {
    window.open(page, name, 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left + 'toolbar=no,resize=no,scrollbars=no');
    window.close();
  }

  onSubmit() {
    if (this.agree_form_value.agree_1 === 'false') {
        alert('이용약관에 동의하셔야 합니다.');
        $('#agree_1').trigger('focus');
        return false;
    }
    if (this.agree_form_value.agree_2 === 'false') {
        alert('개인정보 수집에 동의하셔야 합니다.');
        $('#agree_2').trigger('focus');
        return false;
    }
    if (this.agree_form_value.user_type === 'none') {
      alert('회원 유형을 선택해주세요.');
      return false;
    } else if (this.agree_form_value.user_type === 'teacher') {
      alert('교사는 직접 가입이 불가능하며,\nEMS 에서 학원장 권한으로 등록해줄 수 있습니다.\n(학원관리 -> 강사관리 -> 등록)');
      return false;
    } else if (this.agree_form_value.user_type === 'parents') {
      alert('학부모 회원가입은 학원에 문의하세요.');
      return false;
    }

    this.store.dispatch(new ChangeView('signup/register'));
  }

}
