import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AgreeComponent} from './signup/agree/agree.component';
import {RegisterComponent} from './signup/register/register.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {FindidComponent} from './finduser/findid/findid.component';
import {FinduserComponent} from './finduser/finduser.component';
import {FindpassComponent} from './finduser/findpass/findpass.component';
import {FindResultComponent} from './finduser/find-result/find-result.component';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full'},
  { path: 'signup', component: SignupComponent, children: [
      { path: 'agree', component: AgreeComponent },
      { path: 'register', component: RegisterComponent }
    ] },
  { path: 'login', component: LoginComponent },
  { path: 'find', component: FinduserComponent, children: [
      { path: 'id', component: FindidComponent },
      { path: 'pass', component: FindpassComponent },
      { path: 'result', component: FindResultComponent }
    ] },

  // routes get parsed from top to bottom so  always put this double asterisk at the end
  { path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true, paramsInheritanceStrategy: 'always'})
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
