import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {

  reviewForm: FormGroup;
  reviewed = true;
  rating = 5;
  seller;
  seller_un;
  orderid;
  productid;

  currentUser;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  profilePics = [];
  seller_profilepic = '';

  blacklisted_words = [];

  constructor(private toastController: ToastController, private formBuilder: FormBuilder, private authService: AuthService, private activatedRoute: ActivatedRoute, private fsService: FirestoreService, private storage: AngularFireStorage) {

    this.reviewForm = formBuilder.group({
      'msg': ''
    });
  }

  ngOnInit() {
    // Get the id that was passed with the URL
    this.seller = this.activatedRoute.snapshot.paramMap.get('seller');
    this.seller_un = this.activatedRoute.snapshot.paramMap.get('seller_un');
    this.orderid = this.activatedRoute.snapshot.paramMap.get('orderid');
    this.productid = this.activatedRoute.snapshot.paramMap.get('productId');
    this.fsService.retrieveBlacklistedWordsDocRef().get().toPromise().then(res => {
      if (res.exists)
      {
        this.blacklisted_words = [];
        // @ts-ignore
        res.data().words.forEach(word => {
          console.log(word);
          this.blacklisted_words.push(word);
        })
      }
    })

    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
      if (result != null) {
        this.sub2 = this.authService.getReview(this.seller, this.currentUser.email, this.orderid).subscribe((review) => {
          if (review == null) {
            this.reviewed = false;
          }
          else {
            // alert - reviewed before

            this.rating = review.rating;
            this.reviewForm.controls.msg.setValue(review.msg);
          }
        },
          (error) => {

          });
      }
    });

    this.sub3 = this.fsService.getAllProficPics().subscribe((result) => {
      this.profilePics = result;

      var filter = this.profilePics.filter((el) => {
        return (el.email.toLowerCase() == this.seller.toLowerCase());
      });

      if(filter.length == 1) {
        this.seller_profilepic = filter[0].image;
      }
    })
  }

  setRating(value) {
    if (!this.reviewed)
      this.rating = value;
  }

  addReview() {
    if (this.checkIfFieldNullOrEmpty("Message", this.reviewForm.value.msg)) return;
    if (this.checkIfFieldNullOrEmpty("Rating", this.rating)) return;

    let checkPass = true;
    let blacklistedWord = "";

    // check for blacklisted words
    this.blacklisted_words.forEach(word => {
      word = word.toLowerCase();
      if (this.reviewForm.value.msg.toLowerCase().includes(word))
      {
        checkPass = false;
        if (blacklistedWord == "") blacklistedWord += word;
      }
    })

    if (!checkPass) {
      this.showErrorMessage("Error: Please remove the blacklisted word: " + blacklistedWord);
      return;
    }
    this.authService.addReview(this.seller, this.rating, this.reviewForm.value.msg, this.currentUser.email, this.orderid, this.currentUser.username, this.productid)
    this.reviewed = true;
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }

  checkIfFieldNullOrEmpty(fieldName, value)
  {
    console.log('value:' + value);
    if (value == '')
    {
      console.log('field null');
      this.showErrorMessage("Error: " + fieldName + " cannot be empty!").then(r => { // do nothing
      });
      return true;
    }
    return false;
  }

  async showErrorMessage(message)
  {
    let toast = await this.toastController.create(
        {
          message: message,
          duration: 3000,
          position: 'bottom'
        }
    )

    return await toast.present();
  }

}
