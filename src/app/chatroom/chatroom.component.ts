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
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})
export class ChatroomComponent implements OnInit {
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
    firebase
      .database()
      .ref('chats/' + this.roomname)
      .on('value', (resp) => {
        this.chats = [];
        this.chats = snapshotToArray(resp);
        setTimeout(() => (this.scrolltop = this.chatcontent.nativeElement.scrollHeight), 500);
      });
    firebase
      .database()
      .ref('roomusers/')
      .orderByChild('roomname')
      .equalTo(this.roomname)
      .on('value', (resp2: any) => {
        const roomusers = snapshotToArray(resp2);
        this.users = roomusers.filter((x) => x.status === 'online');
      });
  }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  }
  onFormSubmit = (form) => {
    // console.log('dasdasd',this.roomname)
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    // chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    // console.log(chat);
    const newMessage = firebase
      .database()
      .ref('chats/' + this.roomname)
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
    const newMessage = firebase
      .database()
      .ref('chats/' + this.roomname)
      .push();
    newMessage.set(chat);

    firebase
      .database()
      .ref('roomusers/')
      .orderByChild('roomname')
      .equalTo(this.roomname)
      .on('value', (resp: any) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        const user = roomuser.find((x) => x.nickname === this.nickname);
        if (user !== undefined) {
          UserService.makeUserOnline(false);
        }
      });

    this.router.navigate(['/roomlist']);
  };

  scrollToBottom = (): void => {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  };
}
