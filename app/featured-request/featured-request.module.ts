import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeaturedRequestPageRoutingModule } from './featured-request-routing.module';

import { FeaturedRequestPage } from './featured-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeaturedRequestPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FeaturedRequestPage]
})
export class FeaturedRequestPageModule {}
