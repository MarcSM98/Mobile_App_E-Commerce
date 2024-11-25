import { Chart } from 'chart.js';
import { Component, OnInit, ViewChild } from '@angular/core';

import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage {

  @ViewChild('barChart') barChart;
  @ViewChild('userChart') userChart;

  bars: any;
  userBars: any;

  allProducts: any = [];
  activeProducts: any = [];
  featuredProducts: any = [];

  pendingFR: any = [];
  pendingReports: any = [];
  pendingAds: any = [];
  currentUser: any = {};
  specialEvent: any = {};

  mths: any = [];
  userLabel: any = ["1", "2", "3"];
  userCount: any = [0, 0, 0];

  orderLabel: any = ["1", "2", "3"];
  orderCount: any = [0, 0, 0];
  orderAmt: any = [0, 0, 0];

  newUsers = 0;
  totalUsers = 0;

  orderType = 0;
  orderMth;

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;
  sub6: Subscription;
  sub7: Subscription;
  sub8: Subscription;
  sub9: Subscription;
  sub10: Subscription;
  sub11: Subscription;
  sub12: Subscription;
  sub13: Subscription;
  sub14: Subscription;
  sub15: Subscription;
  sub16: Subscription;

  count = 0;

  constructor(private authService: AuthService, private fsService: FirestoreService) {
    this.fsService.showLoader();

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);

    this.getPast6Mths(today);

    this.sub1 = this.authService.getAllUsers().subscribe((result) => {
      this.totalUsers = result.length - 1
    });

    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today);
    var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today);

    var thisMth = new Date(ye + "-" + mo + "-" + "01");
    var nextMth = new Date(ye + "-" + mo + "-" + "01");
    nextMth.setMonth(nextMth.getMonth() + 1)

    this.sub2 = this.authService.getNewUsers(thisMth, nextMth).subscribe((result) => {
      this.newUsers = result.length
      this.hideLoader();
    });

    this.sub3 = this.fsService.getPendingFeaturedRequest().subscribe((result) => {
      this.pendingFR = result;
      this.hideLoader();
    });

    this.sub4 = this.fsService.getPendingReports().subscribe((result) => {
      this.pendingReports = result;
      this.hideLoader();
    });

    this.sub5 = this.fsService.getPendingAds().subscribe((result) => {
      this.pendingAds = result;
      this.hideLoader();
    });

    this.sub6 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
      this.hideLoader();
    });

    this.sub7 = this.fsService.getSpecialEvent().subscribe((result) => {
      this.specialEvent = result;
      this.hideLoader();
    });

    this.sub8 = this.fsService.getAllProducts().subscribe((result) => {
      this.allProducts = result;
      this.hideLoader();
    });

    this.sub9 = this.fsService.getAllActiveProducts().subscribe((result) => {
      this.activeProducts = result;
      this.hideLoader();
    });

    this.sub10 = this.fsService.getAllFeaturedProducts().subscribe((result) => {
      this.featuredProducts = result;
      this.hideLoader();
    });
  }

  hideLoader() {
    this.count++;
    if (this.count == 10) this.fsService.hideLoader();
  }


  getPast3MthsOrders(option, today) {
    var d = new Date(today);

    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    var mth1 = new Date(ye + "-" + mo + "-" + "01");
    mth1.setMonth(mth1.getMonth() + 1)
    var mth2 = new Date(ye + "-" + mo + "-" + "01");
    mth2.setMonth(mth2.getMonth())
    var mth3 = new Date(ye + "-" + mo + "-" + "01");
    mth3.setMonth(mth3.getMonth() - 1)
    var mth4 = new Date(ye + "-" + mo + "-" + "01");
    mth4.setMonth(mth4.getMonth() - 2)

    this.sub11 = this.fsService.getOrdersByMths(mth4, mth3).subscribe((result) => {
      this.orderCount[0] = result.length;
      this.orderLabel[0] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth4) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth4);
      var order: any = [];
      order = result;
      this.orderAmt[0] = 0
      for (let i = 0; i < order.length; i++)
        this.orderAmt[0] += order[i].price
        this.sub12 = this.fsService.getOrdersByMths(mth3, mth2).subscribe((result) => {
        this.orderCount[1] = result.length;
        this.orderLabel[1] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth3) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth3);
        var order: any = [];
        order = result;
        this.orderAmt[1] = 0
        for (let i = 0; i < order.length; i++)
          this.orderAmt[1] += order[i].price
          this.sub13 = this.fsService.getOrdersByMths(mth2, mth1).subscribe((result) => {
          this.orderCount[2] = result.length;
          this.orderLabel[2] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth2) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth2);
          var order: any = [];
          order = result;
          this.orderAmt[2] = 0
          for (let i = 0; i < order.length; i++)
            this.orderAmt[2] += order[i].price
          this.createBarChart(option);
        });
      });
    });
  }

  getPast3MthsUsers(today) {
    var d = new Date(today);

    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    var mth1 = new Date(ye + "-" + mo + "-" + "01");
    mth1.setMonth(mth1.getMonth() + 1)
    var mth2 = new Date(ye + "-" + mo + "-" + "01");
    mth2.setMonth(mth2.getMonth())
    var mth3 = new Date(ye + "-" + mo + "-" + "01");
    mth3.setMonth(mth3.getMonth() - 1)
    var mth4 = new Date(ye + "-" + mo + "-" + "01");
    mth4.setMonth(mth4.getMonth() - 2)

    this.sub14 = this.authService.getUsersByMths(mth4, mth3).subscribe((result) => {
      this.userCount[0] = result.length;
      this.userLabel[0] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth4) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth4);
      this.sub15 = this.authService.getUsersByMths(mth3, mth2).subscribe((result) => {
        this.userCount[1] = result.length;
        this.userLabel[1] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth3) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth3);
        this.sub16 = this.authService.getUsersByMths(mth2, mth1).subscribe((result) => {
          this.userCount[2] = result.length;
          this.userLabel[2] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth2) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth2);
          this.createUserChart();
        });
      });
    });
  }

  getPast6Mths(today) {
    var d = new Date(today);

    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    d = new Date(ye + "-" + mo + "-" + "01");

    this.mths.push(new Date(ye + "-" + mo + "-" + "01"))

    for (let i = 0; i < 5; i++) {
      this.mths.push(d.setMonth(d.getMonth() - 1))
    }

    this.orderMth = this.mths[0];
  }

  onFilterChangeUser($event) {
    var filter = $event.target.value;
    this.getPast3MthsUsers(this.mths[filter])
  }

  onFilterChangeOrder($event) {
    var filter = $event.target.value;
    this.orderMth = this.mths[filter];
    this.getPast3MthsOrders(this.orderType, this.orderMth)
  }

  onFilterChange($event) {
    var filter = $event.target.value;
    this.orderType = filter;
    this.getPast3MthsOrders(this.orderType, this.orderMth)
  }

  ionViewDidEnter() {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);
    this.getPast3MthsUsers(today);
    this.getPast3MthsOrders(0, today);
  }

  createBarChart(option) {
    var data = {
      label: 'Products sold',
      data: [this.orderCount[0], this.orderCount[1], this.orderCount[2]],
      backgroundColor: '#283B7A',
      hoverBackgroundColor: '#FBC41C'
    }
    if (option == 1)
      data = {
        label: 'Sales amount',
        data: [this.orderAmt[0], this.orderAmt[1], this.orderAmt[2]],
        backgroundColor: '#283B7A',
        hoverBackgroundColor: '#FBC41C'
      }
    let ctx = this.barChart.nativeElement;
    ctx.height = 280;
    ctx.borderWidth = 1;
    if (this.bars) this.bars.destroy();
    this.bars = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [this.orderLabel[0], this.orderLabel[1], this.orderLabel[2]],
        datasets: [data]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: true,
          labels: {
            fontFamily: '"Montserrat", sans-serif',
          }
        },
      }
    });
  }

  createUserChart() {
    let ctx = this.userChart.nativeElement;
    ctx.height = 280;
    ctx.borderWidth = 1;
    if (this.userBars) this.userBars.destroy();
    this.userBars = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [this.userLabel[0], this.userLabel[1], this.userLabel[2]],
        datasets: [{
          label: 'Number of Users',
          data: [this.userCount[0], this.userCount[1], this.userCount[2]],
          backgroundColor: '#283B7A',
          hoverBackgroundColor: '#FBC41C'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: true,
          labels: {
            fontFamily: '"Montserrat", sans-serif',
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 0,
            bottom: 0
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
    this.sub5.unsubscribe();
    this.sub6.unsubscribe();
    this.sub7.unsubscribe();
    this.sub8.unsubscribe();
    this.sub9.unsubscribe();
    this.sub10.unsubscribe();
    this.sub11.unsubscribe();
    this.sub12.unsubscribe();
    this.sub13.unsubscribe();
    this.sub14.unsubscribe();
    this.sub15.unsubscribe();
    this.sub16.unsubscribe();
  }

}
