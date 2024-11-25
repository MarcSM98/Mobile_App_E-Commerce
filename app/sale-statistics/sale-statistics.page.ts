import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { FirestoreService } from '../firestore.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sale-statistics',
  templateUrl: './sale-statistics.page.html',
  styleUrls: ['./sale-statistics.page.scss'],
})
export class SaleStatisticsPage {

  @ViewChild('barChart') barChart;
  @ViewChild('barChart2') barChart2;

  bars: any;

  mths: any = [];
  orderLabel: any = ["1", "2", "3"];
  orderCount: any = [0, 0, 0];
  orderAmt: any = [0, 0, 0];

  orderType = 0;
  orderMth;

  email = '';

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private fsService: FirestoreService) {
    this.fsService.showLoader();
    this.email = this.activatedRoute.snapshot.paramMap.get('id');

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);

    this.getPast6Mths(today);
  }

  ionViewDidEnter() {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);
    
    this.getPast3MthsOrders(0, today);
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

    this.sub1 = this.fsService.getMyOrdersByMths(this.email, mth4, mth3).subscribe((result) => {
      this.orderCount[0] = result.length;
      this.orderLabel[0] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth4) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth4);
      var order: any = [];
      order = result;
      this.orderAmt[0] = 0
      for (let i = 0; i < order.length; i++)
        this.orderAmt[0] += order[i].price
        this.sub2 = this.fsService.getMyOrdersByMths(this.email, mth3, mth2).subscribe((result) => {
        this.orderCount[1] = result.length;
        this.orderLabel[1] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth3) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth3);
        var order: any = [];
        order = result;
        this.orderAmt[1] = 0
        for (let i = 0; i < order.length; i++)
          this.orderAmt[1] += order[i].price
          this.sub3 = this.fsService.getMyOrdersByMths(this.email, mth2, mth1).subscribe((result) => {
          this.orderCount[2] = result.length;
          this.orderLabel[2] = new Intl.DateTimeFormat('en', { month: 'short' }).format(mth2) + " " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(mth2);
          var order: any = [];
          order = result;
          this.orderAmt[2] = 0
          for (let i = 0; i < order.length; i++)
            this.orderAmt[2] += order[i].price
          this.createBarChart(option);
          // this.createBarChart2(option);
        });
      });
      this.fsService.hideLoader();
    });
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

  // createBarChart2(option) {
  //   var data = {
  //     label: 'Products sold',
  //     data: [this.orderCount[0], this.orderCount[1], this.orderCount[2]],
  //     backgroundColor: '#283B7A',
  //     hoverBackgroundColor: '#FBC41C'
  //   }
  //   if (option == 1)
  //     data = {
  //       label: 'Sales amount',
  //       data: [this.orderAmt[0], this.orderAmt[1], this.orderAmt[2]],
  //       backgroundColor: '#283B7A',
  //       hoverBackgroundColor: '#FBC41C'
  //     }
  //   let ctx = this.barChart2.nativeElement;
  //   ctx.height = 280;
  //   ctx.borderWidth = 1;
  //   if (this.bars) this.bars.destroy();
  //   this.bars = new Chart(ctx, {
  //     type: 'pie',
  //     data: {
  //       labels: [this.orderLabel[0], this.orderLabel[1], this.orderLabel[2]],
  //       datasets: [data]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }]
  //       },
  //       legend: {
  //         display: true,
  //         labels: {
  //           fontFamily: '"Montserrat", sans-serif',
  //         }
  //       },
  //     }
  //   });
  // }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }
}
