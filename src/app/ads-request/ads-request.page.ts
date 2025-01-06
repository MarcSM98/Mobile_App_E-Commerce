import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { File } from "@ionic-native/file/ngx";
import { Observable, Subscription } from "rxjs";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ads-request',
  templateUrl: './ads-request.page.html',
  styleUrls: ['./ads-request.page.scss'],
})
export class AdsRequestPage implements OnInit {

  isLoading = false;

  downloadURL: Observable<string>;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  imgpath = '';
  path = '';
  IMGname = '';

  todayPlus3 = '2021-01-10'
  max = '2022-01-10'

  product: any = {};
  adsForm: FormGroup;
  currentUser

  sub1: Subscription;

  constructor(private toastController: ToastController, private alertController: AlertController, private authService: AuthService, private formBuilder: FormBuilder, private fsService: FirestoreService, private camera: Camera, private crop: Crop, private file: File, public actionSheetController: ActionSheetController) {
    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    })

    this.setDate();

    this.adsForm = formBuilder.group({
      activeDate: this.todayPlus3,
      numDays: '3',
      image: '',
      info: '',
      paymentMode: 'PayLah',
      type: '1',
    });
  }

  setDate() {
    var d = new Date();
    d.setDate(d.getDate() + 7)

    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    this.todayPlus3 = ye + "-" + mo + "-" + da;
    this.max = (parseInt(ye) + 1) + "-" + mo + "-" + da;
  }

  async confirmAlert() {
    if (this.checkIfFieldNullOrEmpty("Event URL/Seller Email", this.adsForm.value.info)) return;
    if (this.checkIfFieldNullOrEmpty("Image", this.imgpath)) return;
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'Proceed with advertisement request?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.addAds();
          }
        }
      ]
    });

    await alert.present();
  }

  addAds() {
    var image = '';

    this.fsService.addAds(this.file, this.path, this.IMGname, new Date(this.adsForm.value.activeDate), this.getExpireDate(this.adsForm.value.activeDate, parseInt(this.adsForm.value.numDays)), image, this.adsForm.value.info, this.adsForm.value.paymentMode, this.adsForm.value.type, this.currentUser.email, this.currentUser.username);
  }

  removeNewImage() {
    this.imgpath = '';
    this.path = '';
    this.IMGname = '';
  }

  getExpireDate(activeDate, numDays) {
    var d = new Date(activeDate);
    d.setDate(d.getDate() + numDays + 1)

    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    return new Date(ye + "-" + mo + "-" + da);
  }

  ngOnInit() {
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 427,
      targetWidth: 640
    }
    this.camera.getPicture(options).then((imageData) => {
      this.showCroppedImage(imageData.split('?')[0])
    }, (err) => {
      // Handle error
    });
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
      
      this.isLoading = false;

      var img = new Image();

      img.onload = (() => {
        if (img.height == 427 && img.width == 640)
          this.imgpath = base64;
        else { 
          this.imgpath = '';
          this.showToast();
        }
      });

      img.src = base64;

    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }

  showToast() {
    this.toastController.create({
      message: 'Image must be in the dimension of 427 x 640 (height x width).',
      duration: 2000,
      position: 'bottom'
    }).then((toastData) => {
      toastData.present();
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
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        /* {
           text: "Camera",
           icon: "camera-outline",
           handler: () => {
             this.pickImage(this.camera.PictureSourceType.CAMERA);
           },
         },*/
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

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

}
