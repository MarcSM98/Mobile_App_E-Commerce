import { ActionSheetController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { File } from "@ionic-native/file/ngx";
import { Observable, Subscription } from "rxjs";
import * as firebase from "firebase";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {

  categories: any = [];
  modes: any = [];
  productForm: FormGroup;
  product: any = {};
  specialEvent: any = { name: '', active: false };

  blacklisted_words = [];

  isLoading = false;

  downloadURL: Observable<string>;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  imgpath = [];
  path= [];
  IMGname = [];

  images = [];

  currentUser;

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;

  constructor(private toastController: ToastController, private alertController: AlertController, private activatedRoute: ActivatedRoute, private authService: AuthService, private formBuilder: FormBuilder, public actionSheetController: ActionSheetController, private fsService: FirestoreService, private storage: AngularFireStorage, private camera: Camera, private crop: Crop, private file: File) {
    this.fsService.showLoader();
    this.sub1 = this.fsService.getSpecialEvent().subscribe((result) => {
      this.specialEvent = result;
    })

    this.sub2 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    })

    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.productForm = formBuilder.group({
      'name': '',
      'description': '',
      'qty': 1,
      'price': '',
      'category': '',
      'deliveryMode': [],
      'featured': false,
      'specialevent': false
    });

    // Retrieve the product information through fsService
    this.sub3 =  this.fsService.getActiveCategories().subscribe(result => {
      this.categories = result;
      this.sub4 = this.fsService.getActiveDeliveryModes().subscribe(result => {
        this.modes = result;

        this.sub5 = this.fsService.getProductById(id).subscribe(result => {
          this.product = result;
          this.product.id = id;
          this.productForm.controls.name.setValue(this.product.name);
          this.productForm.controls.description.setValue(this.product.description);
          this.productForm.controls.qty.setValue(this.product.qty);
          this.productForm.controls.price.setValue(this.product.price);
          this.productForm.controls.category.setValue(this.product.category);
          this.productForm.controls.deliveryMode.setValue(this.product.deliveryMode);
          this.productForm.controls.featured.setValue(this.product.featured);
          this.productForm.controls.specialevent.setValue(this.product.specialevent);
          this.images = this.product.images;
          /*this.product.imagesProcessed = [];
    
          for (let i = 0; i < this.product.images.length; i++) {
            this.storage.ref(this.product.images[i]).getDownloadURL().subscribe((img) => {
              this.product.imagesProcessed[i] = img;
            });
          }*/

          this.fsService.hideLoader();
        });
      });
    });

    let checkPass = true;
    let blacklistedWord = "";

    // check for blacklisted words
    this.blacklisted_words.forEach(word => {
      word = word.toLowerCase();
      if (this.productForm.value.msg.toLowerCase().includes(word))
      {
        checkPass = false;
        if (blacklistedWord == "") blacklistedWord += word;
      }
    })

    if (!checkPass) {
      this.showErrorMessage("Error: Please remove the blacklisted word: " + blacklistedWord);
      return;
    }


  }

  ngOnInit() {
    
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

  updateProduct() {
    let checkPass = true;
    let blacklistedWord = "";

    // check for blacklisted words
    this.blacklisted_words.forEach(word => {
      word = word.toLowerCase();
      if (this.productForm.value.msg.toLowerCase().includes(word))
      {
        checkPass = false;
        if (blacklistedWord == "") blacklistedWord += word;
      }
    })

    if (!checkPass) {
      this.showErrorMessage("Error: Please remove the blacklisted word: " + blacklistedWord);
      return;
    }

    var devMode = []
    if (typeof (this.productForm.value.deliveryMode) == 'string')
      devMode.push(this.productForm.value.deliveryMode);
    else
      devMode = this.productForm.value.deliveryMode;

    if (this.currentUser.isAdmin && this.specialEvent.active)
      this.fsService.updateProduct( this.file,
        this.path,
        this.IMGname,
        this.product.id, {
        featured: this.productForm.value.featured, // admin
        specialevent: this.productForm.value.specialevent, //special event
        category: this.productForm.value.category,
        deliveryMode: devMode,
        description: this.productForm.value.description,
        images: this.images,
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        qty: this.productForm.value.qty,
        lastUpdated: new Date()
      })
    else if (this.currentUser.isAdmin)
      this.fsService.updateProduct( this.file,
        this.path,
        this.IMGname,
        this.product.id, {
        featured: this.productForm.value.featured, // admin
        category: this.productForm.value.category,
        deliveryMode: devMode,
        description: this.productForm.value.description,
        images: this.images,
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        qty: this.productForm.value.qty,
        lastUpdated: new Date()
      })
    else if (this.specialEvent.active)
      this.fsService.updateProduct( this.file,
        this.path,
        this.IMGname,
        this.product.id, {
        specialevent: this.productForm.value.specialevent, //special event
        category: this.productForm.value.category,
        deliveryMode: devMode,
        description: this.productForm.value.description,
        images: this.images,
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        qty: this.productForm.value.qty,
        lastUpdated: new Date()
      })
    else
      this.fsService.updateProduct( this.file,
        this.path,
        this.IMGname,
        this.product.id, {
        category: this.productForm.value.category,
        deliveryMode: devMode,
        description: this.productForm.value.description,
        images: this.images,
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        qty: this.productForm.value.qty,
        lastUpdated: new Date()
      })
  }

  removeImage(id) {
    this.images.splice(id, 1);
  }

  removeNewImage(id) {
    this.imgpath.splice(id, 1);
    this.path.splice(id, 1);
    this.IMGname.splice(id, 1);
  }

  async confirmAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.deleteProduct();
          }
        }
      ]
    });
    await alert.present();
  }

  deleteProduct() {
    this.fsService.deleteProduct(this.product.id)
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
    });
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          alert('Error cropping image' + error);
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
      alert('Error in showing image' + error);
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
            if((this.IMGname.length + this.images.length) == 10) this.fsService.confirmAlert("Alert", "You can only upload a maximum of 10 images per product.")
            else this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Camera",
          icon: "camera-outline",
          handler: () => {
            if((this.IMGname.length + this.images.length) == 10) this.fsService.confirmAlert("Alert", "You can only upload a maximum of 10 images per product.")
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

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
    this.sub5.unsubscribe();
  }

}
