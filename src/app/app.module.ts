import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app.component';

import { localService } from "./local.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    localService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
