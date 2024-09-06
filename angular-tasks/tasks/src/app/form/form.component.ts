import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-form',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  myForm: FormGroup;

  // formbuilder is class and fb is instance

  constructor(private fb: FormBuilder) {  // It injects an instance of FormBuilder into the component's constructor.
    this.myForm = this.fb.group({
      from: ['', [Validators.required, this.stringValidator]], // initial value empty, and validators to check validations
      to: ['', [Validators.required, this.stringValidator]],
      hsn: ['', Validators.required]
    });
  }




  // AbstractControl:- It provides methods and properties to interact with and validate form controls, such as the value property, which contains the current value of the control.
  // control is the form control to validate.

  stringValidator(controller: AbstractControl): ValidationErrors | null {
    const value = controller.value;
    if (typeof value === 'string' && isNaN(Number(value))) {
      return null; // Valid string
    }
    return { notString: true }; // Invalid if numeric
  }


  onImport() {
    if (this.myForm.valid) { // check whether fields are valid
      const fromValue = this.myForm.get('from')?.value; // Retrieves the current value of the from form control.
      const toValue = this.myForm.get('to')?.value;
      const hsnValue = this.myForm.get('hsn')?.value;
      console.log('Importing HSN:', hsnValue, 'from', fromValue, 'to', toValue);
    }
  }

  onExport() {  // it is same like import 
    if (this.myForm.valid) {
      const fromValue = this.myForm.get('from')?.value;
      const toValue = this.myForm.get('to')?.value;
      const hsnValue = this.myForm.get('hsn')?.value;
      console.log('Exporting HSN:', hsnValue, 'from', fromValue, 'to', toValue);
    }
  }
}
