import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from "../../store/app.reducer"
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[] = [];
  recipeChangedSus: Subscription;
  constructor(
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.recipeChangedSus = this.store
      .select('recipes')
      .pipe(map(recipeState => recipeState.recipes))
      .subscribe(
        //this.recipeChangedSus = this.recipeService.recipesChanged.subscribe(
        (recipes: Recipe[]) => {

          this.recipes = recipes;
        }
      )
    //this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.recipeChangedSus.unsubscribe();
  }

}
