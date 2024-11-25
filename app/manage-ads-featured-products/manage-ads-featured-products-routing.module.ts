import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageAdsFeaturedProductsPage } from './manage-ads-featured-products.page';

const routes: Routes = [
  {
    path: '',
    component: ManageAdsFeaturedProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAdsFeaturedProductsPageRoutingModule {}
