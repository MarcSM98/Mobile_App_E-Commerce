import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

	options : InAppBrowserOptions = {
		location : 'yes',//Or 'no' 
		hidden : 'no', //Or  'yes'
		clearcache : 'yes',
		clearsessioncache : 'yes',
		zoom : 'yes',//Android only ,shows browser zoom controls 
		hardwareback : 'yes',
		mediaPlaybackRequiresUserAction : 'no',
		shouldPauseOnSuspend : 'no', //Android only 
		closebuttoncaption : 'Close', //iOS only
		disallowoverscroll : 'no', //iOS only 
		toolbar : 'yes', //iOS only 
		enableViewportScale : 'no', //iOS only 
		allowInlineMediaPlayback : 'no',//iOS only 
		presentationstyle : 'pagesheet',//iOS only 
		fullscreen : 'yes',//Windows only    
	}
	
  products: any = [];
  ads: any = [];

  currentUser;
 
  constructor(private iab: InAppBrowser, private authService: AuthService, private fsService: FirestoreService, private storage: AngularFireStorage) { 
	this.fsService.showLoader();
	
	this.authService.getUserInfo().subscribe((result) => {
		this.currentUser = result;
	})

	this.fsService.getSomeFeaturedProducts().subscribe((data) => {
		this.products = data; 
		/*for (let i =0; i < this.products.length; i++) {
		for (let j =0; j < this.products[i].images.length; j++) {
				this.storage.ref(this.products[i].images[j]).getDownloadURL().subscribe((img) => {
					this.products[i].images[j] = img;
				});	
			}
		}*/
		this.fsService.hideLoader();
	});

	const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);
	
	this.fsService.getActiveAds(today).subscribe((data) => {
		this.ads = data; 
		

		this.ads = this.ads.filter(function (el) {
			return today >= el.activeDate.toDate();
		  });

		/*for (let i =0; i < this.ads.length; i++) {
			this.storage.ref(this.ads[i].image).getDownloadURL().subscribe((img) => {
				this.ads[i].image = img;
				console.log(img)
			});	
		}*/
	});
  }
  
  ngOnInit() {
	
  }

  inAppBrowser(info) {
	let target = "_blank";
    this.iab.create(info,target,this.options);
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
  

  categories = {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
	autoplay: {
		delay: 4000,
		speed: 4000
	}
  };
  

  
  

}
