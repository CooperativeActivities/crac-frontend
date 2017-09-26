import {Directive, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";

@Directive({
  selector: '[phoneNumber]',
  providers: [{provide: NG_VALIDATORS, useExisting: PhoneNumberValidator, multi: true}]
})

export class PhoneNumberValidator implements Validator {
  @Input() phoneNumber: String;

  validate(control: AbstractControl): {valid: boolean} {
    let validNumber = new RegExp(/^(\+|\d)[0-9]{7,16}$/);
    if(control.value && !validNumber.test(control.value)) {
      return {
        valid: false
      };
    }
    return null;
  }
}
