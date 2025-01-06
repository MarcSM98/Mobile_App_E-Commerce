import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})
export class AnnouncementsPage implements OnInit {

  public segment: string = 'promotion';
  announcements1: any;
  announcements2: any;
  admin = false;
  currentUser;

  sub1: Subscription;

  constructor(private authService: AuthService, private fsService: FirestoreService) {

    this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
      if (this.currentUser.email) this.authService.readAds(this.currentUser.email, true);
    }).unsubscribe();

    this.sub1 = this.fsService.getAllAnnouncements().subscribe((data) => {
      var announcements = []
      announcements = data;

      this.announcements1 = announcements.filter(function (el) {
        return el.category == 1;
      });

      this.announcements2 = announcements.filter(function (el) {
        return el.category == 2;
      });
    });
  }

  deleteAnnouncement(id) {
    this.fsService.deleteAnnouncement(id);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }
  
  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

}
