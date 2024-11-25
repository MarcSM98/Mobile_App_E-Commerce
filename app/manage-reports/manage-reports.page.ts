import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-reports',
  templateUrl: './manage-reports.page.html',
  styleUrls: ['./manage-reports.page.scss'],
})
export class ManageReportsPage implements OnInit {

  products = [];
  productsF = [];
  productsForm: FormGroup;

  sub1: Subscription;

  constructor(private formBuilder: FormBuilder, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.showLoader();
    this.productsForm = formBuilder.group({
      'search': '',
      'filter': '2'
    });

    this.sub1 = this.fsService.getAllReports().subscribe((result) => {
      this.products = result;
      /*for (let i = 0; i < this.products.length; i++) {
        this.storage.ref(this.products[i].image).getDownloadURL().subscribe((img) => {
          this.products[i].image = img;
        });
      }*/

      var filter = this.productsForm == null ? '2' : this.productsForm.value.filter

      if (this.products != null) {
        if (filter == 1) this.productsF = this.products;
        else {
          this.productsF = this.products.filter(function (el) {
            if (filter == 2) return el.status == 'P';
            else return el.status == 'A';
          });
        }
      }
      this.fsService.hideLoader();
    });

    this.productsForm.get("search").valueChanges.subscribe(query => {
      var filter = this.productsForm == null ? '2' : this.productsForm.value.filter

      this.productsF = this.products.filter((el) => {
        if (filter == 1) return (el.message.toLowerCase().includes(query.toLowerCase()) || el.productName.toLowerCase().includes(query.toLowerCase()));
        else if (filter == 2) return (el.message.toLowerCase().includes(query.toLowerCase())  || el.productName.toLowerCase().includes(query.toLowerCase())) && el.status == 'P';
        else return (el.message.toLowerCase().includes(query.toLowerCase()) || el.productName.toLowerCase().includes(query.toLowerCase())) && el.status == 'A';
      });
    });
  }

  markAsAttended(id) {
    this.fsService.markAsAttended(id);
  }

  onFilterChange($event) {
    var filter = $event.target.value;
    var query = this.productsForm.value.search;

    this.productsF = this.products.filter((el) => {
      if (filter == 1) return (el.message.toLowerCase().includes(query.toLowerCase()) || el.productName.toLowerCase().includes(query.toLowerCase()));
      else if (filter == 2) return (el.message.toLowerCase().includes(query.toLowerCase()) || el.productName.toLowerCase().includes(query.toLowerCase())) && el.status == 'P';
      else return (el.message.toLowerCase().includes(query.toLowerCase()) || el.productName.toLowerCase().includes(query.toLowerCase())) && el.status == 'A';
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

}
