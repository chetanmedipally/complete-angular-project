import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { User } from "./user.model";
//import { environment } from "src/environments/environment";
import * as fromApp from "../auth/store/auth.reducer"
import * as AuthActions from "../auth/store/auth.actions"
import { Store } from "@ngrx/store";
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    //private http: HttpClient, 
    //private router: Router, 
    private store: Store<fromApp.State>) { }
  //user = new BehaviorSubject<User | null>(null);
  private autoLogoutTimer: any

  // signUp(email: string, password: string) {
  //   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKEy,
  //     {
  //       email: email,
  //       password: password,
  //       returnSecureToken: true
  //     }
  //   ).pipe(
  //     catchError(errorRes => this.handleError(errorRes)),
  //     tap(responseData => {
  //       this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn)
  //     })
  //   );
  // }

  // login(email: string, password: string) {
  //   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKEy,
  //     {
  //       email: email,
  //       password: password,
  //       returnSecureToken: true
  //     }
  //   ).pipe(
  //     catchError(errorRes => this.handleError(errorRes)),
  //     tap(responseData => {
  //       this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn)
  //     })
  //   );
  // }

  // autoLogin() {
  //   const userData: {
  //     email: string;
  //     id: string;
  //     _token: string;
  //     _tokenExpirationDate: string;
  //   } = JSON.parse(<string>localStorage.getItem('userData'));
  //   if (!userData) {
  //     return;
  //   }
  //   const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

  //   if (loadedUser.token) {
  //     //this.user.next(loadedUser);
  //     this.store.dispatch(new AuthActions.AuthenticateSuccess(loadedUser));
  //     const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
  //     this.autoLogout(expirationDuration)
  //   }
  // }

  setLogoutTimer(expirationDuration: number) {
    this.autoLogoutTimer = setTimeout(() => {
      //this.logout();
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }
  }

  // logout() {
  //   //this.user.next(null);
  //   this.store.dispatch(new AuthActions.Logout());
  //   this.router.navigate(['/auth']);
  //   localStorage.removeItem('userData');
  //   if (this.autoLogoutTimer) {
  //     clearTimeout(this.autoLogoutTimer);
  //   }
  //   this.autoLogoutTimer = null;
  // }

  // private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
  //   const tokenExpirationDate = new Date(new Date().getTime() + +expiresIn * 1000)
  //   const user = new User(email, userId, token, tokenExpirationDate);
  //   // this.user.next(user);
  //   this.store.dispatch(new AuthActions.AuthenticateSuccess(user));
  //   this.autoLogout(expiresIn * 1000)
  //   localStorage.setItem('userData', JSON.stringify(user));
  // }

  // private handleError(errorRes: HttpErrorResponse) {
  //   let errorMessage = 'An unexpected error has occured!';
  //   switch (errorRes?.error?.error?.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'User already exists'
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'User not found'
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'Invalid Password'
  //       break;

  //   }
  //   return throwError(() => new Error(errorMessage));
  // }
}