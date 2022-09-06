import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
//import { AuthService } from './auth.service';
import * as fromApp from "../store/app.reducer"
import * as AuthActions from "../auth/store/auth.actions"

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(
    //private authService: AuthService, 
    //private router: Router, 
    private store: Store<fromApp.AppState>) { }
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: any = '';
  storeSub: Subscription;
  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;

    })
  }

  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    //let authObs: Observable<AuthResponseData>;
    if (!authForm.valid) {
      return;
    }
    //this.isLoading = true;
    if (this.isLoginMode) {
      //authObs = this.authService.login(authForm.value.email, authForm.value.password)
      this.store.dispatch(new AuthActions.LoginStart({ email: authForm.value.email, password: authForm.value.password }))
    } else {
      //authObs = this.authService.signUp(authForm.value.email, authForm.value.password)
      this.store.dispatch(new AuthActions.SingUpStart({ email: authForm.value.email, password: authForm.value.password }))
    }

    // authObs.subscribe(
    //   response => {
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   errorMessage => {
    //     this.isLoading = false;
    //     this.error = errorMessage;
    //   }
    // )

    authForm.reset();
  }

  onHandleError() {
    // this.error = null;
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

}
