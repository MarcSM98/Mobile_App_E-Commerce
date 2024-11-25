import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-products',
	templateUrl: './products.page.html',
	styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

	products: any;
	currentUser;

	sub1: Subscription;
	sub2: Subscription;

	count = 0;

	constructor(private authService: AuthService, private fsService: FirestoreService, private storage: AngularFireStorage) {
		this.fsService.showLoader();
		
		this.sub1 = this.authService.getUserInfo().subscribe((result) => {
			this.currentUser = result;
			this.hideLoader();
		})

		this.sub2 = this.fsService.getAllActiveProducts().subscribe((data) => {
			this.products = data;
			/*for (let i = 0; i < this.products.length; i++) {
				for (let j = 0; j < this.products[i].images.length; j++) {
					this.storage.ref(this.products[i].images[j]).getDownloadURL().subscribe((img) => {
						this.products[i].images[j] = img;
						console.log(this.products[i].images[j])
					});
				}
			}*/
			this.hideLoader();
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
	}

}
