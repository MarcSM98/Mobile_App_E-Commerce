import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

import * as firebase from 'firebase/app';
import { INotificationPayload } from 'cordova-plugin-fcm-with-dependecy-updated';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  adminEmail = 'tp.lalumiere@gmail.com';
  adminImage = 'https://firebasestorage.googleapis.com/v0/b/lalumiere-af4a3.appspot.com/o/users%2Favatar.jpg?alt=media&token=eb735a65-c89a-4450-b294-b5ca2292bfa4';
  blankImage = 'https://firebasestorage.googleapis.com/v0/b/lalumiere-af4a3.appspot.com/o/users%2Fblank.jpg?alt=media&token=eb735a65-c89a-4450-b294-b5ca2292bfa4';
  fcmToken = '';
  serverKey = "AAAAWjt09DA:APA91bG9inm-aAPVhP5QxssJENKhT-V5zowAxTL4Uoeq8V91kRLjLkMpXNcnDq_K4Zv9GD8-nsKCIA3NDOLxWjN5sDhp3IT8bKaP5bx_k6MRZFWSLBxZNIMx1uo8bKle6vf9_2E5o16H";
  public hasPermission: boolean;
  public pushPayload: INotificationPayload;

  constructor(private loadingController: LoadingController, private platform: Platform, private http: HttpClient, private fcm: FCM, private alertController: AlertController, private router: Router, private firestore: AngularFirestore) { }

  isLoading = false;

  async showLoader() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => {
            //console.log('abort presenting')
          });
        }
      });
    })
      .catch((error) => {
        //console.log(error)
      });
  }

  async hideLoader() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => {
      // console.log('dismissed')
    }).catch((error) => {
      //console.log(error)
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



  /* initializeFCMX(email) {
     console.log("subscribed to " + email)
     if (this.fcmToken == '') {
       return;
     }
     // subscribe to a topic
     this.fcm.subscribeToTopic(email);
     this.fcm.subscribeToTopic("announcements");
 
     // get FCM token
     this.fcm.getToken().then(token => {
       this.fcmToken = token;
       console.log(token);
     });
 
     // ionic push notification example
     this.fcm.onNotification().subscribe(data => {
       console.log("onNotification called")
       console.log(data);
       if (data.wasTapped) {
         console.log('Receiveddd in background');
         this.router.navigate([data.action])
       } else {
         console.log('Receivessd in foreground');
         this.router.navigate([data.action])
       }
     });
 
     // refresh the FCM token
     this.fcm.onTokenRefresh().subscribe(token => {
       this.fcmToken = token;
       console.log(token);
     });
 
   }*/

  async initializeFCM(email) {
    if (!this.platform.is('cordova')) {
      return;
    }

    this.fcm.subscribeToTopic(email);
    this.fcm.subscribeToTopic("announcements");

    this.fcm.onTokenRefresh().subscribe((newToken) => {
      this.fcmToken = newToken;
    });

    this.fcm.onNotification().subscribe((payload) => {
      this.pushPayload = payload;
      console.log('getToken result: ', this.fcmToken);

      if (payload.wasTapped) {
        console.log('Received in background');
        this.router.navigate([payload.action])
      } else {
        console.log('Received in foreground');
      }

    });

    this.hasPermission = await this.fcm.requestPushPermission();

    this.fcmToken = await this.fcm.getToken();
    console.log('getToken result: ', this.fcmToken);

    this.pushPayload = await this.fcm.getInitialPushPayload();
    console.log('getInitialPushPayload result: ', this.pushPayload);
  }

  unsubscribeFCM(email) {

    if (this.fcmToken == '') {
      return;
    }
    else {
      console.log("Unsubscribing")
      this.fcm.unsubscribeFromTopic(email);
      this.fcm.unsubscribeFromTopic("announcements");
    }
  }

  unreadChat(email, value) {
    this.firestore.collection('users').doc(email)
      .update({ unreadChats: firebase.default.firestore.FieldValue.arrayUnion(value) }).then(() => {

      }).catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  readChat(email, value) {
    this.firestore.collection('users').doc(email)
      .update({ unreadChats: firebase.default.firestore.FieldValue.arrayRemove(value) }).then(() => {

      }).catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  retrieveBlacklistedWordsDocRef()
  {
    return this.firestore.collection('settings').doc('backlist');
  }

  retrieveTermsAndConditionsDocRef()
  {
    return this.firestore.collection('settings').doc('terms');
  }

  retrievePrivacyPolicyDocRef()
  {
    return this.firestore.collection('settings').doc('privacypolicy');
  }

  // Collection: profilepics

  getAllProficPics() {
    return this.firestore.collection('profilepics').valueChanges({ idField: 'email' });
  }

  // Collection: categories

  getActiveCategories() {
    return this.firestore.collection('categories', ref => ref.where("active", "==", true).orderBy("name", "asc")).valueChanges({ idField: 'id' });
  }

  getAllCategories() {
    return this.firestore.collection('categories', ref => ref.orderBy("name", "asc")).valueChanges({ idField: 'id' });
  }

  updateCategory(catId, name, active) {
    this.firestore.collection('categories').doc(catId).update({ name: name, active: active }).then((order) => {
      // route to somewhere
    }).catch((error) => {
      console.log("Error " + error.code + ": " + error.message);
    });
  }

  // Collection: deliverymodes

  getActiveDeliveryModes() {
    return this.firestore.collection('deliverymodes', ref => ref.where("active", "==", true).orderBy("name", "asc")).valueChanges({ idField: 'id' });
  }

  getAllDeliveryModes() {
    return this.firestore.collection('deliverymodes', ref => ref.orderBy("name", "asc")).valueChanges({ idField: 'id' });
  }

  updateDeliveryMode(modeId, name, active) {
    this.firestore.collection('deliverymodes').doc(modeId).update({ name: name, active: active }).then((order) => {
      // route to somewhere
    }).catch((error) => {
      console.log("Error " + error.code + ": " + error.message);
    });
  }

  // Collection: socialmedia

  // getActiveSocial() {
  //   return this.firestore.collection('socialmedia', ref => ref.where("active", "==", true).orderBy("name", "asc")).valueChanges({ idField: 'id' });
  // }

  // getAllSocial() {
  //   return this.firestore.collection('socialmedia', ref => ref.orderBy("name", "asc")).valueChanges({ idField: 'id' });
  // }

  // updateSocial(modeId, name, active) {
  //   this.firestore.collection('socialmedia').doc(modeId).update({ name: name, active: active }).then((order) => {
  //     // route to somewhere
  //   }).catch((error) => {
  //     console.log("Error " + error.code + ": " + error.message);
  //   });
  // }

  // Collection: ads

  getActiveAds(today) {
    return this.firestore.collection('ads', ref => ref.where("status", "==", "A").where("expireDate", ">", today)).valueChanges({ idField: 'id' });
  }

  getPendingAds() {
    return this.firestore.collection('ads', ref => ref.where("status", "==", "P")).valueChanges();
  }

  getAllAds() {
    return this.firestore.collection('ads').valueChanges({ idField: 'id' });
  }

  addAds(file, path, IMGname, activeDate, expireDate, image, info, paymentMode, type, requester, requester_un) {
    this.showLoader();
    var ad = null;

    this.firestore.collection('ads')
      .add({ requester: requester, activeDate: activeDate, expireDate: expireDate, image: image, info: info, paymentMode: paymentMode, status: 'P', type: type, requestDate: new Date(), lastUpdated: new Date() })
      .then((ad1) => {
        ad = ad1;
        file.readAsArrayBuffer(path, IMGname).then(async (buffer) => {
          await this.putInCloudStorageAds(buffer, ad1.id+IMGname, ad1.id)
        });
    
        //add new chat
        this.newAdminMessage(requester, "Hi, I had an advertisement request for my " + (type == 1 ? "event (" + info +")": "store")+", from " + activeDate + " to " + expireDate +". I will make payment via " + paymentMode + ". Request No.: " + ad.id, requester_un);
        this.newNotification("Advertisement Request", "New advertisement request received from " + requester_un, '/manage-ads-featured-products', this.adminEmail.replace("@", ""))
        this.unreadChat(this.adminEmail, 'admin' + requester);
        this.confirmAlert('Success', 'Your advertisement request has been submitted successfully.');
        this.router.navigate(['/chat-details', 'admin' + requester]);
      })
      .then(() => {
        this.hideLoader();
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  async putInCloudStorageAds(buffer, name, adId) {
    let blob = new Blob([buffer], { type: "image/jpeg" });

    let storage = firebase.default.storage();

    storage.ref('ads/' + name).put(blob).then((d) => {
      let imgURL = storage.ref('ads/' + name).getDownloadURL().then((r) => {
        this.firestore.collection('ads').doc(adId).update({ image: r })
      }).catch((error) => {
        alert(JSON.stringify(error))
      })
    }).catch((error) => {
      alert(JSON.stringify(error))
    })
  }

  updateAds(file, path, IMGname, id, activeDate, expireDate, image, info, paymentMode, type) {
    this.showLoader();
    this.firestore.collection('ads').doc(id)
      .update({ activeDate: activeDate, expireDate: expireDate, image: image, info: info, paymentMode: paymentMode, type: type, lastUpdated: new Date() })
      .then((ad) => {
        if (IMGname != '')
          file.readAsArrayBuffer(path, IMGname).then(async (buffer) => {
            await this.putInCloudStorageAds(buffer, IMGname, id)
          });
      })
      .then(() => {
        //add new chat
        this.confirmAlert('Success', 'Advertisement request has been updated successfully.');
        this.router.navigate(['/manage-ads-featured-products']);
      })
      .then(() => {
        this.hideLoader();
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  approveAds(id, requester, requester_un) {
    this.firestore.collection('ads').doc(id).update({ status: 'A' }).then((order) => {
      this.newAdminMessage(requester, "Hi, your advertisement request is approved. Request No.: " + id, requester_un);
      this.newNotification("Advertisement Approved", "Great news! Your advertisement request had been approved.", '/chat-details/admin' + requester, requester.replace("@", ""))
      this.router.navigate(['/manage-ads-featured-products']);
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  rejectAds(id, requester, requester_un) {
    this.firestore.collection('ads').doc(id).update({ status: 'R' }).then((order) => {
      this.newAdminMessage(requester, "Hi, your advertisement request is rejected. Request No.: " + id, requester_un);
      this.newNotification("Advertisement Rejected", "Sorry! Your advertisement request is rejected.", '/chat-details/admin' + requester, requester.replace("@", ""))
      this.unreadChat(this.adminEmail, 'admin' + requester);
      this.router.navigate(['/manage-ads-featured-products']);
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  deleteAds(id) {
    this.firestore.collection('ads').doc(id).delete().then((order) => {
      this.confirmAlert('Success', 'Advertisement deleted successfully.');
      this.router.navigate(['/manage-ads-featured-products']);
    }).catch((error) => {
      console.log("Error " + error.code + ": " + error.message);
    });
  }

  getAdsById(id) {
    return this.firestore.collection('ads').doc(id).valueChanges({ idField: 'id' });
  }

  // Collection: products

  getSomeFeaturedProducts() {
    return this.firestore.collection('products', ref => ref.where("qty", ">", 0).where("featured", "==", true).orderBy("qty").orderBy("dateAdded").limit(20)).valueChanges({ idField: 'id' });
  }

  getAllFeaturedProducts() {
    return this.firestore.collection('products', ref => ref.where("qty", ">", 0).where("featured", "==", true).orderBy("qty").orderBy("dateAdded")).valueChanges({ idField: 'id' });
  }

  getProductById(id) {
    return this.firestore.collection('products').doc(id).valueChanges({ idField: 'id' });
  }

  getMyProducts(email) {
    return this.firestore.collection('products', ref => ref.where("seller", "==", email)).valueChanges({ idField: 'id' });
  }

  getMyUnfeaturedProducts(email) {
    return this.firestore.collection('products', ref => ref.where("seller", "==", email).where("featured", "==", false).where("qty", ">", 0)).valueChanges({ idField: 'id' });
  }

  getActiveProducts(email) {
    return this.firestore.collection('products', ref => ref.where("qty", ">", 0).where("seller", "==", email)).valueChanges({ idField: 'id' });
  }

  getAllActiveProducts() {
    return this.firestore.collection('products', ref => ref.where("qty", ">", 0)).valueChanges({ idField: 'id' });
  }

  getAllProducts() {
    return this.firestore.collection('products').valueChanges({ idField: 'id' });
  }

  getMyFavourites(favourites) {
    return this.firestore.collection('products', ref => ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', favourites)).valueChanges({ idField: 'id' });
  }

  decreaseQty(productId, left, orderId) {
    this.firestore.collection('products').doc(productId).update({ qty: left }).then((order) => {
      this.router.navigate(['/order-details', orderId]);
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  increaseQty(productId, qty) {
    this.firestore.collection('products').doc(productId).update({ qty: firebase.default.firestore.FieldValue.increment(qty) }).then((order) => {
      // route to somewhere
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  addProduct(file, path, IMGname, specialevent, category, deliveryMode, description, images, name, price, qty, seller, seller_un) {
    this.showLoader();
    var p = null;
    this.firestore.collection('products')
      .add({ seller_un: seller_un, specialevent: specialevent, category: category, deliveryMode: deliveryMode, description: description, images: images, name: name, price: price, qty: qty, seller: seller, featured: false, dateAdded: new Date(), lastUpdated: new Date() })
      .then((product) => {
        p = product;
        for (let i = 0; i < IMGname.length; i++) {
          file.readAsArrayBuffer(path[i], IMGname[i]).then(async (buffer) => {
            await this.putInCloudStorage(buffer, product.id+IMGname[i], product.id)
          });
        }
      })
      .then(() => {
        this.confirmAlert('Success', 'New product added successfully.');
        this.router.navigate(['/product-details', p.id]);
      })
      .then(() => {
        this.hideLoader();
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
        return null;
      });
  }

  async putInCloudStorage(buffer, name, productId) {
    let blob = new Blob([buffer], { type: "image/jpeg" });

    let storage = firebase.default.storage();

    storage.ref('products/' + name).put(blob).then((d) => {
      let imgURL = storage.ref('products/' + name).getDownloadURL().then((r) => {
        this.firestore.collection('products').doc(productId).update({ images: firebase.default.firestore.FieldValue.arrayUnion(r) })
      }).catch((error) => {
        console.log(JSON.stringify(error))
      })
    }).catch((error) => {
      console.log(JSON.stringify(error))
    })
  }

  updateProduct(file, path, IMGname, id, data) {
    this.showLoader();
    this.firestore.collection('products').doc(id)
      .update(data)
      .then((product) => {
        for (let i = 0; i < IMGname.length; i++) {
          file.readAsArrayBuffer(path[i], IMGname[i]).then(async (buffer) => {
            await this.putInCloudStorage(buffer, id+IMGname[i], id)
          });
        }
      }).then(() => {
        this.confirmAlert('Success', 'Product details updated successfully.');
        this.router.navigate(['/product-details', id]);
      }).then(() => {
        this.hideLoader();
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  deleteProduct(id) {
    this.firestore.collection('orders', ref => ref.where("productId", "==", id)).valueChanges().subscribe((results) => {
      if (results.length > 0) {
        // cannot allow user to delete
        this.confirmAlert('Error', 'Product exists in orders, unable to delete.');
      }
      else {
        this.firestore.collection('products').doc(id).delete().then(() => {
          this.confirmAlert('Success', 'Product deleted successfully.');
          this.router.navigate(['/profile']);
        }).catch((error) => {
          console.log("Error " + error.code + ": " + error.message);
        });
      }
    }, (error) => {
      console.log("Error " + error.code + ": " + error.message);
    });

  }

  // Collection: orders

  addOrder(name, seller, buyer, productId, qty, deliveryMode, paymentMode, price, image, left, buyer_un, seller_un) {
    this.firestore.collection('orders')
      .add({ name: name, seller: seller, seller_un: seller_un, buyer: buyer, productId: productId, qty: qty, deliveryMode: deliveryMode, paymentMode: paymentMode, price: price, image: image, status: "Reserved", orderDate: new Date(), lastUpdated: new Date() })
      .then((order) => {
        this.decreaseQty(productId, left, order.id);
        this.newChat(image, name, productId, buyer, seller, "Hi, I had reserved " + name + " (x" + qty + ") at the unit price of S$" + price + ". I had opted for delivery via " + deliveryMode + ". I will make payment via " + paymentMode + ". Order No.: " + order.id, buyer_un, seller_un);
        this.newNotification("New Order: " + order.id, "An order was made by " + buyer_un, '/order-details/' + order.id, seller.replace("@", ""))
        this.unreadChat(seller, productId + buyer);
        this.confirmAlert('Success', 'New order submitted successfully.');
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  getOrdersByMths(mth1, mth2) {
    return this.firestore.collection('orders', ref => ref.where("status", "==", "Completed").where("orderDate", ">=", mth1).where("orderDate", "<", mth2)).valueChanges({ idField: 'id' });
  }

  getMyOrdersByMths(user, mth1, mth2) {
    return this.firestore.collection('orders', ref => ref.where("seller", "==", user).where("status", "==", "Completed").where("orderDate", ">=", mth1).where("orderDate", "<", mth2)).valueChanges({ idField: 'id' });
  }

  getOrderById(id) {
    return this.firestore.collection('orders').doc(id).valueChanges({ idField: 'id' });
  }

  getMySales(me) {
    return this.firestore.collection('orders', ref => ref.where("seller", "==", me).orderBy("orderDate")).valueChanges({ idField: 'id' });
  }

  getMyPurchases(me) {
    return this.firestore.collection('orders', ref => ref.where("buyer", "==", me).orderBy("orderDate")).valueChanges({ idField: 'id' });
  }

  rejectOrder(orderId, productId, qty, buyer, sender) {
    this.firestore.collection('orders').doc(orderId).update({ status: "Rejected", lastUpdated: new Date() }).then((order) => {
      this.increaseQty(productId, qty);
      this.newMessage("Order Rejected", productId + buyer, sender, "Hi, your order is rejected. Order No.: " + orderId, buyer, '/order-details/' + orderId);
      this.unreadChat(buyer, productId + buyer);
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  acceptOrder(orderId, productId, buyer, sender) {
    this.firestore.collection('orders').doc(orderId).update({ status: "Confirmed", lastUpdated: new Date() }).then((order) => {
      this.newMessage("Order Accepted", productId + buyer, sender, "Hi, your order ia accepted. Order No.: " + orderId, buyer, '/order-details/' + orderId);
      this.unreadChat(buyer, productId + buyer);
      // route to somewhere
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  sendOrder(orderId, productId, buyer, sender) {
    this.firestore.collection('orders').doc(orderId).update({ status: "In-Transit", lastUpdated: new Date() }).then((order) => {
      this.newMessage("Items are on the way!", productId + buyer, sender, "Hi, your items had been sent out. Order No.: " + orderId, buyer, '/order-details/' + orderId);
      this.unreadChat(buyer, productId + buyer);
      // route to somewhere
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  receivedOrder(orderId, productId, buyer,  sender) { //me, seller
    this.firestore.collection('orders').doc(orderId).update({ status: "Completed", lastUpdated: new Date() }).then((order) => {
      this.newMessage("Items received by buyer!", productId + buyer, buyer, "Hi, I have received my items. Order No.: " + orderId, sender, '/order-details/' + orderId);
      this.unreadChat(sender, productId + buyer);
      // route to somewhere
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  // Collection: chats

  newChat(image, productName, productId, buyer, seller, text, buyer_un, seller_un) {
    var newMsg = {
      sender: buyer,
      text: text,
      date: new Date()
    };

    this.firestore.collection('chats').doc(productId + buyer)
      .update({ messages: firebase.default.firestore.FieldValue.arrayUnion(newMsg) }) // try to append to existing message
      .then((chat) => {

      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
        this.firestore.collection('chats').doc(productId + buyer) // does not exist, add a new document
          .set({ buyer_un: buyer_un, seller_un: seller_un, image: image, productName: productName, productId: productId, buyer: buyer, seller: seller, messages: [newMsg] }).then((chat) => {

          }).catch((error) => {
            console.log("Error " + error.code + ": " + error.message);
          });
      });
  }

  newAdminChat(user, text, seller_un) {
    var newMsg = {
      sender: this.adminEmail,
      text: text,
      date: new Date()
    };

    this.firestore.collection('chats').doc("admin" + user).set({ seller_un: seller_un, buyer_un: "Admin", image: '', buyer: this.adminEmail, seller: user, messages: [newMsg] });
      this.router.navigate(['/login']);
     
  }

  newAdminMessage(user, text, buyer_un) {
    var newMsg = {
      sender: user,
      text: text,
      date: new Date()
    };

    this.firestore.collection('chats').doc("admin" + user) // does not exist, add a new document
      .update({ messages: firebase.default.firestore.FieldValue.arrayUnion(newMsg) }).then((chat) => {

      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  newNotification(title, message, route, topic) {
    console.log("noti called")
    let body = {
      "notification": {
        "title": title,
        "body": message,
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon",
        "lights": true, // enable lights for notifications
        "vibration": true // enable vibration for notifications
      },
      "data": {
        "action": route
      },
      "to": "/topics/" + topic,
      "priority": "high"
    }
    let options = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send", body, {
      headers: options.set('Authorization', 'key=' + this.serverKey),
    }).subscribe();
  }

  newMessage(title, id, sender, text, receiver, route) {
    var newMsg = {
      sender: sender,
      text: text,
      date: new Date()
    };
    
    this.firestore.collection('chats').doc(id)
      .update({ messages: firebase.default.firestore.FieldValue.arrayUnion(newMsg) }) // try to append to existing message
      .then((chat) => {
        this.newNotification(title, text, route, receiver.replace("@", ""))
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  getChatById(id) {
    return this.firestore.collection('chats').doc(id).valueChanges({ idField: 'id' });
  }

  getChatByBuyer(email) {
    return this.firestore.collection('chats', ref => ref.where("buyer", "==", email)).valueChanges({ idField: 'id' });
  }

  getChatBySeller(email) {
    return this.firestore.collection('chats', ref => ref.where("seller", "==", email)).valueChanges({ idField: 'id' });
  }

  // Collection: announcements

  addAnnouncement(title, message, category) {
    this.firestore.collection('announcements')
      .add({ title: title, message: message, category: category, date: new Date() })
      .then((data) => {
        this.firestore.collection("users").get().toPromise().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.update({ readA: false })
          });
        }).then(() => {
          this.newNotification("Announcement: " + title, message, '/announcements', "announcements")
          this.router.navigate(['/announcements']);
        });
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  deleteAnnouncement(id) {
    return this.firestore.collection('announcements').doc(id).delete().then(() => {

    }).catch((error) => {
      console.log("Error " + error.code + ": " + error.message);
    });
  }


  getAllAnnouncements() {
    return this.firestore.collection('announcements', ref => ref.orderBy("date", "desc")).valueChanges({ idField: 'id' });
  }

  // Collection: featuredrequests

  addFeaturedRequest(image, productId, productName, paymentMode, requester, requester_un) {
    var count = 0;
    this.firestore.collection('featuredrequests', ref => ref.where("productId", "==", productId).where("status", "==", 'P')).get().forEach((x) => {
      if (x.docs.length > 0) this.confirmAlert('Alert', 'Duplicate request. Please kindly wait for your earlier request to be processed.');
      else {
        this.firestore.collection('featuredrequests')
          .add({ requester_un: requester_un, image: image, requester: requester, productId: productId, productName: productName, paymentMode: paymentMode, status: 'P', requestDate: new Date(), lastUpdated: new Date() })
          .then((req) => {
            this.confirmAlert('Success', 'Request for product to be featured submitted successfully.');
            this.newAdminMessage(requester, "Hi, I had a request for my product (" + productName +  ") to be featured. I will make payment via " + paymentMode + ". Request No.: " + req.id, requester_un);
            this.newNotification("Feature Request", "New feature request received from " + requester_un, '/manage-ads-featured-products', this.adminEmail.replace("@", ""))
            this.unreadChat(this.adminEmail, 'admin' + requester);
            this.router.navigate(['/chat-details', 'admin' + requester]);
          })
          .catch((error) => {
            console.log("Error " + error.code + ": " + error.message);
          });
      }
    })
  }

  getAllFeaturedRequest() {
    return this.firestore.collection('featuredrequests').valueChanges({ idField: 'id' });
  }

  getPendingFeaturedRequest() {
    return this.firestore.collection('featuredrequests', ref => ref.where("status", "==", "P")).valueChanges();
  }

  approveFeaturedRequest(id, productId, requester, requester_un) {
    this.firestore.collection('featuredrequests').doc(id)
      .update({ status: 'A', lastUpdated: new Date() })
      .then((req) => {
        this.firestore.collection('products').doc(productId).update({ featured: true }).then((product) => {
          this.newAdminMessage(requester, "Hi, your featured product request is approved. Request No.: " + id, requester_un);
          this.newNotification("Featured Request Approved", "Great news! Your request for your product to be featured is approved.", '/chat-details/admin' + requester, requester.replace("@", ""))
          this.unreadChat(this.adminEmail, 'admin' + requester);
          this.router.navigate(['/manage-ads-featured-products']);
        }).catch((error) => {
          console.log("Error " + error.code + ": " + error.message);
        });
      }).catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  rejectFeaturedRequest(id, productId, requester, requester_un) {
    this.firestore.collection('featuredrequests').doc(id)
      .update({ status: 'R', lastUpdated: new Date() })
      .then((req) => {
        this.firestore.collection('products').doc(productId).update({ featured: false }).then((product) => {
          this.newAdminMessage(requester, "Hi, your featured product request is rejected. Request No.: " + id, requester_un);
          this.newNotification("Featured Request Rejected", "Sorry! Your request for your product to be featured is rejected.", '/chat-details/admin' + requester, requester.replace("@", ""))
          this.unreadChat(this.adminEmail, 'admin' + requester);
          this.router.navigate(['/manage-ads-featured-products']);
        }).catch((error) => {
          console.log("Error " + error.code + ": " + error.message);
        });
      }).catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  // Collection: reports

  addReport(productId, productName, image, message, requester, requester_un) {
    this.firestore.collection('reports')
      .add({ productId: productId, productName: productName, image: image, message: message, status: 'P', requester: requester, reportDate: new Date(), lastUpdated: new Date() })
      .then((req) => {
        this.confirmAlert('Success', 'Report submitted successfully.');
        this.newAdminMessage(requester, "Hi, I would like to report the product (" + productName +  "). Reason: " +message + " Report No.: "+ req.id, requester_un);
        this.newNotification("Report", "A report was made by " + requester_un, '/manage-reports' , this.adminEmail.replace("@", ""))
        this.unreadChat(this.adminEmail, 'admin' + requester);
        let navigationExtras: NavigationExtras = {
          state: {
            seller: requester,
            buyer: this.adminEmail
          }
        };
        this.router.navigate(['/chat-details', 'admin' + requester], navigationExtras);
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  getAllReports() {
    return this.firestore.collection('reports', ref => ref.orderBy("reportDate", "desc")).valueChanges({ idField: 'id' });
  }

  getPendingReports() {
    return this.firestore.collection('reports', ref => ref.where("status", "==", "P")).valueChanges();
  }

  markAsAttended(id) {
    this.firestore.collection('reports').doc(id)
      .update({ status: 'A', lastUpdated: new Date() })
      .then((result) => {
        this.router.navigate(['/manage-reports']);
      })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  // Collection: settings

  getSpecialEvent() {
    return this.firestore.collection('settings').doc("specialevent").valueChanges();
  }

  updateSpecialEvent(name, active) {
    this.firestore.collection('settings').doc("specialevent").update({ name: name, active: active }).then((result) => {
      if (!active) {
        this.firestore.collection("products").ref.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.update({
              specialevent: false
            });
          });
        }).then(() => {
          this.router.navigate(['/manage-special-event']);
        });
      } else this.router.navigate(['/manage-special-event']);
    })
      .catch((error) => {
        console.log("Error " + error.code + ": " + error.message);
      });
  }

  // Listing Special Events

  getAllSpecialEventsProducts() { 

    return this.firestore.collection('products', ref => ref.where("qty", ">", 0).where("specialevent", "==", true)).valueChanges({ idField: 'id' }); 

  } 
}
