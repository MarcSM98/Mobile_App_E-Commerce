import { Component, OnInit } from '@angular/core';
import {FirestoreService} from "../firestore.service";

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrls: ['./terms-conditions.page.scss'],
})
export class TermsConditionsPage implements OnInit {

  privacypolicy: string;
  termsandconditions: string;

  constructor(private fsService: FirestoreService) {
    // this.fsService.showLoader();
    this.privacypolicy = "privacy policy here";
    this.termsandconditions = "Loading Terms and Conditions...";
      this.fsService.retrieveTermsAndConditionsDocRef().get().toPromise()
          .then(tnc => {
              if (tnc.exists)
              {
                  console.log(tnc);
                  // @ts-ignore
                  var tmp: any = tnc.data();
                  this.privacypolicy = tmp.privacy.toString();
                  this.termsandconditions = tmp.conditions.toString();
                  // this.fsService.hideLoader();
              }
              else
              {
                  this.privacypolicy = "Error fetching Privacy Policy";
                  this.termsandconditions = "Error fetching Terms and Conditions";
                  // this.fsService.hideLoader();
              }
          })
    // this.fsService.retrievePrivacyPolicyDocRef().get().toPromise()
    //     .then((doc) => {
    //       if (doc.exists)
    //       {
    //         // @ts-ignore
    //         this.privacypolicy = doc.data().privacypolicy.toString();
    //         this.fsService.retrieveTermsAndConditionsDocRef().get().toPromise()
    //             .then(tnc => {
    //               if (tnc.exists)
    //               {
    //                 // @ts-ignore
    //                 this.termsandconditions = tnc.data().termsandconditions.toString();
    //                 // this.fsService.hideLoader();
    //               }
    //               else
    //               {
    //                 this.termsandconditions = "Error fetching Terms and Conditions";
    //                 // this.fsService.hideLoader();
    //               }
    //             })
    //       }
    //       else
    //       {
    //         this.privacypolicy = "Error fetching Privacy Policy.";
    //         // this.fsService.hideLoader();
    //       }
    //    })
  }

  ngOnInit() {

  }

}
