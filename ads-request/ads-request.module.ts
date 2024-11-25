import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdsRequestPageRoutingModule } from './ads-request-routing.module';

import { AdsRequestPage } from './ads-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdsRequestPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AdsRequestPage]
})
export class AdsRequestPageModule {}
