import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Register2PageRoutingModule } from './register2-routing.module';

import { Register2Page } from './register2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Register2PageRoutingModule,
	  ReactiveFormsModule
  ],
  declarations: [Register2Page]
})
export class Register2PageModule {}
