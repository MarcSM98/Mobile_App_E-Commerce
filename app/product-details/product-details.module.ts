import { PopOverSharePage } from './../pop-over-share/pop-over-share.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailsPageRoutingModule } from './product-details-routing.module';

import { ProductDetailsPage } from './product-details.page';
import { PopOverSharePageModule } from '../pop-over-share/pop-over-share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsPageRoutingModule,
    PopOverSharePageModule
  ],
  declarations: [ProductDetailsPage]
})
export class ProductDetailsPageModule { }
