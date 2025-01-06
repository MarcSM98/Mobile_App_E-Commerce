import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeaturedProductsPageRoutingModule } from './featured-products-routing.module';

import { FeaturedProductsPage } from './featured-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeaturedProductsPageRoutingModule
  ],
  declarations: [FeaturedProductsPage]
})
export class FeaturedProductsPageModule {}
