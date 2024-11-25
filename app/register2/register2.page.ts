import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-register2',
  templateUrl: './register2.page.html',
  styleUrls: ['./register2.page.scss'],
})
export class Register2Page implements OnInit {

  register2Form: FormGroup;
  email = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private route: ActivatedRoute, private router: Router,
			  private toastController: ToastController) {
	this.route.queryParams.subscribe(params => {
		if (this.router.getCurrentNavigation().extras.state) {
		  this.email = this.router.getCurrentNavigation().extras.state.email;
		}
	  });
	  this.register2Form = formBuilder.group({
		  'username': '',
		  'fullname': '',
		  'mobile': '',
		  'buyer': false,
		  'seller': false
		});
  }
  
  register2(){
	  if (this.checkIfFieldNullOrEmpty("Username", this.register2Form.value.username)) return;
	  if (this.checkIfFieldNullOrEmpty("Full Name", this.register2Form.value.fullname)) return;
	  if (this.checkIfFieldNullOrEmpty("Mobile", this.register2Form.value.mobile)) return;
	  if (this.register2Form.value.buyer === false && this.register2Form.value.seller === false)
	  {
	  	this.showErrorMessage("Error: Pick an account type!");
	  	return;
	  }
	  var role = 1;
	  if (this.register2Form.value.buyer && this.register2Form.value.seller) role = 3;
	  else if (this.register2Form.value.buyer) role = 1;
	  else if (this.register2Form.value.seller) role = 2;

	  this.authService.register2(this.email, this.register2Form.value.username, this.register2Form.value.fullname, this.register2Form.value.mobile, role);
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

  ngOnInit() {
  }


}
