import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { environment } from "../../../environments/environment"
import { catchError, map, of, switchMap, tap } from "rxjs";
import * as AuthActions from "./auth.actions"
import { User } from "../user.model";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

const handleAuthentication = (resData: AuthResponseData) => {
  const tokenExpirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
  const user = new User(resData.email, resData.localId, resData.idToken, tokenExpirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: resData.email,
    userId: resData.localId,
    token: resData.idToken,
    expirationDate: tokenExpirationDate,
    redirect: true
  });
}
const handleError = (errorRes: any) => {
  let errorMessage = 'An unexpected error has occured!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage))
  }
  switch (errorRes?.error?.error?.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'User already exists'
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'User not found'
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid Password'
      break;

  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) { }

  authSignUp = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signUpAction: AuthActions.SingUpStart) => {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKEy,
          {
            email: signUpAction.payload.email,
            password: signUpAction.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(resData => {
            return handleAuthentication(resData);
          }),
          catchError(errorRes => {
            return handleError(errorRes)
          }),
        );
      })
    )
  })

  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKEy,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(resData => {
            return handleAuthentication(resData);
          }),
          catchError(errorRes => {
            return handleError(errorRes)
          }),
        );
      })
    );
  })

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(<string>localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'DUMMY' };
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

        if (loadedUser.token) {
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration)

          //this.user.next(loadedUser);
          return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });

          // this.autoLogout(expirationDuration)
        }
        return { type: 'DUMMY' }
      })
    );
  });

  authRedirect = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
        if (authSuccessAction.payload.redirect) {
          this.router.navigate(['/']);
        }
      })
    )
  }, { dispatch: false })

  authLogout = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    )
  }, { dispatch: false })

}