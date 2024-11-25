import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopOverSharePage } from './pop-over-share.page';

const routes: Routes = [
  {
    path: '',
    component: PopOverSharePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopOverSharePageRoutingModule {}
