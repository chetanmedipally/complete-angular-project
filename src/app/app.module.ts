import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GameControlComponent } from './game/game-control/game-control.component';
import { OddComponent } from './game/odd/odd.component';
import { EvenComponent } from './game/even/even.component';

import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { CodeModule } from './code.module';
import * as fromApp from "../app/store/app.reducer"
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { RecipeEffects } from './recipes/store/recipes.effects';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameControlComponent,
    OddComponent,
    EvenComponent,
    PageNotFoundComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CodeModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
