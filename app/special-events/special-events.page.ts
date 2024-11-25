import { Component, OnInit } from '@angular/core'; 

 

import { FirestoreService } from '../firestore.service'; 

import { AuthService } from '../auth.service'; 

import { AngularFireStorage } from '@angular/fire/storage'; 

 

import { FormGroup } from '@angular/forms'; 

import { Subscription } from 'rxjs'; 

 

@Component({ 

  selector: 'app-special-events', 

  templateUrl: './special-events.page.html', 

  styleUrls: ['./special-events.page.scss'], 

}) 

export class SpecialEventsPage implements OnInit { 

 

  categories: any = []; 

  event:any = {active: false, name: '', clicked: false} 

  specialEvent: any = { name: "", active: false }; 

 

  products: any = []; 

  productsF: any = []; 

 

  searchForm: FormGroup; 

  selectedCat:any = []; 

   

  currentUser; 

 

  sub1: Subscription; 
  sub2: Subscription; 

 

  constructor(private authService: AuthService, private fsService: FirestoreService, private storage: AngularFireStorage) { 

     

    // this.sub1 = this.fsService.getSpecialEvent().subscribe((result) => { 

    //   this.specialEvent = result; 

    // }); 

 

    this.fsService.showLoader(); 
    this.sub1 = this.authService.getUserInfo().subscribe((result) => { 
    this.currentUser = result; 
  }) 

 
    this.sub2 = this.fsService.getAllSpecialEventsProducts().subscribe((result) => { 
    this.products = result; 
    this.fsService.hideLoader(); 
  }); 
} 

 

  myFav(id) { 
    if (this.currentUser.favourites != null && this.currentUser.favourites.indexOf(this.products[id].id) > -1) 
      this.products[id].myFav = true; 

    else 
      this.products[id].myFav = false; 
      return this.products[id].myFav; 
  } 

 
  favouriteProduct(id) { 
    if (this.products[id].myFav == null || this.products[id].myFav == false) { 
      this.products[id].myFav = true; 
    } 

    else { 
      this.products[id].myFav = false; 
    } 
    
    this.authService.favouriteProduct(this.products[id].id, this.products[id].myFav) 
  } 

  ngOnInit() { 
  } 

   
  ngOnDestroy() { 
    this.sub1.unsubscribe(); 
    this.sub2.unsubscribe(); 
    } 
  } 