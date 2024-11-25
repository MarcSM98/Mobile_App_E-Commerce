import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeaturedProductsPage } from './featured-products.page';

const routes: Routes = [
  {
    path: '',
    component: FeaturedProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturedProductsPageRoutingModule {}
