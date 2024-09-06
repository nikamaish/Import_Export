import { Component } from '@angular/core';
import { FormComponent } from './form/form.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-angular-app';
}
