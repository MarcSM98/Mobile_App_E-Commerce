import { Component, OnInit } from '@angular/core';
import {AlertController, PopoverController} from '@ionic/angular';
import { PopOverSharePage } from '../pop-over-share/pop-over-share.page';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { SocialSharing } from '@ionic-native/social-sharing/ngx'

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  product: any = {};
  currentUser;

  sub1: Subscription;
  sub2: Subscription;

  constructor(public alertController: AlertController, public socialSharing: SocialSharing, public authService: AuthService, public popoverController: PopoverController, private activatedRoute: ActivatedRoute, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.showLoader();
    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
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

      /*for (let i = 0; i < this.product.images.length; i++) {
        this.storage.ref(this.product.images[i]).getDownloadURL().subscribe((img) => {
          this.product.images[i] = img;
        });
      }*/

      this.fsService.hideLoader();
    });
  }

  myFav(id) {
		if (this.currentUser.favourites != null && this.currentUser.favourites.indexOf(id) > -1)
			this.product.myFav = true;
		else
			this.product.myFav = false;

		return this.product.myFav;
	}

	favouriteProduct(id) {
		if (this.product.myFav == null || this.product.myFav == false) {
			this.product.myFav = true;
		}
		else {
			this.product.myFav = false;
		}

		this.authService.favouriteProduct(id, this.product.myFav)
  }
  
  products = {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
  };
  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopOverSharePage,
      event: event,
      cssClass: 'my-custom-class',
      translucent: true,
      showBackdrop: true,
      animated: true,
      componentProps:  {id: this.product.id,
        image: this.product.mainImage,
        name: this.product.name,
        user: this.currentUser.email,
        username: this.currentUser.username}
    });
    return await popover.present();
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  // async presentSharingAlert()
  // {
  //   const alert = await this.alertController.create(
  //       {
  //         header: 'Share ' + this.product.name,
  //         message: 'Share ' + this.product.name + '?',
  //         buttons:
  //         [
  //           {
  //             text: "Share via Instagram",
  //             handler: (r) => {
  //               console.log("Sharing via Instagram...");
  //               this.socialSharing.canShareVia("instagram")
  //                   .then((res) => {
  //                     this.socialSharing.shareViaInstagram("Check out this " + name + "!", this.product.mainImage);
  //                   })
  //                   .catch((err) => {
  //                     console.log(err);
  //                   })
  //             }
  //           }
  //         ]
  //       }
  //   )
  //   await alert.present();
  // }

    shareItem() {

        this.socialSharing.shareWithOptions(
            {
              message: 'Hey, look at this item - ' + this.product.name,
              subject: 'La Lumiere - ' + this.product.name,
              files: [this.product.mainImage]
            }
        )
    }
}
