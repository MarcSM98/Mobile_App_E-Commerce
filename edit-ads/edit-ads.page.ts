import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { File } from "@ionic-native/file/ngx";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-edit-ads',
  templateUrl: './edit-ads.page.html',
  styleUrls: ['./edit-ads.page.scss'],
})
export class EditAdsPage implements OnInit {

  todayPlus3 = '2021-01-10'
  max = '2022-01-10'

  ads: any = {};
  adsForm: FormGroup;

  currentUser;
  id;

  isLoading = false;

  imgpath = '';
  path= '';
  IMGname = '';

  image = '';

  sub1: Subscription;

  constructor(private toastController: ToastController, private alertController:AlertController, private storage: AngularFireStorage, private activatedRoute: ActivatedRoute,  private formBuilder: FormBuilder, private fsService: FirestoreService, private camera: Camera, private crop: Crop, private file: File, public actionSheetController: ActionSheetController) {
    this.fsService.showLoader();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.adsForm = formBuilder.group({
      activeDate: new Date(),
      expireDate: new Date(),
      info: '',
      requestDate: new Date(),
      paymentMode: '',
      requester: '',
      status: 'P',
      type: '1'
    });

    // Retrieve the product information through fsService
    this.sub1 = this.fsService.getAdsById(this.id).subscribe(result => {
      this.ads = result;
      this.ads.id = this.id;
      this.adsForm.controls.activeDate.setValue(this.formatDate(this.ads.activeDate.toDate()));
      this.adsForm.controls.expireDate.setValue(this.formatDate(this.ads.expireDate.toDate()));
      this.adsForm.controls.info.setValue(this.ads.info);
      this.adsForm.controls.requestDate.setValue(this.formatDate(this.ads.requestDate.toDate()));
      this.adsForm.controls.paymentMode.setValue(this.ads.paymentMode);
      this.adsForm.controls.requester.setValue(this.ads.requester);
      this.adsForm.controls.status.setValue(this.ads.status);
      this.adsForm.controls.type.setValue(this.ads.type);
      this.image = this.ads.image;
      /*this.ads.imageProcessed = '';

      this.storage.ref(this.ads.image).getDownloadURL().subscribe((img) => {
        this.ads.imagesProcessed = img;
      });*/

      this.fsService.hideLoader();
    });
  }

  formatDate(date) {
    var d = new Date(date);
    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    return (ye + "-" + mo + "-" + da);
  }

  async deleteAds() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Are you sure you want to delete this advertisement?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.fsService.deleteAds(this.id);
          }
        }
      ]
    });

    await alert.present();
  }

  removeImage() {
    this.image = '';
  }

  removeNewImage() {
    this.imgpath = '';
    this.path = '';
    this.IMGname ='';
  }

  updateAds() {
    if (this.checkIfFieldNullOrEmpty("Event URL/Seller Email", this.adsForm.value.info)) return;
    if (this.checkIfFieldNullOrEmpty("Image", this.imgpath)) return;
    this.fsService.updateAds(this.file, this.path, this.IMGname, this.id, new Date(this.adsForm.value.activeDate),  new Date(this.adsForm.value.expireDate), this.image, this.adsForm.value.info, this.adsForm.value.paymentMode, this.adsForm.value.type);
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
    this.path = filePath;
    this.IMGname = imageName;

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.imgpath = base64;
      this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
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
            if (this.IMGname != '' || this.image != '') this.fsService.confirmAlert("Alert", "You can only upload a maximum of 1 banner per advertisement.")
            else this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Camera",
          icon: "camera-outline",
          handler: () => {
            if (this.IMGname != '' || this.image != '') this.fsService.confirmAlert("Alert", "You can only upload a maximum of 1 banner per advertisement.")
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

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

}
