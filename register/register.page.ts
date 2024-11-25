import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  promise: Promise<any>;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private toastController: ToastController) {
	  this.registerForm = formBuilder.group({
		  'email': '',
		  'password': '',
		  'confirm': ''
		});
  }
  
  googleSignIn() {
    this.authService.googleSignIn();  
  }

  ngOnInit() {
  }
  
  register() {
      if (this.checkIfFieldNullOrEmpty("Email", this.registerForm.value.email)) return;
      if (this.checkIfFieldNullOrEmpty("Password", this.registerForm.value.password)) return;
      if (this.checkIfFieldNullOrEmpty("Confirm Password", this.registerForm.value.confirm)) return;
      if (this.registerForm.value.password !== this.registerForm.value.confirm)
      {
          this.showErrorMessage("Error: Fields Password and Confirm Password must match!");
          return;
      }
      this.authService.register(this.registerForm.value.email, this.registerForm.value.password)
          .then(res => {
              console.log(res);
              this.authService.registerContinued(res, this.registerForm.value.email);
          })
          .catch(err => {
              console.log(err);
              this.showErrorMessage(err);
          })

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
