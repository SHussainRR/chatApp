import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/services/user/user.service';
import MESSAGE_CONSTANTS from 'src/utils/messageConstants';
import { MyErrorStateMatcher } from 'src/utils/functions';


export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
@Component({
  selector: 'app-grouproom',
  templateUrl: './grouproom.component.html',
  styleUrls: ['./grouproom.component.css'],
})
export class GrouproomComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  nickname = '';
  roomname = '';
  message = '';
  users = [];
  chats = [];
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe
  ) {
    this.nickname = localStorage.getItem('nickname');
    this.roomname = this.route.snapshot.params.roomname;
    this.chats = [];
    firebase
      .database()
      .ref('groupmessages/' + this.roomname)
      .on('value', (resp) => {
        this.chats = [];
        const data = snapshotToArray(resp);
        console.log(data);
        if (data?.length) {
          for (let key of Object.keys(data[0])) {
            if (data[0][key] && key !== 'key') this.chats.push(data[0][key]);
          }
        }
        // console.log(this.chats);
        setTimeout(() => (this.scrolltop = this.chatcontent.nativeElement.scrollHeight), 500);
      });
    // firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp2: any) => {
    //   const roomusers = snapshotToArray(resp2);
    //   this.users = roomusers.filter(x => x.status === 'online');
    // });
  }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  }

  onFormSubmit = (form: any) => {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    firebase
      .database()
      .ref('groupmessages/' + this.roomname)
      .child('messages')
      .push(chat);
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  };

  exitChat = () => {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} ` + MESSAGE_CONSTANTS.exit_chat;
    chat.type = 'exit';
    firebase
      .database()
      .ref('groupmessages/' + this.roomname)
      .child('messages')
      .push(chat);

    // firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp: any) => {
    //   let roomuser = [];
    //   roomuser = snapshotToArray(resp);
    //   const user = roomuser.find(x => x.nickname === this.nickname);
    //   if (user !== undefined) {
    //     const userRef = firebase.database().ref('roomusers/' + user.key);
    //     userRef.update({status: 'offline'});
    //   }
    // });

    UserService.makeUserOnline(false);
    this.router.navigate(['/roomlist']);
  };

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
