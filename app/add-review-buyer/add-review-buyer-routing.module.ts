import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddReviewBuyerPage } from './add-review-buyer.page';

const routes: Routes = [
  {
    path: '',
    component: AddReviewBuyerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddReviewBuyerPageRoutingModule {}
