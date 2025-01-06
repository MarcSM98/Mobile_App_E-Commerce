import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.page.html',
  styleUrls: ['./add-announcement.page.scss'],
})
export class AddAnnouncementPage implements OnInit {

  announcementForm: FormGroup;
  

  constructor(private formBuilder: FormBuilder, private fsService: FirestoreService, private toastController: ToastController) {
    this.announcementForm = formBuilder.group({
      'title': '',
      'message': '',
      'category': '1'
    });

  }

  ngOnInit() {
  }

  addAnnouncement() {
    if (this.checkIfFieldNullOrEmpty("Title", this.announcementForm.value.title)) return;
    if (this.checkIfFieldNullOrEmpty("Message", this.announcementForm.value.message)) return;
    if (this.checkIfFieldNullOrEmpty("Category", this.announcementForm.value.category)) return;
    this.fsService.addAnnouncement(this.announcementForm.value.title, this.announcementForm.value.message, this.announcementForm.value.category);
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
