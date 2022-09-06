import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
//import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

import { Ingredient } from '../shared/ingredient.model';
//import { ShoppingListService } from './shopping-list.service';
import * as fromApp from "../../app/store/app.reducer";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions'
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  igSusciption: Subscription;
  // ingredients: Ingredient[];
  ingredients: Observable<{ ingredients: Ingredient[] }>
  constructor(
    //private shoppingListService: ShoppingListService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.igSusciption = this.shoppingListService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
    //   this.ingredients = ingredients;
    // })
    // this.recipeService.selectedRecipe.subscribe((receivedRecipe: Recipe) => {
    //   console.log(receivedRecipe)
    //   this.ingredients.concat(receivedRecipe.ingredients);
    // })

  }
  onEditItem(index: number) {
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy(): void {
    //this.igSusciption.unsubscribe();
  }
}
