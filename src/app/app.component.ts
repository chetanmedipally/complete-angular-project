import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import * as fromApp from "../app/store/app.reducer"
import { Store } from "@ngrx/store";
import * as AuthActions from "../app/auth/store/auth.actions"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLogin());
  }

  // oddNumbers: number[] = [];
  // evenNumbers: number[] = [];
  // menuSelected: String = "recipes";

  // onIntervalFired(firedNumber: number) {
  //   if (firedNumber % 2 === 0) {
  //     this.evenNumbers.push(firedNumber);
  //   } else {
  //     this.oddNumbers.push(firedNumber);
  //   }
  // }

  // onMenuSelect(menuType: String) {
  //   this.menuSelected = menuType;
  // }
}
