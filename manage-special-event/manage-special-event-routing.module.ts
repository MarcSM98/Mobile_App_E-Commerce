import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageSpecialEventPage } from './manage-special-event.page';

const routes: Routes = [
  {
    path: '',
    component: ManageSpecialEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageSpecialEventPageRoutingModule {}
