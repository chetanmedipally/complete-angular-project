import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
//import { AuthService } from '../auth/auth.service';
//import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from "../store/app.reducer"
import { Store } from "@ngrx/store";
import * as AuthActions from "../auth/store/auth.actions"
import * as RecipeActions from "../recipes/store/recipes.actions"
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  userSus: Subscription;
  constructor(
    //private dataStorageService: DataStorageService,
    //private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    // this.userSus = this.authService.user.subscribe(user => {
    //   this.isAuthenticated = !user ? false : true;
    // });
    this.userSus = this.store.select('auth').pipe(map(authData => authData.user)).subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }
  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }
  onLoadData() {
    // this.dataStorageService.getRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    //this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy(): void {
    this.userSus.unsubscribe();
  }
}
