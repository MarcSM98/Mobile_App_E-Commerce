import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReserveProductPageRoutingModule } from './reserve-product-routing.module';

import { ReserveProductPage } from './reserve-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReserveProductPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ReserveProductPage]
})
export class ReserveProductPageModule {}
