import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SaleStatisticsPageRoutingModule } from './sale-statistics-routing.module';

import { SaleStatisticsPage } from './sale-statistics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaleStatisticsPageRoutingModule
  ],
  declarations: [SaleStatisticsPage]
})
export class SaleStatisticsPageModule {}
