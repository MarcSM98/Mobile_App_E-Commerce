import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buyer-details',
  templateUrl: './buyer-details.page.html',
  styleUrls: ['./buyer-details.page.scss'],
})
export class BuyerDetailsPage implements OnInit {

  public segment: string = 'products';
  user: any = { fullname: '', email: '', role: '', username: '', description: '' };    // Change
  products: any;
  reviews: any;
  avgRating = 0;
  currentUser;

  sub1: Subscription;  
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;

  profilePics = [];
  buyer_profilepic = '';

  count = 0;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.showLoader();
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    })

    this.sub2 = this.authService.getUser(id).subscribe(result => {
      this.user = result;

      this.sub3 = this.fsService.getActiveProducts(id).subscribe((data) => {
        this.products = data;

        /*for (let i = 0; i < this.products.length; i++) {
          for (let j = 0; j < this.products[i].images.length; j++) {
            this.storage.ref(this.products[i].images[j]).getDownloadURL().subscribe((img) => {
              this.products[i].images[j] = img;
            });
          }
        }*/
        this.hideLoader();
      });

    });

    this.sub4 = this.authService.getBuyerReviews(id).subscribe((data) => {          // Change
      this.reviews = data;

      this.sub5 = this.fsService.getAllProficPics().subscribe((result) => {
        this.profilePics = result;

        var filter = this.profilePics.filter((el) => {
          return (el.email.toLowerCase() == id.toLowerCase());
        });

        if (filter.length == 1) {
          this.buyer_profilepic = filter[0].image;
        }

        var sum = 0;

        for (let i = 0; i < this.reviews.length; i++) {
          sum += this.reviews[i].rating;
          this.reviews[i].image = '';
          var filter = this.profilePics.filter((el) => {
            return (el.email.toLowerCase() == this.reviews[i].author.toLowerCase());
          });

          if (filter.length == 1) {
            this.reviews[i].image = filter[0].image;
          }
        }

        if (this.reviews.length > 0) this.avgRating = Math.round(sum / this.reviews.length);
        this.hideLoader();
      })

    });


  }


  hideLoader() {
    this.count++;
    if (this.count == 2) this.fsService.hideLoader();
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
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
    this.sub5.unsubscribe();
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

}
