import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SchedulerComponent } from './scheduler/scheduler.component';

import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { DialogsModule } from "@progress/kendo-angular-dialog";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { InputsModule } from "@progress/kendo-angular-inputs";

import { IntlModule } from "@progress/kendo-angular-intl";

@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    SchedulerModule,
    CommonModule,
    DialogsModule,
    ButtonsModule,
    InputsModule,
    FormsModule,
    IntlModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
