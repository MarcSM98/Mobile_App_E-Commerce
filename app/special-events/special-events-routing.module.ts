import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router'; 
import { SpecialEventsPage } from './special-events.page'; 

 const routes: Routes = [ 
  { 
    path: '', 
    component: SpecialEventsPage 
  } 
]; 

 
@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule], 
}) 

export class SpecialEventsPageRoutingModule {} 