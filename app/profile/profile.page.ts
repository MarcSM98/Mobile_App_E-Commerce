import { AlertController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirestoreService } from '../firestore.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';            // Open URL in either phone or browser
import { AppAvailability } from '@ionic-native/app-availability/ngx';       // Check if the app is installed in the phone

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [InAppBrowser, AppAvailability]          // Change
})
export class ProfilePage implements OnInit {

  user: any = { fullname: '', email: '', role: '', username: '', description: '', school: '', course: '', socialPlatform: []};     // Change

  products: any;
  sales: any;
  purchases: any;  

  salesF: any;
  purchasesF: any;

  salesForm: FormGroup;
  purchasesForm: FormGroup;

  myFavourites: any = [];

  public segment: string = 'inventory';

  currentUser;

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;

  constructor(private formBuilder: FormBuilder, private fsService: FirestoreService, 
    private storage: AngularFireStorage, private authService: AuthService, 
    private alertController: AlertController,
    private platform: Platform,                    // Change
    private inAppBrowser: InAppBrowser,            // Change
    private appAvailability: AppAvailability) {    // Change
    this.fsService.showLoader();

    this.salesForm = formBuilder.group({
      'search': '',
      'filter': 'Reserved',
    });

    this.purchasesForm = formBuilder.group({
      'search': '',
      'filter': 'Reserved',
    });

    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
      if (this.currentUser.email != '' && this.currentUser.role == 0) {
        this.fsService.hideLoader();
      }
      else if (this.currentUser.email != '') {
        if (this.currentUser.role == 2 || this.currentUser.role == 3) {
          // Get Products
          this.sub2 = this.fsService.getMyProducts(this.currentUser.email).subscribe((data) => {
            this.products = data;
            /*for (let i = 0; i < this.products.length; i++) {
               for (let j = 0; j < this.products[i].images.length; j++) {
                 this.storage.ref(this.products[i].images[j]).getDownloadURL().subscribe((img) => {
                   this.products[i].images[j] = img;
                 });
               }
             }*/
             this.fsService.hideLoader();
          }, (error) => {
            console.log("Error " + error.code + ": " + error.message);
          });

          // Get Sales
          this.sub3 = this.fsService.getMySales(this.currentUser.email).subscribe((data) => {
            this.sales = data;
            /*for (let i = 0; i < this.sales.length; i++) {
              this.storage.ref(this.sales[i].image).getDownloadURL().subscribe((img) => {
                this.sales[i].image = img;
              });
            }*/

            var filter = this.salesForm == null ? 'Reserved' : this.salesForm.value.filter
            if (this.sales != null)
              this.salesF = this.sales.filter(function (el) {
                return el.status == filter;
              });
          }, (error) => {
            console.log("Error " + error.code + ": " + error.message);
          });
        }
        if (this.currentUser.role == 1 || this.currentUser.role == 3) {
          if(this.currentUser.role == 1) this.segment = 'purchases';

          // Get Purchases
          this.sub4 = this.fsService.getMyPurchases(this.currentUser.email).subscribe((data) => {
            this.purchases = data;
            
            var filter = this.purchasesForm == null ? 'Reserved' : this.purchasesForm.value.filter
   
            if (this.purchases != null)
              this.purchasesF = this.purchases.filter(function (el) {  
                return el.status == filter;
              });
              
            /*for (let i = 0; i < this.purchases.length; i++) {
              this.storage.ref(this.purchases[i].image).getDownloadURL().subscribe((img) => {
                this.purchases[i].image = img;
              });
            }*/
            this.fsService.hideLoader();
            
          }, (error) => {
            console.log("Error " + error.code + ": " + error.message);
          });

        }

        if ((this.currentUser.role == 1 || this.currentUser.role == 3) && this.currentUser.favourites.length > 0) {
          this.sub5 = this.fsService.getMyFavourites(this.currentUser.favourites).subscribe((data) => {
            this.myFavourites = data;

            for (let i = 0; i < this.myFavourites.length; i++) {
              /*this.storage.ref(this.myFavourites[i].images[0]).getDownloadURL().subscribe((img) => {
                this.myFavourites[i].images[0] = img;
              });*/
              this.myFavourites[i].myFav = true;
            }
          })
        } else this.myFavourites = [];
      }
    });


    this.salesForm.get("search").valueChanges.subscribe(query => {
      this.salesF = this.sales.filter((el) => {
        return (el.name.toLowerCase().includes(query.toLowerCase()) || el.id.toLowerCase().includes(query.toLowerCase())) && el.status == this.salesForm.value.filter;
      });
    });

    this.purchasesForm.get("search").valueChanges.subscribe(query => {
      this.purchasesF = this.purchases.filter((el) => {
        return (el.name.toLowerCase().includes(query.toLowerCase()) || el.id.toLowerCase().includes(query.toLowerCase())) && el.status == this.purchasesForm.value.filter;
      });
    });

  }

  async rejectOrder(orderId, productId, qty, buyer) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Proceed to reject order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.fsService.rejectOrder(orderId, productId, qty, buyer, this.currentUser.email);
          }
        }
      ]
    });

    await alert.present();
  }

  async acceptOrder(orderId, productId, buyer) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Proceed to accept order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.fsService.acceptOrder(orderId, productId, buyer, this.currentUser.email);
          }
        }
      ]
    });

    await alert.present();
  }

  async sendOrder(orderId, productId, buyer) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Proceed to mark order as sent?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.fsService.sendOrder(orderId, productId, buyer, this.currentUser.email);
          }
        }
      ]
    });

    await alert.present();
  }

  async receivedOrder(orderId, productId, sender) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Proceed to mark order as received?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.fsService.receivedOrder(orderId, productId, this.currentUser.email, sender);
          }
        }
      ]
    });

    await alert.present();
  }

  onFilterChangePurchases($event) {
    var filter = $event.target.value;
    var query = this.purchasesForm.value.search;

    if (this.purchases != null)
      this.purchasesF = this.purchases.filter(function (el) {
        return (el.name.toLowerCase().includes(query.toLowerCase()) || el.id.toLowerCase().includes(query.toLowerCase())) && el.status == filter;
      });
  }

  onFilterChangeSales($event) {
    var filter = $event.target.value;
    var query = this.salesForm.value.search;

    if (this.sales != null)
      this.salesF = this.sales.filter(function (el) {
        return (el.name.toLowerCase().includes(query.toLowerCase()) || el.id.toLowerCase().includes(query.toLowerCase())) && el.status == filter;
      });
  }

  unfavouriteProduct(id) {
    this.authService.favouriteProduct(this.myFavourites[id].id, false)
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;

    if (ev.detail.value == "inventory") {

    }
    else if (ev.detail.value == "sales") {

    }
    else if (ev.detail.value == "purchases") {

    }
    else if (ev.detail.value == "favourites") {

    }

  }

  async changePasswordAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Change Password?',
      mode: 'ios',
      message: 'Please input your new password',
      inputs: [
        {
          name: 'oPassword',
          type: 'password',
          placeholder: 'Old Password'
        },
        {
          name: 'Password',
          type: 'password',
          placeholder: 'New Password'
        },
        {
          name: 'cPassword',
          type: 'password',
          placeholder: 'Confirm Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'btn-reset',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Reset',
          handler: data => {
            console.log('Confirm Ok');
            this.authService.updatePassword(data.cPassword, data.oPassword);
          }
        }
      ]
    });

    await alert.present();
  }

  socialMedia(type) {            // Check if the platform is android or ios, then proceed to open the link via browser or app
    switch (type) {
      case 'FACEBOOK': {
        this.openFacebook(this.currentUser.facebookurl, 'https://www.facebook.com');    // Open Facebook Profile URL
        break;
      }
      case 'INSTAGRAM': {
        this.openInstagram(this.currentUser.instagramurl, 'https://www.instagram.com');   // Open Instagram Profile URL
        break;
      }
      case 'TWITTER': {
        this.openTwitter(this.currentUser.twitterurl, 'https://twitter.com');      // Open Twitter Profile URL
        break;
      }
    }
  }
  openTwitter(name, url) {            // Change
    let app;
    if (this.platform.is('ios')) {              // Check for IOS
      app = 'twitter://';
    } else if (this.platform.is('android')) {   // Check for android
      app = 'com.twitter.android';
    } else {
      this.openInApp('https://twitter.com/' + name);    // Open in web browser
      return;
    }
    this.appAvailability.check(app)                     // Check if app is installed, if not open in web browser
      .then((res) => {
        const data = 'twitter://user?screen_name=' + name;
        this.openInApp(data);
      }
      ).catch(err => {
        this.openInApp('https://twitter.com/' + name);
});
  }
  openFacebook(name, url) {
    let app;
    if (this.platform.is('ios')) {
      app = 'fb://';
    } else if (this.platform.is('android')) {
      app = 'com.facebook.katana';
    } else {
      this.openInApp('https://www.facebook.com/' + name);
      return;
    }
    this.appAvailability.check(app)
      .then(res => {
        const fbUrl = 'fb://facewebmodal/f?href=' + url;
        this.openInApp(fbUrl);
      }
      ).catch(() => {
        this.openInApp('https://www.facebook.com/' + name);
      });
  }
  openInApp(url) {                                      
    this.inAppBrowser.create(url, '_system')
  }
  openInstagram(name, url) {                            // Change
    let app;
    if (this.platform.is('ios')) {
      app = 'instagram://';
    } else if (this.platform.is('android')) {
      app = 'com.instagram.android';
    } else {
      this.openInApp('https://www.instagram.com/' + name);
      return;
    }
    this.appAvailability.check(app)
      .then((res) => {
        this.openInApp('instagram://user?username=' + name);
      }
      ).catch(err => {
        this.openInApp('https://www.instagram.com/' + name);
      });
  }

  ngOnDestroy() {
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
    if (this.sub3) this.sub3.unsubscribe();
    if (this.sub4) this.sub4.unsubscribe();
    if (this.sub5) this.sub5.unsubscribe();
  }
}
