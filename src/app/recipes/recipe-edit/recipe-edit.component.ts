import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
//import { RecipeService } from '../recipe.service';
import * as fromApp from "../../store/app.reducer"
import * as RecipeActions from "../store/recipes.actions";
import { Store } from '@ngrx/store';
import { map, Subscription, take } from 'rxjs';
@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
    //private recipeService: RecipeService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }
  id: number;
  editMode: boolean = false;
  recipeForm: UntypedFormGroup;
  storeSus: Subscription;
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm()
      }
    )
  }

  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    );
    if (this.editMode) {
      //this.recipeService.updateRecipe(this.id, newRecipe);
      this.store.dispatch(new RecipeActions.UpdateRecipe({ index: this.id, newRecipe }))
    } else {
      //this.recipeService.addRecipe(newRecipe);
      this.store.dispatch(new RecipeActions.AddRecipe(newRecipe));
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<UntypedFormArray>this.recipeForm.get('ingredients')).push(
      new UntypedFormGroup({
        'name': new UntypedFormControl(null, Validators.required),
        'amount': new UntypedFormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route })
  }

  onDeleteIngredient(index: number) {
    (<UntypedFormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new UntypedFormArray([]);

    if (this.editMode) {
      //const recipe = this.recipeService.getRecipe(this.id)
      this.storeSus = this.store.select('recipes').pipe(
        map((recipeState) => {
          // console.log(recipeState);
          return recipeState.recipes.find((recipe: Recipe, index: number) => {
            return index === this.id;
          })
        })
      ).subscribe(recipe => {
        // console.log(recipe);
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new UntypedFormGroup({
                'name': new UntypedFormControl(ingredient.name, Validators.required),
                'amount': new UntypedFormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
          }
        }
      })
    }

    this.recipeForm = new UntypedFormGroup({
      'name': new UntypedFormControl(recipeName, Validators.required),
      'imagePath': new UntypedFormControl(recipeImagePath, Validators.required),
      'description': new UntypedFormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  get controls() {
    return (<UntypedFormArray>this.recipeForm.get('ingredients')).controls;
  }

  ngOnDestroy(): void {
    if (this.storeSus) {
      this.storeSus.unsubscribe();
    }
  }
}
