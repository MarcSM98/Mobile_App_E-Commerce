import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAnnouncementPage } from './add-announcement.page';

const routes: Routes = [
  {
    path: '',
    component: AddAnnouncementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAnnouncementPageRoutingModule {}
