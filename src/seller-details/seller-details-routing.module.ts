import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerDetailsPage } from './seller-details.page';

const routes: Routes = [
  {
    path: '',
    component: SellerDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerDetailsPageRoutingModule {}
