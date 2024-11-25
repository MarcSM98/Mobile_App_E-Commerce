import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageSpecialEventPageRoutingModule } from './manage-special-event-routing.module';

import { ManageSpecialEventPage } from './manage-special-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageSpecialEventPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ManageSpecialEventPage]
})
export class ManageSpecialEventPageModule {}
