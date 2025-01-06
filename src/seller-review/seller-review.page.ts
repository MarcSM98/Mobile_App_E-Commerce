import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seller-review',
  templateUrl: './seller-review.page.html',
  styleUrls: ['./seller-review.page.scss'],
})
export class SellerReviewPage implements OnInit {

  reviews: any;
  sub1: Subscription;
  sub2: Subscription;

  profilePics = [];

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.showLoader();
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.sub1 = this.authService.getAllReviews(id).subscribe((data) => {
      this.reviews = data;
      this.sub2 = this.fsService.getAllProficPics().subscribe((result) => {
        this.profilePics = result;

        var filter = this.profilePics.filter((el) => {
          return (el.email.toLowerCase() == id.toLowerCase());
        });

        for (let i = 0; i < this.reviews.length; i++) {
          this.reviews[i].image = '';
          var filter = this.profilePics.filter((el) => {
            return (el.email.toLowerCase() == this.reviews[i].author.toLowerCase());
          });

          if (filter.length == 1) {
            this.reviews[i].image = filter[0].image;
          }
        }

        this.fsService.hideLoader();
      })
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

}
