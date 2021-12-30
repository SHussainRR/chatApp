import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/services/user/user.service';
import MESSAGE_CONSTANTS from 'src/utils/messageConstants';
import { MyErrorStateMatcher, snapshotToArray } from 'src/utils/functions';

@Component({
  selector: 'app-one-chatroom',
  templateUrl: './one-chatroom.component.html',
  styleUrls: ['./one-chatroom.component.css'],
})
export class OneChatroomComponent implements OnInit {
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

  refStatus = firebase.database().ref('roomusers/');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe
  ) {
    this.nickname = localStorage.getItem('nickname');
    this.roomname = this.route.snapshot.params.roomname;
    firebase
      .database()
      .ref('Onechats/' + this.roomname)
      .on('value', (resp) => {
        this.chats = [];
        this.chats = snapshotToArray(resp);
        setTimeout(() => (this.scrolltop = this.chatcontent.nativeElement.scrollHeight), 500);
      });
    firebase
      .database()
      .ref('Oneroomusers/')
      .orderByChild('roomname')
      .equalTo(this.roomname)
      .on('value', (resp2: any) => {
        const roomusers = snapshotToArray(resp2);
        // this.users = roomusers.filter(x => x.status === 'online');+
      });

    // this.refStatus.orderByChild('nickname').equalTo( this.nickname ).once('value', (snapshot: any) => {
    //   if (snapshot.exists()) {
    //     const usersRef = this.refStatus.child('nickname');
    //     const hopperRef = usersRef.child('status');
    //     hopperRef.update({
    //       'status': 'online'
    //     });

    //   }
    // });

    // firebase.database().ref('OnetoOne/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp12: any) => {
    //   const roomdetails = snapshotToArray(resp12);
    //   this.users = roomdetails.filter(x => x.roomname === this.roomname);
    // });
  }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  }

  onFormSubmit = (form: any) => {
    console.log({ a: this.chats });
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    const newMessage = firebase
      .database()
      .ref('Onechats/' + this.roomname)
      .push();
    newMessage.set(chat);
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
    // start Here Checking gg
    const newMessage = firebase
      .database()
      .ref('Onechats/' + this.roomname)
      .push();
    newMessage.set(chat);

    firebase
      .database()
      .ref('Oneroomusers/')
      .orderByChild('roomname')
      .equalTo(this.roomname)
      .on('value', (resp: any) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        const user = roomuser.find((x) => x.nickname === this.nickname);
        if (user !== undefined) {
          const userRef = firebase.database().ref('Oneroomusers/' + user.key);
          userRef.update({ status: 'offline' });
        }
      });

    UserService.makeUserOnline(false);
    this.router.navigate(['/roomlist']);
  };

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
