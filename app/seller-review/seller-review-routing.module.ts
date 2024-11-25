import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerReviewPage } from './seller-review.page';

const routes: Routes = [
  {
    path: '',
    component: SellerReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerReviewPageRoutingModule {}
