import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDetailsPageRoutingModule } from './chat-details-routing.module';

import { ChatDetailsPage } from './chat-details.page';

import { NbChatModule } from '@nebular/theme';
import { NbIconModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule } from '@nebular/theme'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatDetailsPageRoutingModule,
    NbChatModule,
    NbIconModule,
    NbSidebarModule,
    NbLayoutModule
  ],
  declarations: [ChatDetailsPage]
})
export class ChatDetailsPageModule { }
