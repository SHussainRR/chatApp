import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { DataService } from 'src/services/data.service';
import { ClientService } from 'src/utils/client';
import { isLoggedIn } from 'src/utils/functions';
import { AddgroupComponent } from './addgroup/addgroup.component';

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
  GroupVisible: boolean = false;
  OneVisible: boolean = false;
  conVisible: boolean = false;
  nickname: string = '';

  constructor(private data: DataService) {
    // firebase.initializeApp(config);
    ClientService.initApp();
    this.isLoggedIn = isLoggedIn();
  }
  ngOnInit() {
    this.nickname = localStorage.getItem('nickname');
    this.subscription = this.data.loginInfo.subscribe((isLoggedIn) => (this.isLoggedIn = isLoggedIn));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  showGroupModal = (GroupVisible: boolean): void => {
    this.GroupVisible = GroupVisible;
  };

  showOneModal = (OneVisible: boolean): void => {
    this.OneVisible = OneVisible;
  };

  showConferenceModal = (conVisible: boolean): void => {
    this.conVisible = conVisible;
  };

  changeOfRoutes() {
    this.nickname = localStorage.getItem('nickname');
  }
}
