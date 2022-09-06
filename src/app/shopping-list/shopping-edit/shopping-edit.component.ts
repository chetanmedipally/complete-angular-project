import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
//import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromApp from "../../../app/store/app.reducer";
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;

  constructor(
    //private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>) { }
  editingSuscription: Subscription
  editMode: boolean;
  editedItem: Ingredient;
  ngOnInit() {

    this.editingSuscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
      else {
        this.editMode = false;
      }
    })
    // this.editingSuscription = this.shoppingListService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editItemIndex = index;
    //     this.editedItem = this.shoppingListService.getIngredient(index);
    //     this.slForm.setValue({
    //       name: this.editedItem.name,
    //       amount: this.editedItem.amount
    //     })
    //   }
    // )
  }

  ngOnDestroy(): void {
    this.editingSuscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit(form: NgForm) {
    const newIngredient: Ingredient = {
      name: form.value.name,
      amount: form.value.amount
    }
    if (this.editMode) {
      //this.shoppingListService.editIngredient(this.editItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient)
        // index: this.editItemIndex, 
      );
    }
    else {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear()
  }
}
