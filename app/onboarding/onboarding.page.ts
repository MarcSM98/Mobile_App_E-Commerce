import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  public onboardSlides = [];

  buttonName = "Next";
  selectedSlide: any;
  slideIndex: any;

  slideOpts = {
    initialSlide: 0,
  };

  @ViewChild('mainSlides', { static: true }) slides: IonSlides;

  constructor(private router: Router, private storage: Storage) { }

  ionSlideChange(slides) {
    this.selectedSlide = slides;

    slides.getActiveIndex().then(
      (slidesIndex) => {
        this.slideIndex = slidesIndex
        if (slidesIndex == 2) {
          this.buttonName = "Get Started";
        } else {
          this.buttonName = "Next";
        }
      });
  }

  ngOnInit() {
    this.storage.get('onboarded').then(res => {
      console.log(res);
      if (res === 'true')
      {
        // old user
        this.router.navigate(['home']);
      }
    })
        .catch(err => {
          console.log(err);
        })
    this.onboardSlides = [
      {
        title: 'Welcome to La Lumiere',
        img: '../../assets/lalumiere_logo.PNG',
        desc: 'All your buying and selling needs in one marketplace.',
      },
      {
        title: 'Shopping desires at a steal',
        img: '../../assets/onboarding1.svg',
        desc: 'Extensive filtering to suit your needs.',
      },
      {
        title: 'Communication is key',
        img: '../../assets/onboarding2.svg',
        desc: 'Connect with your buyers, sellers and the Administrator.',
      }
    ]

  }

  public goBack() {
    this.slides.slidePrev();

  }
  public skipBtn() {
    this.slides.slideTo(this.onboardSlides.length);
  }
  public goNext() {
    this.selectedSlide = this.slides;
    this.slides.getActiveIndex().then((slidesIndex) => {
      if (slidesIndex == 2) {
        console.log("Done Slider");
        this.storage.set('onboarded','true');
		this.router.navigate(['home']);
      } else {
        this.selectedSlide.slideNext();
      }
    });
  }
}
