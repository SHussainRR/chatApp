import { Component, Input, OnInit,ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getUserId, MyErrorStateMatcher } from 'src/utils/functions';''

interface Message {
  nickname: String;
  message: String;
  roomname?: String;
  date?: String;
  type: MessageType;
}

@Component({
  selector: 'app-chatmessages',
  templateUrl: './chatmessages.component.html',
  styleUrls: ['./chatmessages.component.css']
})
export class ChatmessagesComponent implements OnInit {
  // for scroll
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  nickname: String;
  chatForm: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  matcher = new MyErrorStateMatcher();

  message:String;
  @Input() sendMessage:any;
  @Input() messageData: Messages = [];
  @Input() leaveRoom:any; 

  ngOnInit(): void { 
    this.nickname = getUserId();
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }
  scrollToBottom():void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}

type MessageType = 'join' | 'message' | 'exit'; 



type Messages = Message[];