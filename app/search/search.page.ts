import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  categories: any = [];
  event:any = {active: false, name: '', clicked: false}

  products: any = [];
  productsF: any = [];

  searchForm: FormGroup;
  selectedCat:any = [];

  currentUser;

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;

  count = 0;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.showLoader();

    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
      this.hideLoader();
    })
   
    this.searchForm = formBuilder.group({
      'search': '',
    });
    
    this.sub2 = this.fsService.getActiveCategories().subscribe(result => {
      this.categories = result;
      for (let i =0; i < this.categories.length; i++) {
        this.categories[i].clicked = false;
      }
      this.hideLoader();
    });

    this.sub3 = this.fsService.getAllActiveProducts().subscribe(result => {
      this.products = result;

      /*for (let i = 0; i < this.products.length; i++) {
        this.storage.ref(this.products[i].images[0]).getDownloadURL().subscribe((img) => {
          this.products[i].images[0] = img;
        });
      }*/
      this.hideLoader();
    });

    this.sub4 = this.fsService.getSpecialEvent().subscribe(result => {
      this.event = result;
      this.event.clicked = false;
      this.hideLoader();
    });

    this.searchForm.get("search").valueChanges.subscribe(query => {
      this.productsF = this.products.filter((el) => {
        return el.name.toLowerCase().includes(query.toLowerCase()) && (this.selectedCat.length == 0 || (this.selectedCat.length > 0 && this.selectedCat.indexOf(el.category) > -1)) && (this.event.clicked == false || (this.event.clicked == true && el.specialevent == this.event.clicked));
      });
    });
  }

  ngOnInit() {
  }

  hideLoader() {
    this.count++;
    if (this.count == 4) this.fsService.hideLoader();
  }

  toggleCat(i) { 
    if (this.categories[i].clicked) {
      var index = this.selectedCat.indexOf(this.categories[i].name);
      if (index !== -1) this.selectedCat.splice(index, 1);
    }
    else {
      this.selectedCat.push(this.categories[i].name)
    }
    this.categories[i].clicked = !this.categories[i].clicked;

    this.productsF = this.products.filter((el) => {
      return el.name.toLowerCase().includes(this.searchForm.value.search.toLowerCase()) && (this.selectedCat.length == 0 || (this.selectedCat.length > 0 && this.selectedCat.indexOf(el.category) > -1)) && (this.event.clicked == false || (this.event.clicked == true && el.specialevent == this.event.clicked));
    });  
  }

  toggleEvent() { 
    this.event.clicked = !this.event.clicked;

    this.productsF = this.products.filter((el) => {
      return el.name.toLowerCase().includes(this.searchForm.value.search.toLowerCase()) && (this.selectedCat.length == 0 || (this.selectedCat.length > 0 && this.selectedCat.indexOf(el.category) > -1)) && (this.event.clicked == false || (this.event.clicked == true && el.specialevent == this.event.clicked));
    });
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  }
}
