import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { DataService } from 'src/services/data.service';
import { ClientService } from 'src/utils/client';
import { isLoggedIn } from 'src/utils/functions';

const config = {
  apiKey: 'AIzaSyAiwJQPJ_XmcsK6ibRvYhRW_X8YnCvkDQg',
  databaseURL: 'https://angularchat-fff13-default-rtdb.firebaseio.com',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-chat';
  isCollapsed = false;
  isLoggedIn = false;
  subscription: Subscription;

  constructor(private data: DataService) {
    // firebase.initializeApp(config);
    ClientService.initApp();
    this.isLoggedIn = isLoggedIn();
  }
  ngOnInit() {
    this.subscription = this.data.loginInfo.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
