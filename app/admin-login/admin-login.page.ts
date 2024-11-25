import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
})
export class AdminLoginPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Forgot Password?',
      mode: 'ios',
      message: 'Please input your email address for verification to reset password',
      inputs: [
        {
          name: 'Email Address',
          type: 'email',
          placeholder: 'Email Address'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'btn-reset',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Reset',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }


}
