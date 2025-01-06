import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirestoreService } from '../firestore.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-featured-request',
  templateUrl: './featured-request.page.html',
  styleUrls: ['./featured-request.page.scss'],
})
export class FeaturedRequestPage implements OnInit {

  products: any;
  featuredForm: FormGroup;
  //selectedImage;
  originalImage;

  currentUser;

  sub1: Subscription;
  sub2: Subscription;

  constructor(private alertController: AlertController, private formBuilder: FormBuilder, private authService: AuthService, private fsService: FirestoreService, private storage: AngularFireStorage) {

    this.featuredForm = formBuilder.group({
      selectedProduct: [],
      paymentMode: 'PayLah',
    });

    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    
      if (result != null) {
          this.sub2 = this.fsService.getMyUnfeaturedProducts(this.currentUser.email).subscribe((data) => {
            this.products = data;
            this.featuredForm.controls.selectedProduct.setValue([this.products[0].name, 0, this.products[0].id]);
            this.originalImage = this.products[0].images[0];
            /*this.storage.ref(this.products[0].images[0]).getDownloadURL().subscribe((img) => {
              this.selectedImage = img;
            });*/
          });
      }
    });
  }

  onProductChange($event) {
    var index = $event.target.value[1];
    this.originalImage = this.products[index].images[0];

    /*this.storage.ref(this.products[index].images[0]).getDownloadURL().subscribe((img) => {
      this.selectedImage = img;
    });*/
  }

  async confirmAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Proceed with feature request?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.newFeaturedRequest();
          }
        }
      ]
    });
  
    await alert.present();
  }

  newFeaturedRequest() {
    this.fsService.addFeaturedRequest(this.originalImage, this.featuredForm.value.selectedProduct[2], this.featuredForm.value.selectedProduct[0], this.featuredForm.value.paymentMode, this.currentUser.email, this.currentUser.username);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
