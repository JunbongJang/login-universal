import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {concatMap, flatMap, mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'multipart/form-data'
    })
  };

  constructor(private httpClient: HttpClient) { }

  // ------------------------------Find User------------------------------
  findUserID(user_name: string, user_email: string) {
    return this.httpClient.get('/user/php/findId.php?name=' + user_name + '&email=' + user_email, {responseType: 'text'});
  }

  findUserPassword(user_id: string, user_name: string, user_email: string) {
    return this.httpClient.get('/user/php/findPass.php?name=' + user_name + '&email=' + user_email + '&id=' + user_id, {responseType: 'text'});
  }

  // -----------------------------User Login-----------------------------
  loginUser(user_id: string, user_pass: string, goto_url: string) {
    const body = {
      'id': user_id,
      'pass': user_pass,
      'retUrl2': goto_url
    };
    return this.httpClient.post('/user/php/loginExec.php',
      body, { headers: {'Content-Type': 'application/json'}, responseType: 'text'}); // text because i don't control this file
  }

  loginEasternUser(user_id: string, user_pass: string) {
    const body = {
      'userid': user_id,
      'passwd': user_pass
    };
    return this.httpClient.post(location.protocol + '//www.easternschool.co.kr/login_proc_json.php',
      body, { headers: {'Content-Type': 'application/json'}, responseType: 'text'});
  }

  loginUpenglishUser(user_id: string, user_pass: string, goto_url: string) {
    return this.loginUser(user_id, user_pass, goto_url).pipe(
      concatMap(() => {
        return this.loginSaySay(user_id, user_pass);
      }),
      concatMap(() => {
        return this.loginHelloIris(user_id, user_pass);
      })
    );
  }

  loginSaySay(user_id: string, user_pass: string) {
    const body = {
      'user_id': user_id,
      'passwd': user_pass
    };

    return this.httpClient.post(location.protocol + '//cvst.welleastern.co.kr/newSay/login_json.php',
      body, { headers: {'Content-Type': 'application/json'}, responseType: 'text'});
  }

  loginHelloIris(user_id: string, user_pass: string) {
    const body = {
      'user_id': user_id,
      'passwd': user_pass
    };
    // localStorage.setItem('Hello_user_id', user_id);
    // localStorage.setItem('Hello_password', user_pass);

    return this.httpClient.post(location.protocol + '//cvst.welleastern.co.kr/newHello/login_json.php',
      body, { headers: {'Content-Type': 'application/json'}, responseType: 'text'});
  }

  loginVocabTraining(user_id: string, user_pass: string) {
    const body = {
      'userid': user_id,
      'passwd': user_pass
    };
    // localStorage.setItem('vocab_training_user_id', user_id);
    // localStorage.setItem('vocab_training_password', user_pass);

    return this.httpClient.post(location.protocol + '//voca.welleastern.co.kr/login_proc_json.php',
      body, { headers: {'Content-Type': 'application/json'}, responseType: 'text'});
  }

  checkLoggedInUser() {
    return this.httpClient.get('/user/php/loginCheck.php', {responseType: 'text'});
  }

  // -----------------------------User Registration----------------------
  checkUserId(user_id: string) {
    return this.httpClient.get('/user/php/dubleCheck.php?id=' + user_id, {responseType: 'text'}); // text because i don't control this file
  }

  getAcademyList(retrieve_type: string, head_number = '0') {
    return this.httpClient.get('/user/php/mysqlRetrieve.php?retrieve=' + retrieve_type + '&head_number=' + head_number, {responseType: 'json'});
  }

  checkSerialNumber(serial_number: string) {
    return this.httpClient.get('/user/php/mysqlRetrieve.php?serial=' + serial_number, {responseType: 'json'});
  }

  /*
  not using currently. Instead, I just html submit the form
   */
  postUserRegistration(form: HTMLFormElement) {
    // const body = new FormData();
    // body.append('level', '3');
    return this.httpClient.post('/user/php/join_ok.php', form, {responseType: 'json'});
  }
}
