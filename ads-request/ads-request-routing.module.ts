import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdsRequestPage } from './ads-request.page';

const routes: Routes = [
  {
    path: '',
    component: AdsRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdsRequestPageRoutingModule {}
