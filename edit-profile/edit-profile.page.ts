import { ActionSheetController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { File } from "@ionic-native/file/ngx";
import { Observable, Subscription } from "rxjs";
import { FirestoreService } from '../firestore.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  socialmd: any = [];
  
  currentUser;
  profileForm: FormGroup;

  isLoading = false;

  imgpath = '';
  path= '';
  IMGname = '';

  image = '';

  sub1: Subscription;
  sub2: Subscription;

  constructor(private fsService: FirestoreService, private formBuilder: FormBuilder, private authService: AuthService, private actionSheetController: ActionSheetController, private camera: Camera, private crop: Crop, private file: File) {
    this.fsService.showLoader();
    this.profileForm = formBuilder.group({
		  'fullname': '',
		  'mobile': '',
      'description': '',                          // Change
      'school': '',
      'course': '',
      'facebookurl': '',
      'instagramurl': '',
      'twitterurl': '',
      'name': '',
      'socialPlatform': []                        // Set to array                 
      // 'facebook': false,                       // Set toggle to false
      // 'instagram': false,
      // 'twitter': false                          
    });
    
    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
      this.profileForm.controls.fullname.setValue(this.currentUser.fullname);
      this.profileForm.controls.mobile.setValue(this.currentUser.mobile);
      this.profileForm.controls.description.setValue(this.currentUser.description);      // Change
      this.profileForm.controls.school.setValue(this.currentUser.school);                
      this.profileForm.controls.course.setValue(this.currentUser.course);
      this.profileForm.controls.facebookurl.setValue(this.currentUser.facebookurl);
      this.profileForm.controls.instagramurl.setValue(this.currentUser.instagramurl);
      this.profileForm.controls.twitterurl.setValue(this.currentUser.twitterurl);
      // this.profileForm.controls.facebook.setValue(this.currentUser.facebook);            
      // this.profileForm.controls.instagram.setValue(this.currentUser.instagram);
      // this.profileForm.controls.twitter.setValue(this.currentUser.twitter);                
      this.image = this.currentUser.image;
      this.fsService.hideLoader();
    });

    this.sub2 = this.authService.getActiveSocial().subscribe((result) => {       // retrieve info from social media collection
      this.socialmd = result;
      this.profileForm.controls.socialPlatform.setValue(this.socialmd[0].name);
    });
  }

  ngOnInit() {
  }

  updateProfile() {      // Change
    this.authService.update(this.currentUser.email, this.file, this.path, this.IMGname, this.profileForm.value.fullname, this.profileForm.value.mobile, this.profileForm.value.description, this.profileForm.value.school, this.profileForm.value.course, this.profileForm.value.socialPlatform, this.profileForm.value.facebookurl, this.profileForm.value.instagramurl, this.profileForm.value.twitterurl, this.image);      // Change
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
        {
          text: "Camera",
          icon: "camera-outline",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
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
  }

}
