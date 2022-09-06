import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap, take, map } from "rxjs";
import { AuthService } from "./auth.service";
import * as fromApp from "../store/app.reducer"
import { Store } from "@ngrx/store";
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) { }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return this.authService.user.pipe(
  //     take(1),
  //     exhaustMap(user => {
  //       if (!user) {
  //         return next.handle(req);
  //       } else {
  //         const modifiedReq = req.clone({ params: new HttpParams().set('auth', <string>user?.token) })
  //         return next.handle(modifiedReq)
  //       }
  //     }))
  // }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map(authData => authData.user),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        } else {
          const modifiedReq = req.clone({ params: new HttpParams().set('auth', <string>user?.token) })
          return next.handle(modifiedReq)
        }
      }))
  }
}