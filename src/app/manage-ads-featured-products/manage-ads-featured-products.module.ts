import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageAdsFeaturedProductsPageRoutingModule } from './manage-ads-featured-products-routing.module';

import { ManageAdsFeaturedProductsPage } from './manage-ads-featured-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAdsFeaturedProductsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ManageAdsFeaturedProductsPage]
})
export class ManageAdsFeaturedProductsPageModule {}
