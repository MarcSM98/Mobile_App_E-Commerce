import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit {

  users = [];
  usersF = [];
  usersForm: FormGroup;

  sub1: Subscription;

  constructor(private fsService:FirestoreService, private formBuilder: FormBuilder, private storage: AngularFireStorage, private authService: AuthService) {
    this.fsService.showLoader();
    this.usersForm = formBuilder.group({
      'search': '',
      'filter': '0',
    });

    this.sub1 = this.authService.getAllUsers().subscribe((result) => {
      this.users = result;
      /*for (let i = 0; i < this.users.length; i++) {
        this.storage.ref(this.users[i].image).getDownloadURL().subscribe((img) => {
          this.users[i].image = img;
        });
      }*/

      var filter = this.usersForm == null ? '0' : this.usersForm.value.filter
      var filterDate = this.getFilterDate(filter);

      if (this.users != null)
        this.usersF = this.users.filter(function (el) {
          if (filter == 0) return el.approved == false;
          else if (filter < 5) return el.lastLogin.toDate() >= filterDate;
          else return el.lastLogin.toDate() < filterDate;
        });

        this.fsService.hideLoader();
    });

    this.usersForm.get("search").valueChanges.subscribe(query => {
      var filter = this.usersForm == null ? '0' : this.usersForm.value.filter
      var filterDate = this.getFilterDate(filter);
      
      this.usersF = this.users.filter((el) => {
        if (filter == 0) return el.approved == false;
        else if (filter < 5) return (el.email.toLowerCase().includes(query.toLowerCase()) || el.username.toLowerCase().includes(query.toLowerCase())) && el.lastLogin.toDate() >= filterDate;
        else return (el.email.toLowerCase().includes(query.toLowerCase()) || el.username.toLowerCase().includes(query.toLowerCase())) && el.lastLogin.toDate() < filterDate;
      });
    });
  }

  getFilterDate(filter) {
    var d = new Date();

    if (filter == 1) d.setDate(d.getDate() - 2)
    else if (filter == 2) d.setDate(d.getDate() - 7)
    else if (filter == 3) d.setDate(d.getDate() - 30)
    else d.setDate(d.getDate() - 90)

    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    return new Date(ye + "-" + mo + "-" + da);
  }

  onFilterChange($event) {
    var filter = $event.target.value;
    var query = this.usersForm.value.search;
    var filterDate = this.getFilterDate(filter);

    this.usersF = this.users.filter(function (el) {
      if (filter == 0) return el.approved == false;
      else if (filter < 5) return (el.email.toLowerCase().includes(query.toLowerCase()) || el.username.toLowerCase().includes(query.toLowerCase())) && el.lastLogin.toDate() >= filterDate;
      else return (el.email.toLowerCase().includes(query.toLowerCase()) || el.username.toLowerCase().includes(query.toLowerCase())) && el.lastLogin.toDate() < filterDate;
    });
  }

  banUser(email, value) {
    this.authService.banUser(email, value);
  }

  approveUser(email, value) {
    this.authService.approveUser(email, value);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }
}
