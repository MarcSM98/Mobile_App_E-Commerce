import { Component, OnInit } from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	
	loginForm: FormGroup;
  buttonDisabled: boolean = false;

  constructor(private toastController: ToastController, private formBuilder: FormBuilder, private authService: AuthService, private alertController: AlertController) {
	  this.loginForm = formBuilder.group({
		  'email': '',
		  'password': ''
		});
  }
  
  googleSignIn() {
    this.authService.googleSignIn();  
  }

  ngOnInit() {
  }
  
  login() {
    if (this.checkIfFieldNullOrEmpty("Email", this.loginForm.value.email)) return;
    if (this.checkIfFieldNullOrEmpty("Password", this.loginForm.value.password)) return;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Forgot Password?',
      message: 'Please input your email address for verification to reset password',
      inputs: [
        {
          name: 'email',
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
          handler: data => {
            console.log('Confirm Ok');
			      console.log(data.email);
			      this.authService.sendResetLink(data.email)
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.loginForm = this.formBuilder.group({
		  'email': '',
		  'password': ''
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
}
