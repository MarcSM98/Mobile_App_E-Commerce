import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reserve-product',
  templateUrl: './reserve-product.page.html',
  styleUrls: ['./reserve-product.page.scss'],
})
export class ReserveProductPage implements OnInit {

  product: any = {};
  reserveForm: FormGroup;
  currentUser;

  sub1: Subscription;
  sub2: Subscription

  constructor(private alertController: AlertController, private authService: AuthService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.showLoader();
    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    })

    this.reserveForm = formBuilder.group({
      'deliveryMode': '',
      'paymentMode': 'Paylah',
      'qty': '1'
    });

  }

  ngOnInit() {
    // Get the id that was passed with the URL
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    // Retrieve the product information through fsService
    this.sub2 = this.fsService.getProductById(id).subscribe(result => {
      this.product = result;
      this.product.id = id;
      this.product.mainImage = this.product.images[0];
      this.reserveForm.controls.deliveryMode.setValue(this.product.deliveryMode[0]);

      /*for (let i = 0; i < this.product.images.length; i++) {
        this.storage.ref(this.product.images[i]).getDownloadURL().subscribe((img) => {
          this.product.images[i] = img;
        });
      }*/
      this.fsService.hideLoader();
    });
  }

  async confirmAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Proceed with order reservation?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.reserveProduct();
          }
        }
      ]
    });
  
    await alert.present();
  }

  reserveProduct() {
    this.fsService.addOrder(this.product.name, this.product.seller, this.currentUser.email, this.product.id, parseInt(this.reserveForm.value.qty), this.reserveForm.value.deliveryMode, this.reserveForm.value.paymentMode, this.product.price, this.product.mainImage, this.product.qty - parseInt(this.reserveForm.value.qty), this.currentUser.username, this.product.seller_un)
  }

  products = {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
  };

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
