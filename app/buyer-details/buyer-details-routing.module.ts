import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyerDetailsPage } from './buyer-details.page';

const routes: Routes = [
  {
    path: '',
    component: BuyerDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyerDetailsPageRoutingModule {}
