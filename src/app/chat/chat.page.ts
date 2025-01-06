import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chats: any;
  chatsF: any;
  currentUser;
  adminEmail = this.fsService.adminEmail;
  chatsForm: FormGroup;

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private fsService: FirestoreService, private storage: AngularFireStorage) {
    this.fsService.showLoader();
    this.chatsForm = formBuilder.group({
      'search': '',
    });

    this.sub1 = this.authService.getUserInfo().subscribe((result) => {
      this.currentUser = result;
    
      if (result != null) {
        this.sub2 = this.fsService.getChatByBuyer(this.currentUser.email).subscribe(result => {
          this.chats = result;

          this.sub3 = this.fsService.getChatBySeller(this.currentUser.email).subscribe(resultS => {
            this.chats = result.concat(resultS);

            this.chatsF = this.chats.filter((el) => {
              return (el.seller_un.toLowerCase().includes(this.chatsForm.value.search.toLowerCase()) || el.buyer_un.toLowerCase().includes(this.chatsForm.value.search.toLowerCase()));
            });

            this.chatsF.sort((a, b) => (a.messages[a.messages.length-1].date.toDate() > b.messages[b.messages.length-1].date.toDate()) ? -1 : 1);

            for (let i = 0; i < this.chats.length; i++) {
              if (this.currentUser.unreadChats != null && this.currentUser.unreadChats.indexOf(this.chats[i].id) > -1)
              this.chats[i].notRead = true;
              else
              this.chats[i].notRead = false;
            }
  
            /*for (let i = 0; i < this.chats.length; i++) {
              this.storage.ref(this.chats[i].image).getDownloadURL().subscribe((img) => {
                if (this.chats!= null) this.chats[i].image = img;
              });
            }*/
            //console.log(this.chats)

            this.fsService.hideLoader();
          });
        });
        
      }
    });

    this.chatsForm.get("search").valueChanges.subscribe(query => {
      this.chatsF = this.chats.filter((el) => {
        return (el.seller_un.toLowerCase().includes(query.toLowerCase()) || el.buyer_un.toLowerCase().includes(query.toLowerCase()));
      });
    });
  }


  markAsRead(id) {
    if (this.chats[id].notRead) 
    {
      this.chats[id].notRead = false;
		}

		
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }

}
