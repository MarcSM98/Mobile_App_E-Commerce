import { Component, OnInit } from "@angular/core";
import {ActionSheetController, ToastController} from "@ionic/angular";
import { FirestoreService } from "../firestore.service";
import { AuthService } from "../auth.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { File } from "@ionic-native/file/ngx";
import { Observable, Subscription } from "rxjs";
import * as firebase from "firebase";
//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.page.html",
  styleUrls: ["./add-product.page.scss"],
})
export class AddProductPage implements OnInit {
  
  isLoading = false;

  downloadURL: Observable<string>;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  imgpath = [];
  path = [];
  IMGname = [];
  blacklisted_words = [];

  categories: any = [];
  modes: any = [];
  productForm: FormGroup;
  specialEvent: any = { name: "", active: false };

  currentUser;

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public actionSheetController: ActionSheetController,
    private fsService: FirestoreService,
    private storage: AngularFireStorage,
    private camera: Camera,
    private crop: Crop,
    private file: File,
    private toastController: ToastController
  ) {
    this.sub1 = this.fsService.getSpecialEvent().subscribe((result) => {
      this.specialEvent = result;
    });

    this.sub2 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    });

    this.productForm = formBuilder.group({
      name: "",
      description: "",
      qty: 1,
      price: "",
      category: "",
      deliveryMode: [],
      specialevent: false,
      images: ""
    });

    this.sub3 = this.fsService.getActiveCategories().subscribe((result) => {
      this.categories = result;
      this.productForm.controls.category.setValue(this.categories[0].name);
    });

    this.sub4 = this.fsService.getActiveDeliveryModes().subscribe((result) => {
      this.modes = result;
      this.productForm.controls.deliveryMode.setValue(this.modes[0].name);
    });

    this.fsService.retrieveBlacklistedWordsDocRef().get().toPromise().then(res => {
      if (res.exists)
      {
        this.blacklisted_words = [];
        // @ts-ignore
        res.data().words.forEach(word => {
          this.blacklisted_words.push(word);
        })
      }
    })
  }

  ngOnInit() { }

  removeNewImage(id) {
    this.imgpath.splice(id, 1);
    this.path.splice(id, 1);
    this.IMGname.splice(id, 1);
  }

  addProduct() {

    // if (this.checkIfFieldNullOrEmpty("Image", this.file)) return;
    if (this.checkIfFieldNullOrEmpty("Product Name", this.productForm.value.name)) return;
    if (this.checkIfFieldNullOrEmpty("Description", this.productForm.value.description)) return;
    if (this.checkIfFieldNullOrEmpty("Quantity", this.productForm.value.qty)) return;
    if (this.checkIfFieldNullOrEmpty("Category", this.productForm.value.category)) return;
    if (this.checkIfFieldNullOrEmpty("Price", this.productForm.value.price)) return;
    if (this.path.length === 0)
    {
      this.showErrorMessage("Error: Please select at least one image!");
      return;
    }

    let checkPass = true;
    let blacklistedWord = "";

    // check for blacklisted words
    this.blacklisted_words.forEach(word => {
      word = word.toLowerCase();
      // console.log(this.productForm.value.name.toLowerCase());
      // console.log(word);
      if (this.productForm.value.name.toLowerCase().includes(word) || this.productForm.value.description.toLowerCase().includes(word))
      {
        checkPass = false;
        if (blacklistedWord == "") blacklistedWord += word;
      }
    })

    if (!checkPass)
    {
      this.showErrorMessage("Error: Please remove the blacklisted word: " + blacklistedWord);
      return;
    }

    // if (this.checkIfFieldNullOrEmpty("Email", this.productForm.value.email)) return;
    // if (this.checkIfFieldNullOrEmpty("Username", this.productForm.value.username)) return;


    var images = [];

    var specialValue = false;
    if (this.specialEvent.active)
      specialValue = this.productForm.value.specialevent;

    var devMode = [];
    if (typeof this.productForm.value.deliveryMode == "string")
      devMode.push(this.productForm.value.deliveryMode);
    else devMode = this.productForm.value.deliveryMode;

    this.fsService.addProduct(
      this.file,
      this.path,
      this.IMGname,
      specialValue,
      this.productForm.value.category,
      devMode,
      this.productForm.value.description,
      images,
      this.productForm.value.name,
      this.productForm.value.price,
      this.productForm.value.qty,
      this.currentUser.email,
      this.currentUser.username,
    );
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

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cropImage(imageData)
    }, (err) => {
      // Handle error
      this.showErrorMessage("Oops! Something went wrong when adding the image");
    });
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          console.log('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(imgpath) {
    this.isLoading = true;
    var copyPath = imgpath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = imgpath.split(imageName)[0];
    this.path.push(filePath);
    this.IMGname.push(imageName);

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.imgpath.push(base64);
      this.isLoading = false;
    }, error => {
      console.log('Error in showing image' + error);
      this.isLoading = false;
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Resources",
      mode: "md",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Select from Gallery",
          cssClass: "gallery",
          icon: "images-outline",
          handler: () => {
            if (this.IMGname.length == 10) this.fsService.confirmAlert("Alert", "You can only upload a maximum of 10 images per product.")
            else this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Camera",
          icon: "camera-outline",
          handler: () => {
            if (this.IMGname.length == 10) this.fsService.confirmAlert("Alert", "You can only upload a maximum of 10 images per product.")
            else this.pickImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async putInCloudStorage(buffer, name) {
    let blob = new Blob([buffer], { type: "image/jpeg" });

    let storage = firebase.default.storage();

    storage.ref('products/' + name).put(blob).then((d) => {
      let imgURL = storage.ref('products/' + name).getDownloadURL().then((r) => {

      }).catch((error) => {
        console.log(JSON.stringify(error))
      })
    }).catch((error) => {
      console.log(JSON.stringify(error))
    })
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  }
}



/*import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  categories: any = [];
  modes: any = [];
  productForm: FormGroup;
  specialEvent: any = {name:'', active:false};

  currentUser;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, public actionSheetController: ActionSheetController, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.getSpecialEvent().subscribe((result) => {
      this.specialEvent = result;
    })

    this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    })

    this.productForm = formBuilder.group({
      'name': '',
      'description': '',
      'qty': 1,
      'price': '',
      'category': '',
      'deliveryMode': [],
      'specialevent': false
    });

    this.fsService.getActiveCategories().subscribe(result => {
      this.categories = result;
      this.productForm.controls.category.setValue(this.categories[0].name);
    });

    this.fsService.getActiveDeliveryModes().subscribe(result => {
      this.modes = result;
      this.productForm.controls.deliveryMode.setValue(this.modes[0].name);
    });
  }

  ngOnInit() {
  }

  addProduct() {
    var images = ['https://firebasestorage.googleapis.com/v0/b/lalumiere-af4a3.appspot.com/o/products%2Fmac-product.jpg?alt=media&token=2f468aa0-ae6d-470b-ac24-5f25d6ad5dcd',
  'https://firebasestorage.googleapis.com/v0/b/lalumiere-af4a3.appspot.com/o/products%2Fgoogle-home.jpg?alt=media&token=ea79f8b3-ed76-4cc0-bb6e-d4304a5ec1b3g'];

  var specialValue = false;
  if (this.specialEvent.active)
    specialValue = this.productForm.value.specialevent;

  var devMode = []
  if (typeof(this.productForm.value.deliveryMode) == 'string')
    devMode.push(this.productForm.value.deliveryMode);
  else
    devMode = this.productForm.value.deliveryMode;

  this.fsService.addProduct(specialValue, this.productForm.value.category, devMode, this.productForm.value.description, images, this.productForm.value.name, this.productForm.value.price, this.productForm.value.qty, this.currentUser.email)
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Resources',
      mode: 'md',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Select from Gallery',
        cssClass: 'gallery',
        icon: 'images-outline',
        handler: () => {
          console.log('Gallery clicked');
        }
      }, {
        text: 'Camera',
        icon: 'camera-outline',
        handler: () => {
          console.log('Camera clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}*/
