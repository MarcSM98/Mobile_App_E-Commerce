import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellerReviewPageRoutingModule } from './seller-review-routing.module';

import { SellerReviewPage } from './seller-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerReviewPageRoutingModule
  ],
  declarations: [SellerReviewPage]
})
export class SellerReviewPageModule {}
