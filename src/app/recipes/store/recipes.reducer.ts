import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipes.actions";
export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
}
export function recipesReducer(state = initialState, action: Action) {
  const recipesActions = action as RecipesActions.Actions;
  // console.log(recipesActions.type);
  switch (recipesActions.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...recipesActions.payload]
      }
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, recipesActions.payload]
      }
    case RecipesActions.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[recipesActions.payload.index],
        ...recipesActions.payload.newRecipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[recipesActions.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: updatedRecipes
      }
    case RecipesActions.DELETE_RECIPE:
      // console.log(state);
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== recipesActions.payload;
        })
      }
  }
  // console.log(state)
  return state;
}