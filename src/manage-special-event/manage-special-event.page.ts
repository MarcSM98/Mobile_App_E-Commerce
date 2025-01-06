import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-manage-special-event',
  templateUrl: './manage-special-event.page.html',
  styleUrls: ['./manage-special-event.page.scss'],
})
export class ManageSpecialEventPage implements OnInit {

  event:any= {};
  eventForm: FormGroup;

  sub1: Subscription;

  constructor(private alertController:AlertController, private formBuilder: FormBuilder, private fsService: FirestoreService) { 
    this.fsService.showLoader();

    this.eventForm = formBuilder.group({
      'name': '',
      'active': false
    });

    this.sub1 = this.fsService.getSpecialEvent().subscribe((result) => {
      this.event = result;
      this.eventForm.controls.name.setValue(this.event.name);
      this.eventForm.controls.active.setValue(this.event.active);
      this.fsService.hideLoader();
    });
  }

  ngOnInit() {
  }

  updateEvent() {
    if(this.eventForm.value.active == false && this.event.active != this.eventForm.value.active) this.confirmAlert();
    else this.fsService.updateSpecialEvent(this.eventForm.value.name, this.eventForm.value.active)
  }

  async confirmAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Confirmation',
      mode: 'ios',
      message: 'De-activating the special event will unlist all products from this special event. Are you sure you want to proceed?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-reset',
        }, {
          text: 'Yes',
          handler: data => {
            this.fsService.updateSpecialEvent(this.eventForm.value.name, this.eventForm.value.active)
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

}
