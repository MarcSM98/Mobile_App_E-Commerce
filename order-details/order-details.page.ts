import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  order: any = {};
  currentUser;

  sub1: Subscription;
  sub2: Subscription;

  constructor(public authService: AuthService, private activatedRoute: ActivatedRoute, private fsService: FirestoreService, private storage: AngularFireStorage) { 
    this.fsService.showLoader();
    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    });
  }

  ngOnInit() {
    // Get the id that was passed with the URL
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    // Retrieve the product information through fsService
    this.sub2 = this.fsService.getOrderById(id).subscribe(result => {
      this.order = result;
      this.order.id = id;
      this.order.orderDate = this.order.orderDate.toDate();
      this.order.lastUpdated = this.order.lastUpdated.toDate();

      /*this.storage.ref(this.order.image).getDownloadURL().subscribe((img) => {
        this.order.image = img;
      });*/
      this.fsService.hideLoader();
    });
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
