import { NavParams, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-pop-over-share',
  templateUrl: './pop-over-share.page.html',
  styleUrls: ['./pop-over-share.page.scss'],
})
export class PopOverSharePage implements OnInit {

  id;
  image;
  name;
  user;
  username;

  constructor(public fsService:FirestoreService, public navParams:NavParams, private alertController: AlertController, public popoverController: PopoverController) { 
    this.id = this.navParams.get('id');
    this.image = this.navParams.get('image');
    this.name = this.navParams.get('name');
    this.user = this.navParams.get('user');
    this.username = this.navParams.get('username');
  }

  ngOnInit() {
  }

  async reportAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Report this product',
      mode: 'ios',
      inputs: [
        {
          name: 'details',
          type: 'textarea',
          placeholder: 'Details'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Send',
          handler: data => {
            this.fsService.addReport(this.id, this.name, this.image, data.details, this.user, this.username)
          }
        }
      ]
    });

    await alert.present();
  }

  close() {
    this.popoverController.dismiss();
  }

}
