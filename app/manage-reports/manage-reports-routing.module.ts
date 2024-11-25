import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageReportsPage } from './manage-reports.page';

const routes: Routes = [
  {
    path: '',
    component: ManageReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageReportsPageRoutingModule {}
