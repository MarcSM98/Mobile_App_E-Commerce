import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatDetailsPage } from './chat-details.page';

const routes: Routes = [
  {
    path: '',
    component: ChatDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatDetailsPageRoutingModule {}
