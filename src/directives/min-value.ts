import {Directive, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";

@Directive({
  selector: '[minValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValueValidator, multi: true}]
})

export class MinValueValidator implements Validator {
  @Input() minValue: number;

  validate(control: AbstractControl): {valid: boolean} {
    if(control.value && control.value < this.minValue) {
      return {
        valid: false
      };
    }
    return null;
  }
}
