import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopOverSharePageRoutingModule } from './pop-over-share-routing.module';

import { PopOverSharePage } from './pop-over-share.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopOverSharePageRoutingModule
  ],
  declarations: [PopOverSharePage]
})
export class PopOverSharePageModule {}
