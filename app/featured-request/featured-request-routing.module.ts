import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeaturedRequestPage } from './featured-request.page';

const routes: Routes = [
  {
    path: '',
    component: FeaturedRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturedRequestPageRoutingModule {}
