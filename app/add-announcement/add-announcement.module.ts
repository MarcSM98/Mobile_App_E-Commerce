import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAnnouncementPageRoutingModule } from './add-announcement-routing.module';

import { AddAnnouncementPage } from './add-announcement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAnnouncementPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddAnnouncementPage]
})
export class AddAnnouncementPageModule {}
