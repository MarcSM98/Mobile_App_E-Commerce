import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageProductsPage } from './manage-products.page';

const routes: Routes = [
  {
    path: '',
    component: ManageProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageProductsPageRoutingModule {}
