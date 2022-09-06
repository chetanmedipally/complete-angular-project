import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SpinnerComponent } from "../spinner/spinner.component";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";

@NgModule({
  declarations: [
    DropdownDirective,
    SpinnerComponent,
    AlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownDirective,
    SpinnerComponent,
    AlertComponent,
    CommonModule
  ]
})
export class SharedModule { }