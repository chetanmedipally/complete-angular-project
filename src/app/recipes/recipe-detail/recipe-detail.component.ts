import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
//import { RecipeService } from '../recipe.service';
import * as fromApp from "../../store/app.reducer"
import * as RecipeActions from "../store/recipes.actions";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(
    //private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        //this.recipe = this.recipeService.getRecipe(+params['id']) as Recipe;
        this.store.select('recipes')
          .pipe(
            map(recipeState => {
              return recipeState.recipes.find((recipe: Recipe, index: number) => {
                return index === this.id;
              })
            })
          )
          .subscribe(recipe => {
            this.recipe = recipe
          })
      })
  }

  onAddToShoppingList() {
    //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onDelete() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
