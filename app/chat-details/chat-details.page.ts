import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.page.html',
  styleUrls: ['./chat-details.page.scss'],
})
export class ChatDetailsPage implements OnInit {

  chat:any;
  df: string = 'medium'
  currentUser
  adminEmail = this.fsService.adminEmail;
  prevLength = 0;
  currentLength = 0;

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  id;
  other_profilepic: any= '';
  profilePics: any = [];

  constructor(private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute, private fsService: FirestoreService, private storage: AngularFireStorage) { 
    this.fsService.showLoader();
    
    // Get the id that was passed with the URL
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;

      this.sub2 = this.fsService.getChatById(this.id).subscribe(result => {
        var tmp: any = result;
        
        this.prevLength = this.currentLength
        this.currentLength = tmp.messages.length;
  
        if (this.prevLength == 0 || this.prevLength != this.currentLength) this.chat = result;
        /*this.storage.ref(this.chat.image).getDownloadURL().subscribe((img) => {
          if (this.chat!= null) this.chat.image = img;
        });*/
  
        this.sub3 = this.fsService.getAllProficPics().subscribe((result) => {
          this.profilePics = result;
  
          var otherEmail = this.chat.seller == this.currentUser.email ? this.chat.buyer : this.chat.seller;
  
          var filter = this.profilePics.filter((el) => {
            return (el.email.toLowerCase() == otherEmail.toLowerCase());
          });
  
          if (filter.length == 1) {
            this.other_profilepic = filter[0].image;
          }
  
          this.fsService.hideLoader();
        });
  
      }, (error) => {
        console.log(error)
      })
      
    }, (error) => {
      console.log(error)
    })
    
  }

  ngOnInit() {
  }

  myReply(sender) {
    return sender == this.currentUser.email;
  }

  sendMessage(event) {
    var receiver;
    if (this.chat.buyer == this.currentUser.email) receiver = this.chat.seller;
    else receiver = this.chat.buyer;

    this.fsService.newMessage("New Message from " + this.currentUser.username, this.chat.id, this.currentUser.email, event.message, receiver, '/chat-details/' + this.chat.id);
    this.fsService.unreadChat(receiver, this.chat.id);
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.fsService.readChat(this.currentUser.email, this.id);
  }

}
