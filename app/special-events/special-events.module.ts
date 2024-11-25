import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { SpecialEventsPageRoutingModule } from './special-events-routing.module'; 
import { SpecialEventsPage } from './special-events.page'; 

 
@NgModule({ 
  imports: [ 
    CommonModule, 
    FormsModule, 
    IonicModule, 
    SpecialEventsPageRoutingModule 
  ], 
  declarations: [SpecialEventsPage] 
}) 

export class SpecialEventsPageModule {}