import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageProductsPageRoutingModule } from './manage-products-routing.module';

import { ManageProductsPage } from './manage-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageProductsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ManageProductsPage]
})
export class ManageProductsPageModule {}
