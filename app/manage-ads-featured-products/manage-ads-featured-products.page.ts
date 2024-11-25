import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-manage-ads-featured-products',
  templateUrl: './manage-ads-featured-products.page.html',
  styleUrls: ['./manage-ads-featured-products.page.scss'],
})
export class ManageAdsFeaturedProductsPage implements OnInit {

  public segment: string = 'ads';

  ads = [];
  adsF = [];

  featured = [];
  featuredF = [];

  adsForm: FormGroup;
  featureForm: FormGroup;

  sub1: Subscription;
  sub2: Subscription;

  constructor(private fsService: FirestoreService, private formBuilder: FormBuilder, private storage: AngularFireStorage) {
    this.fsService.showLoader();
    this.adsForm = formBuilder.group({
      'search': '',
      'filter': 'P',
    });

    this.featureForm = formBuilder.group({
      'search': '',
      'filter': 'P',
    });

    this.sub1 = this.fsService.getAllAds().subscribe((result) => {
      this.ads = result;
      /*for (let i = 0; i < this.ads.length; i++) {
        this.storage.ref(this.ads[i].image).getDownloadURL().subscribe((img) => {
          this.ads[i].image = img;
        });
      }*/

      var filter = this.adsForm == null ? 'P' : this.adsForm.value.filter

      if (this.adsForm != null) {
        this.adsF = this.ads.filter(function (el) {
          return el.status == filter;
        });
      }
      this.fsService.hideLoader();
    });

    this.sub2 = this.fsService.getAllFeaturedRequest().subscribe((result) => {
      this.featured = result;
      /*for (let i = 0; i < this.featured.length; i++) {
        this.storage.ref(this.featured[i].image).getDownloadURL().subscribe((img) => {
          this.featured[i].image = img; 
        });
      }*/

      var filter = this.featureForm == null ? 'P' : this.featureForm.value.filter

      if (this.featureForm != null) {
        this.featuredF = this.featured.filter(function (el) {
          return el.status == filter;
        });
      }
    });

    this.adsForm.get("search").valueChanges.subscribe(query => {
      var filter = this.adsForm == null ? 'P' : this.adsForm.value.filter

      this.adsF = this.ads.filter((el) => {
        return (el.requester.toLowerCase().includes(query.toLowerCase()) || el.info.toLowerCase().includes(query.toLowerCase())) && el.status == filter;
      });
    });

    this.featureForm.get("search").valueChanges.subscribe(query => {
      var filter = this.featureForm == null ? 'P' : this.featureForm.value.filter

      this.featuredF = this.featured.filter((el) => {
        return (el.requester.toLowerCase().includes(query.toLowerCase()) || el.productName.toLowerCase().includes(query.toLowerCase())) && el.status == filter;
      });
    });
  }

  onFilterChangeAds($event) {
    var filter = $event.target.value;
    var query = this.adsForm.value.search;

    this.adsF = this.ads.filter((el) => {
      return (el.requester.toLowerCase().includes(query.toLowerCase()) || el.info.toLowerCase().includes(query.toLowerCase())) && el.status == filter;
    });
  }

  onFilterChangeFeatured($event) {
    var filter = $event.target.value;
    var query = this.featureForm.value.search;

    this.featuredF = this.featured.filter((el) => {
      return (el.requester.toLowerCase().includes(query.toLowerCase()) || el.productName.toLowerCase().includes(query.toLowerCase())) && el.status == filter;
    });
  }

  approveAds(id, requester, requester_un) {
    this.fsService.approveAds(id, requester, requester_un);
  }

  rejectAds(id, requester, requester_un) {
    this.fsService.rejectAds(id, requester, requester_un);
  }

  approveF(id, pId, requester, requester_un) {
    this.fsService.approveFeaturedRequest(id, pId, requester, requester_un);
  }

  rejectF(id, pId, requester, requester_un) {
    this.fsService.rejectFeaturedRequest(id, pId, requester, requester_un);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

}
