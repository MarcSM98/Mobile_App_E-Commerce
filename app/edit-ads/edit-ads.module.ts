import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAdsPageRoutingModule } from './edit-ads-routing.module';

import { EditAdsPage } from './edit-ads.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAdsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditAdsPage]
})
export class EditAdsPageModule {}
