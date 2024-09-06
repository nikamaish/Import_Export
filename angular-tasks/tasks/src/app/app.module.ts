import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component'; 

//  It declares which components, directives, and services are available to the app, and it imports any other necessary Angular modules or third-party libraries.

// @NgModule takes a metadata object that tells Angular how to compile and launch the application.

@NgModule({  // AppModule is the root module of the Angular application. It is defined using the @NgModule decorator.
  declarations: [
    AppComponent,
    FormComponent 
    // custom components
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
// Angular creates this root component and inserts it into the index.html host web page, typically within a tag like <app-root></app-root>.
})
export class AppModule { }
