import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, tap } from "rxjs";
//import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from "../store/app.reducer"
import * as RecipesActions from "../recipes/store/recipes.actions"

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    //private authService: AuthService
    private store: Store<fromApp.AppState>
  ) { }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http.put('https://ng-complete-guide-b633f-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        // console.log(response);
      })
  }

  getRecipes() {
    return this.http.get<Recipe[]>('https://ng-complete-guide-b633f-default-rtdb.firebaseio.com/recipes.json',)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
          })
        }),
        tap(recipes => {
          // this.recipesService.setRecipes(recipes);
          this.store.dispatch(new RecipesActions.SetRecipes(recipes));
        })
      );
  }
}