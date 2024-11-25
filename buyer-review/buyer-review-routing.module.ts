import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyerReviewPage } from './buyer-review.page';

const routes: Routes = [
  {
    path: '',
    component: BuyerReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyerReviewPageRoutingModule {}
