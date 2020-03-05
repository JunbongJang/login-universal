import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subject} from 'rxjs';
import {ServerService} from '../../server/server.service';

declare var daum: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('signup_form', {static: false}) signup_form: NgForm;

  head_array = [];
  academy_array = [];

  login_info = {
    user_id: '',
    user_password: '',
    user_password_confirm: ''
  };

  contact_info = {
    name: '',
    academy_head: '',
    academy_name: '',
    academy_code: '',
    academy_none: false,
    tel_number: '',
    mobile_number: '',
    email: '',
    zipcode: '',
    address1: '',
    address2: ''
  };

  china_info = {
    is_china: false,
    activation_code: ''
  };

  additional_info = {
    photo: '',
    parent_type: '',
    parent_tel: '',
    school_name: '',
    school_type: '',
    grade: '',
    class: ''
  };

  constructor(private serverService: ServerService) {

  }

  ngOnInit() {
    this.getAcademyList('head');
  }

  checkOpenUserID() {
    if (this.login_info.user_id === '') {
      alert('아이디를 입력하세요.');
      return;
    }

    this.serverService.checkUserId(this.login_info.user_id).subscribe(
      (text_data) => {
        text_data = text_data.trim(); // somehow string from php need to be trimmed...
        let alert_string = 'none';
        console.log(text_data);
        if (text_data === 'id_taken') {
          alert_string = '사용할 수 없는 아이디 입니다.';
          this.login_info.user_id = '';
        } else if (text_data === 'id_not_taken') {
          alert_string = '사용할 수 있는 아이디 입니다.';
        } else if (text_data === 'id_deleted') {
          alert_string = '삭제된 아이디입니다. 사용할 수 있습니다.';
        } else if (text_data === 'id_not_valid') {
          alert_string = '6~12자 영문소문자,숫자만 가능합니다.';
          this.login_info.user_id = '';
        }
        alert(alert_string);
      },
      (error) => {
        console.log('error');
        console.log(error);
      });
  }

  getAcademyList(retrieve_type: string, head_number = '0') {
    this.serverService.getAcademyList(retrieve_type, head_number).subscribe(
      (json_data: Array<any>) => {
        this.head_array = json_data;
      },
      (error) => {
        console.log('error');
        console.log(error);
      });
  }

  populateAcademyNames() {
    const a_head_value = this.signup_form.value.head;
    // console.log(a_head_value);

    this.serverService.getAcademyList('academy', a_head_value).subscribe(
      (json_data: Array<any>) => {
        this.academy_array = json_data;
      },
      (error) => {
        console.log('error');
        console.log(error);
      });
  }

  getAcademyCode() {
    const a_academy_value = this.signup_form.value.academy;
    for (const a_academy of this.academy_array) {
      if (a_academy_value === a_academy.value) {
        this.contact_info.academy_code = 'ES' + a_academy.code;
        document.getElementById('code_response').style.display = 'none';
        // console.log('right:' + a_academy.code);
      } else {
      }
    }
  }

  checkAcademyCode(code_input: string) {
    for (const a_academy of this.academy_array) {
      if (this.contact_info.academy_code.replace('ES', '') === a_academy.code) {
        // console.log('code is valid');
        document.getElementById('code_response').style.display = 'none';
        return true;
      }
    }

    document.getElementById('code_response').style.display = 'block';
    // console.log('code is not valid');
    return false;
  }

  toggleIsAcademy() {
    (<HTMLInputElement>document.getElementsByName('head')[0]).disabled = this.contact_info.academy_none;
    (<HTMLInputElement>document.getElementsByName('academy')[0]).disabled = this.contact_info.academy_none;
    (<HTMLInputElement>document.getElementsByName('code')[0]).disabled = this.contact_info.academy_none;
    (<HTMLInputElement>document.getElementsByName('is_china')[0]).disabled = this.contact_info.academy_none;
  }

  // ----------------------------------------------------------

  toggleIsChina() {
    // (<HTMLInputElement>document.getElementsByName('head')[0]).disabled = this.china_info.is_china;
    // (<HTMLInputElement>document.getElementsByName('academy')[0]).disabled = this.china_info.is_china;
    // (<HTMLInputElement>document.getElementsByName('code')[0]).disabled = this.china_info.is_china;
    (<HTMLInputElement>document.getElementsByName('is_demo')[0]).disabled = this.china_info.is_china;


    if (this.china_info.is_china) {
      (<HTMLInputElement>document.getElementsByName('activation_code')[0]).style.display = 'block';
    } else {
      (<HTMLInputElement>document.getElementsByName('activation_code')[0]).style.display = 'none';
    }
  }

  checkActivationCode() {
    console.log('checkActivcationCode: ' + this.china_info.activation_code);
    if (this.china_info.activation_code.length === 36) {
      console.log('length 36');
      this.serverService.checkSerialNumber(this.china_info.activation_code).subscribe(
        (text_data) => {
          console.log('result: ');
          alert(text_data);
        },
        (error) => {
          console.log('Code validation error');
          console.log(error);
        });
    }
  }

  // ----------------------------------------------------------------

  execDaumPostcode() {
    // alert("call execDaumPostcode");
    const that = this;
    new daum.Postcode({
      oncomplete: function(data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        let fullAddr = ''; // 최종 주소 변수
        let extraAddr = ''; // 조합형 주소 변수

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
          fullAddr = data.roadAddress;

        } else { // 사용자가 지번 주소를 선택했을 경우(J)
          fullAddr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
        if (data.userSelectedType === 'R') {
          // 법정동명이 있을 경우 추가한다.
          if (data.bname !== '') {
            extraAddr += data.bname;
          }
          // 건물명이 있을 경우 추가한다.
          if (data.buildingName !== '') {
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
          fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ' ) ' : '');
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        that.contact_info.zipcode = JSON.parse(JSON.stringify(data.zonecode));
        that.contact_info.address1 = JSON.parse(JSON.stringify(fullAddr));

        // 커서를 상세주소 필드로 이동한다.
        document.getElementById('form_address2').focus();
      }
    }).open();
  }

  // using file API to read uploaded image file
  // https://stackoverflow.com/questions/14069421/show-an-image-preview-before-upload
  uploadPhoto(photo_display, image_input) {
    const reader = new FileReader();
    const that = this;

    reader.onload = function (e: any) {
      // get loaded data and render thumbnail.
      photo_display.src = e.target.result;
      // console.log(e.target.result);
      // console.log(that.additional_info.photo);
    };

    // read the image file as a data URL.
    reader.readAsDataURL(image_input.files[0]);
  }

  // --------------------Imported from Join.php-------------------------------------

  join_check() {
    const id_regex = /[a-z0-9-_]{6,}/;
    let valid_id = false;
    if ((<HTMLInputElement>document.getElementsByName('id')[0]).value.match(id_regex) !== null) {
      valid_id = (<RegExpMatchArray>(<HTMLInputElement>document.getElementsByName('id')[0]).value.match(id_regex))[0] ===
        (<HTMLInputElement>document.getElementsByName('id')[0]).value;
    }

    if ((<HTMLInputElement>document.getElementsByName('id')[0]).value === '' || !valid_id) {
      alert('올바른 아이디를 입력해주세요.');
      (<HTMLInputElement>document.getElementsByName('id')[0]).focus();
      return 0;
    }
    if ((<HTMLInputElement>document.getElementsByName('pass_ok')[0]).value !==
      (<HTMLInputElement>document.getElementsByName('pass')[0]).value ||
        (<HTMLInputElement>document.getElementsByName('pass_ok')[0]).value === '') {
      alert('비밀번호나 비밀번호 확인을 다시 입력해주세요.');
      (<HTMLInputElement>document.getElementsByName('pass')[0]).focus();
      return 0;
    }
    if ((<HTMLInputElement>document.getElementsByName('name')[0]).value === '') {
      alert('이름을 입력해주세요.');
      (<HTMLInputElement>document.getElementsByName('name')[0]).focus();
      return 0;
    }
    if (this.contact_info.academy_none === false) {
      const re = new RegExp(/^ES[0-9]{5}/);
      const re2 = new RegExp(/^ES/);

      const re1Test = re.test((<HTMLInputElement>document.getElementsByName('code')[0]).value);
      const re2Test = re2.test((<HTMLInputElement>document.getElementsByName('code')[0]).value);

      const regTest = re1Test || re2Test;

      if ((<HTMLInputElement>document.getElementsByName('academy')[0]).value === '' && !regTest) {
        alert('학원을 선택해주세요.');
        (<HTMLInputElement>document.getElementsByName('academy')[0]).focus();
        return 0;
      }

      if ((<HTMLInputElement>document.getElementsByName('head')[0]).value === '' && !regTest) {
        alert('본부를 선택해주세요.');
        (<HTMLInputElement>document.getElementsByName('head')[0]).focus();
        return 0;
      }
      if (!regTest) {
        alert('잘못된 학원코드입니다.');
        (<HTMLInputElement>document.getElementsByName('code')[0]).focus();
        return 0;
      }
    }

    if ((<HTMLInputElement>document.getElementsByName('phone1')[0]).value === '') {
      alert('전화번호를 입력해주세요.');
      (<HTMLInputElement>document.getElementsByName('phone1')[0]).focus();
      return 0;
    }

    if ((<HTMLInputElement>document.getElementsByName('email')[0]).value === '') {
      alert('email을 입력해주세요.');
      (<HTMLInputElement>document.getElementsByName('email')[0]).focus();
      return 0;
    }

    const mailexp = /[a-z0-9]{2,}@[a-z0-9-]{2,}\.[a-z0-9]{2,}/i;
    if (!mailexp.test((<HTMLInputElement>document.getElementsByName('email')[0]).value)) {
      alert('email을 정확히 입력 하세요.');
      (<HTMLInputElement>document.getElementsByName('email')[0]).focus();
      return 0;
    }

    if ((<HTMLInputElement>document.getElementsByName('zipcode')[0]).value === '' ||
      (<HTMLInputElement>document.getElementsByName('address1')[0]).value === '' ||
        (<HTMLInputElement>document.getElementsByName('address2')[0]).value === '') {
      alert('주소를 정확히 입력해주세요. 세줄 다 입력해야합니다');
      (<HTMLInputElement>document.getElementsByName('address1')[0]).focus();
      return 0;
    }

    (<HTMLFormElement>document.getElementsByName('join_form')[0]).submit();

    return 1;
  }



  onSubmit() {
    if (this.join_check() === 1) {
      this.serverService.postUserRegistration(this.signup_form.value).subscribe(
        (text_data) => {
          console.log('success!!');
          console.log(text_data);
        },
        (error) => {
          console.log('error');
          console.log(error);
        });
    }
  }

}
