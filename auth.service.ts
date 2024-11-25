import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {AlertController, ToastController} from '@ionic/angular';
import { FirestoreService } from './firestore.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	user: any = { fullname: '', email: '', role: '', username: '', isAdmin: false, isSeller: false };
	userInfo: BehaviorSubject<Object> = new BehaviorSubject<Object>(this.user);
	subscription: Subscription;
	creatingNewUser = false;

	constructor(private toastController: ToastController, private googlePlus: GooglePlus, private fsService: FirestoreService, private alertController: AlertController, private fAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) {
		this.fAuth.authState.subscribe((user) => {

			if (user != null) {
				this.subscription = this.getUser(user.email).subscribe((result) => {
					this.user = result;
					this.user.providerId = user.providerData[0].providerId;

					if (this.user.ban) {
						this.logout().then(() => {
							this.confirmAlert('Alert', 'Your account is banned. Please contact the administrator.')
							return;
						});
					}

					if (!this.user.approved && !this.creatingNewUser) {
						this.logout().then(() => {
							return;
						});
					}

					if (this.user.role == 0) this.user.isAdmin = true;
					else if (this.user.role == 2 || this.user.role == 3) this.user.isSeller = true;
					this.userInfo.next(this.user);
				})
			}
			else {
				if (this.userInfo != null) {
					this.user = { fullname: '', email: '', role: '', username: '', isAdmin: false, isSeller: false };
					this.userInfo.next(this.user);
				}
				if (this.subscription != null) this.subscription.unsubscribe();
			}
		})
	}


	addProduct() {
		var p = null;
		this.firestore.collection('users').doc("abc")
			.set({ lastUpdated: new Date() })
			.then((product) => {
				console.log("added")
			})
			.catch((error) => {
				console.log("Error " + error.code + ": " + error.message);
				return null;
			});
	}

	googleSignIn() {
		this.googlePlus.login({
			'webClientId': '387544577072-rnhv6j697kkitfseinaak9giu5gpncqi.apps.googleusercontent.com',
			'offline': true
		}).then(res => {
			this.fAuth.signInWithCredential(firebase.default.auth.GoogleAuthProvider.credential(res.idToken))
				.then(success => {
					this.firestore.collection('users').doc(res.email).ref.get().then((doc) => {
						var thisUser: any = doc.data();
						if (thisUser == null) {
							let navigationExtras: NavigationExtras = {
								state: {
									email: res.email
								}
							};
							this.router.navigate(['/register2'], navigationExtras);
						}
						else {
							if (thisUser.approved == false) {
								this.confirmAlert('Alert', 'Please kindly wait for your account to be approved by our administrator.');
								return;
							}

							doc.ref.update({ lastLogin: new Date() })
							var remove = res.email.replace('@', '')
							console.log("subscribed to " + remove)
							this.fsService.initializeFCM(remove)

							if (thisUser.role == "0") { this.router.navigate(['/admin-dashboard']); }
							else { this.router.navigate(['/home']); }
						}
					});
				})
				.catch(error => console.log("Firebase failure: " + JSON.stringify(error)));
		}).catch(err => console.error("Error: ", err));
	}

	getUserInfo(): Observable<Object> {
		return this.userInfo;
	}

	favouriteProduct(productId, favourite) {
		if (favourite) {
			this.firestore.collection('users').doc(this.user.email)
				.update({ favourites: firebase.default.firestore.FieldValue.arrayUnion(productId) }) // try to append to existing message
				.then((user) => {

				}).catch((error) => {
					console.log("Error " + error.code + ": " + error.message);
				});
		} else {
			this.firestore.collection('users').doc(this.user.email)
				.update({ favourites: firebase.default.firestore.FieldValue.arrayRemove(productId) }) // try to append to existing message
				.then((user) => {

				}).catch((error) => {
					console.log("Error " + error.code + ": " + error.message);
				});

		}
	}

	register(email, password) {
		return this.fAuth.createUserWithEmailAndPassword(email, password);
	}

	registerContinued(result, email)
	{
		result.user.sendEmailVerification().then(() => {
			let navigationExtras: NavigationExtras = {
				state: {
					email: email
				}
			};
			this.creatingNewUser = true;
			this.router.navigate(['/register2'], navigationExtras);
		})
	}

	sendVerificationMail(email: string) {
		this.fAuth.authState.subscribe(user => {
			user.sendEmailVerification().then(() => console.log("Email has been sent"));
		})
	}

	register2(email, username, fullname, mobile, role) {		// Change
		this.fsService.showLoader();
		try{
		var approved = false;
		if (role == 0 || role == 1) approved = true;
		this.firestore.collection('users').doc(email).set({ favourites: [], socialPlatform: [], approved: approved, ban: false, unreadChats: ["admin" + email], dateJoined: new Date(), lastLogin: new Date(), image: '', readA: false, username: username, fullname: fullname, mobile: mobile, role: role }).then((userInner) => {
			this.firestore.collection('profilepics').doc(email).set({ image: '' });
			this.fsService.newAdminChat(email, "Welcome to La Lumiere!", username);
		}).then(() => {
			this.creatingNewUser = false;
			this.fsService.hideLoader();
		}).catch((error) => {
				console.log("Error " + error.code + ": " + error.message);
		});
	}catch(error) {console.log(error)}	
	}

	// Collection: socialmedia

	getActiveSocial() {			// get info from socialmedia collection
		return this.firestore.collection('socialmedia', ref => ref.where("active", "==", true).orderBy("name", "asc")).valueChanges({ idField: 'id' });		// Change
	  }
	
	  getAllSocial() {
		return this.firestore.collection('socialmedia', ref => ref.orderBy("name", "asc")).valueChanges({ idField: 'id' });
	  }
	
	  updateSocial(modeId, name, active) {
		this.firestore.collection('socialmedia').doc(modeId).update({ name: name, active: active }).then((order) => {
		  // route to somewhere
		}).catch((error) => {
		  console.log("Error " + error.code + ": " + error.message);
		});
	  }

	update(email, file, path, IMGname, fullname, mobile, description, school, course, socialPlatform, facebookurl, instagramurl, twitterurl, image) {			// Change
		this.firestore.collection('users').doc(email).update({ fullname: fullname, mobile: mobile, description: description, school: school, course: course, socialPlatform: socialPlatform, facebookurl: facebookurl, instagramurl: instagramurl, twitterurl: twitterurl, image: image }).then((user2) => {	// Change
			if (IMGname != '') {
				var lastIndex = IMGname.lastIndexOf(".");
				var profilepic = email + IMGname.substr(lastIndex, IMGname.length - lastIndex);
				file.readAsArrayBuffer(path, IMGname).then(async (buffer) => {
					await this.putInCloudStorageProfile(buffer, profilepic, email)
				});
			}
		}).then(() => {
			this.confirmAlert('Success', 'Profile updated successfully.')
			this.router.navigate(['/edit-profile']);
		}).catch((error) => {
			console.log("Error " + error.code + ": " + error.message);
		});

	}

	async putInCloudStorageProfile(buffer, name, email) {
		let blob = new Blob([buffer], { type: "image/jpeg" });

		let storage = firebase.default.storage();

		storage.ref('users/' + name).put(blob).then((d) => {
			let imgURL = storage.ref('users/' + name).getDownloadURL().then((r) => {
				this.firestore.collection('users').doc(email).update({ image: r })
				this.firestore.collection('chats', ref => ref.where("buyer", "==", this.fsService.adminEmail).where("seller", "==", email)).get().toPromise().then(function (querySnapshot) {
					querySnapshot.forEach(function (doc) {
						doc.ref.update({ image: r })
					});
				});
				this.firestore.collection('profilepics').doc(email).update({ image: r })
			}).catch((error) => {
				alert(JSON.stringify(error))
			})
		}).catch((error) => {
			alert(JSON.stringify(error))
		})
	}

	updatePassword(newPassword, password) {
		this.fAuth.authState.subscribe((user) => {

			const credential = firebase.default.auth.EmailAuthProvider.credential(
				user.email,
				password
			);

			user.reauthenticateWithCredential(credential).then(() => {
				user.updatePassword(newPassword).then(() => {
					this.logout().then(() => {
						this.confirmAlert('Success', 'Password changed successfully. Please login again.')
						this.router.navigate(['/login']);
					});

				}).catch((error) => {
					this.confirmAlert('Alert', 'Error changing password. Please try again.')
					console.log("Error " + error.code + ": " + error.message);
				});

			}).catch((error) => {
				this.confirmAlert('Alert', 'Error changing password. Please try again.')
				console.log("Error " + error.code + ": " + error.message);
			});
		});
	}

	readAds(email, value) {
		this.firestore.collection('users').doc(email).update({ readA: value }).then(() => {

		}).catch((error) => {
			console.log("Error " + error.code + ": " + error.message);
		});
	}



	banUser(email, value) {
		this.firestore.collection('users').doc(email).update({ ban: value }).then(() => {

		}).catch((error) => {
			console.log("Error " + error.code + ": " + error.message);
		});

	}

	approveUser(email, value) {
		this.firestore.collection('users').doc(email).update({ approved: value }).then(() => {

		}).catch((error) => {
			console.log("Error " + error.code + ": " + error.message);
		});

	}

	login(email, password) {
		this.firestore.collection('users').doc(email).ref.get().then((doc) => {

			this.fAuth.signInWithEmailAndPassword(email, password).then((res) => {
				if (doc.data() == null)
				{
					// account created but not set up
					console.log('forwarding email value: ' + email);
					this.router.navigate(['/register2'], {
						state: {
							email: email
						}
					});
					return
				}
			})

			if (doc.data() == null) {
				this.confirmAlert('Alert', 'User account not found. Please sign up!')
				return;
			}

			var u: any = {};
			u = doc.data();
			if (u.approved == false) {
				this.confirmAlert('Alert', 'Your account is pending approval from the administrator. Please try again later.')
				return;
			}

			this.fAuth.signInWithEmailAndPassword(email, password).then((result) => {
				if (result.user.emailVerified == false) {
					result.user.sendEmailVerification().then(() => {
						this.confirmAlert('Alert', 'Please verify your email through the verification email that was sent to you.');
					});
				} else {
					var ref = this.firestore.collection('users').doc(email).ref.get().then((doc) => {
						var thisUser: any = doc.data();

						if (thisUser.approved == false) {
							this.confirmAlert('Alert', 'Please kindly wait for your account to be approved by our administrator.');
							return;
						}

						doc.ref.update({ lastLogin: new Date() })

						var remove = email.replace('@', '')
						console.log("subscribed to " + remove)
						this.fsService.initializeFCM(remove)

						if (thisUser.role == "0") { this.router.navigate(['/admin-dashboard']); }
						else { this.router.navigate(['/home']); }
					}).catch((error) => {
						console.log("Error " + error.code + ": " + error.message);
					});
				}
			}).catch((error) => {
				console.log("Error " + error.code + ": " + error.message);
				this.confirmAlert("Alert", "Error: Invalid Login!");
			});
		});
	}

	sendResetLink(email) {
		return this.fAuth.sendPasswordResetEmail(email).then(() => {
			this.confirmAlert('Success', 'Please check your email for the password reset link.')
			return true;
		}).catch((error) => {
			console.log("Error " + error.code + ": " + error.message);
		});
	}

	logout() {
		var email = this.user.email;
		return this.fAuth.signOut().then(() => {
			if (email != null && email != '') {
				var remove = email.replace('@', '')
				this.fsService.unsubscribeFCM(remove)
			}
		});

	}

	getUser(email) {
		return this.firestore.collection('users').doc(email).valueChanges({ idField: 'email' });
	}

	getAllUsers() {
		return this.firestore.collection('users', ref => ref.orderBy("lastLogin", "asc")).valueChanges({ idField: 'email' });
	}

	getNewUsers(thisMth, nextMth) {
		return this.firestore.collection('users', ref => ref.where("dateJoined", ">=", thisMth).where("dateJoined", "<", nextMth)).valueChanges();
	}

	getUsersByMths(mth1, mth2) {
		return this.firestore.collection('users', ref => ref.where("dateJoined", ">=", mth1).where("dateJoined", "<", mth2)).valueChanges({ idField: 'id' });
	}

	// Sub-Collection: reviews

	getReview(seller, buyer, orderId) {
		return this.firestore.collection('users').doc(seller).collection('reviews').doc(orderId + buyer).valueChanges();
	}

	getReviewBuyer(buyer, seller, orderId) {			// Change
		return this.firestore.collection('users').doc(buyer).collection('reviews').doc(orderId + seller).valueChanges();
	}

	getSomeReviews(seller) {
		return this.firestore.collection('users').doc(seller).collection('reviews', ref => ref.orderBy("date", "desc").limit(5)).valueChanges({ idField: 'id' });
	}

	getAllReviews(seller) {
		return this.firestore.collection('users').doc(seller).collection('reviews', ref => ref.orderBy("date", "desc")).valueChanges({ idField: 'id' });
	}

	getBuyerReviews(buyer) {		// Change
		return this.firestore.collection('users').doc(buyer).collection('reviews', ref => ref.orderBy("date", "desc")).valueChanges({ idField: 'id' });
	}

	addReview(seller, rating, msg, buyer, orderId, buyer_un, productId) {
		var newReview = {
			rating: rating,
			msg: msg,
			author: buyer,
			author_un: buyer_un,
			date: new Date()
		};

		this.firestore.collection('users').doc(seller).collection('reviews').doc(orderId + buyer).set(newReview).then((review) => {
			this.fsService.newNotification("New Review", buyer_un + " had left a review for order " + orderId + "." + buyer_un + ".", '/seller-details/' + seller, seller.replace("@", ""))
			this.fsService.unreadChat(seller, productId + buyer);
			this.confirmAlert('Success', 'Review added successfully.');
			this.router.navigate(['/seller-details', seller]);
		}).catch((error) => {
			console.log("Error " + error.code + ": " + error.message);
		});
	}

	addReviewBuyer(buyer, rating, msg, seller, orderId, seller_un, productId) {			// Change
		var newReview = {
			rating: rating,
			msg: msg,
			author: seller,
			author_un: seller_un,
			date: new Date()
		};

		this.firestore.collection('users').doc(buyer).collection('reviews').doc(orderId + seller).set(newReview).then((review) => {
			this.fsService.newNotification("New Review", seller_un + " had responded the review for order " + orderId + "." + seller_un + ".", '/buyer-details/' + buyer, buyer.replace("@", ""))
			this.fsService.unreadChat(buyer, productId + seller);
			this.confirmAlert('Success', 'Review added successfully.');
			this.router.navigate(['/buyer-details', buyer]);		// Send review to buyer profile
		}).catch((error) => {
			console.log("Error " + error.code + ": " + error.message);
		});
	}

	async confirmAlert(title, message) {
		const alert = await this.alertController.create({
			cssClass: 'alert',
			header: title,
			mode: 'ios',
			message: message,
			buttons: [
				{
					text: 'Ok',
					role: 'cancel',
					cssClass: 'btn-reset',
				}
			]
		});

		await alert.present();
	}

}

