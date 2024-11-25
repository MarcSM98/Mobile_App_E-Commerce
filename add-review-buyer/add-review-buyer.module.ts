import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddReviewBuyerPageRoutingModule } from './add-review-buyer-routing.module';

import { AddReviewBuyerPage } from './add-review-buyer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReviewBuyerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddReviewBuyerPage]
})
export class AddReviewBuyerPageModule {}
