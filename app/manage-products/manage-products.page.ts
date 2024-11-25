import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.page.html',
  styleUrls: ['./manage-products.page.scss'],
})
export class ManageProductsPage implements OnInit {

  products = [];
  productsF = [];
  productsForm: FormGroup;

  sub1: Subscription;

  constructor(private alertController: AlertController, private formBuilder: FormBuilder, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.showLoader();
    
    this.productsForm = formBuilder.group({
      'search': '',
      'filter': '1',
    });

    this.sub1 = this.fsService.getAllProducts().subscribe((result) => {
      this.products = result;
      /*for (let i = 0; i < this.products.length; i++) {
        this.storage.ref(this.products[i].images[0]).getDownloadURL().subscribe((img) => {
          this.products[i].images[0] = img;
        });
      }*/

      var filter = this.productsForm == null ? '1' : this.productsForm.value.filter

      if (this.products != null) {
        if (filter == 1) this.productsF = this.products;
        else {
          this.productsF = this.products.filter(function (el) {
            if (filter == 2) return el.featured == true;
            else return el.featured == false;
          });
        }
      }

      this.fsService.hideLoader();
    });

    this.productsForm.get("search").valueChanges.subscribe(query => {
      var filter = this.productsForm == null ? '1' : this.productsForm.value.filter

      this.productsF = this.products.filter((el) => {
        if (filter == 1) return (el.seller_un.toLowerCase().includes(query.toLowerCase()) || el.name.toLowerCase().includes(query.toLowerCase()));
        else if (filter == 2) return (el.seller_un.toLowerCase().includes(query.toLowerCase())  || el.name.toLowerCase().includes(query.toLowerCase())) && el.featured == true;
        else return (el.seller_un.toLowerCase().includes(query.toLowerCase()) || el.name.toLowerCase().includes(query.toLowerCase())) && el.featured == false;
      });
    });
  }

  async confirmAlert(id) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.deleteProduct(id);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteProduct(id) {
    this.fsService.deleteProduct(id);
  }

  onFilterChange($event) {
    var filter = $event.target.value;
    var query = this.productsForm.value.search;

    this.productsF = this.products.filter((el) => {
      if (filter == 1) return (el.seller_un.toLowerCase().includes(query.toLowerCase()) || el.name.toLowerCase().includes(query.toLowerCase()));
      else if (filter == 2) return (el.seller_un.toLowerCase().includes(query.toLowerCase()) || el.name.toLowerCase().includes(query.toLowerCase())) && el.featured == true;
      else return (el.seller_un.toLowerCase().includes(query.toLowerCase()) || el.name.toLowerCase().includes(query.toLowerCase())) && el.featured == false;
    });
  }

  ngOnInit() {
  }

  public segment: string = 'all';

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

}
