import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAdsPage } from './edit-ads.page';

const routes: Routes = [
  {
    path: '',
    component: EditAdsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAdsPageRoutingModule {}
