import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { makeUserOnline } from 'src/utils/functions';



export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
type User = string;

interface Room {
  members: User[];
  name: string;
}
interface SelectUser {
  itemName:User;
  id: string;
}
@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {

  nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  OnetoOne = [];
  onlineUsers = [];
  offlineUsers = [];
  allUsers:SelectUser[] = [];
  allAvaibUsers:SelectUser[] = [];
  displayStyle = "none";
  isLoadingResults = true;
  chatwith = '';


  groupref = firebase.database().ref('group/');
  selectedItems: SelectUser[] = [];
  groupName: string = "";
  groupList: Room[] = [];

  oneToOneRoom: Room = {
    members: [],
    name: "",
  };
  conferenceRoom: Room = {
    members: [],
    name: "",
  };

  // ng dropdown
  dropdownList = [];
  dropdownSettings = {};
  // ng dropdown


  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
    this.nickname = localStorage.getItem('nickname');
    firebase.database().ref('rooms/').on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      this.isLoadingResults = false;
    });

    // firebase.database().ref('OnetoOne/UserOne/' ||'OnetoOne/UserTwo/' ).on('value', resp => {


    //   if(snapshotToArray(resp).includes('ali')){
    //     this.OnetoOne.push(snapshotToArray(resp));
    //   };

    //   this.isLoadingResults = false;
    // });



    firebase.database().ref('OnetoOne/').on('value', resp => {
      this.OnetoOne = [];
      this.OnetoOne = snapshotToArray(resp);
      // console.log("Logg ===> ", this.OnetoOne);
      this.OnetoOne = this.OnetoOne.filter(item => item.UserOne === this.nickname || item.UserTwo === this.nickname);
      console.log("Logg ===> ", this.OnetoOne);
      this.isLoadingResults = false;
    });

    firebase.database().ref('users/').orderByChild('status').on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      this.onlineUsers = roomusers.filter(x => x.status === 'online');
      this.offlineUsers = roomusers.filter(x => x.status !== 'online');
      this.allUsers = roomusers;
    });

    this.fetchGroupList();

  }

  fetchGroupList() {
    firebase.database().ref('group/').on('value', (resp2: any) => {
      this.groupList = snapshotToArray(resp2).filter(el => el?.members?.includes(this.nickname)).filter(el=>el);
    });
  }


  // ngOnInit(): void {}

  ngOnInit() {

    firebase.database().ref('users/').orderByChild('nickname').on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);

      const newVar:SelectUser[] = roomusers.filter(el=> el.nickname && el.nickname !== this.nickname).map(ru => {
        return { "id": ru.key, "itemName": ru.nickname };
      });
      console.log(newVar);

      // this.allAvaibUsers = roomusers;
      this.allAvaibUsers = newVar;
      this.dropdownList = newVar;
    });

    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Users to Add in Group",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }


  createGroupRoom(){
    const group = {
      members: [this.nickname, ...this.selectedItems.map(el=>el.itemName)],
      name: this.groupName
    }
    
    const newRoom = firebase.database().ref('group/').push();
    // console.log( "rooomname : " + this.roomname , "NICK:"+ this.nickname , this.UserOne , "USER TWO"+ this.UserTwo);
    newRoom.set(group).then((response)=>{
      this.selectedItems = [];
      this.groupName = ""
    });  

  }

  enterChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      
      if (!user)  {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        const newRoomUser = firebase.database().ref('roomusers/').push();
        newRoomUser.set(newroomuser);
      }
      makeUserOnline(true);
    });

    this.router.navigate(['/chatroom', roomname]);

  }


  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }


  enterGroupRoom(row) {
    const sendInitialMessage = (bool=false) => {
      const groupchat = { roomname: '', nickname: '', message: '', date: '', type: '' };
      groupchat.nickname = this.nickname;
      groupchat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
      groupchat.message = `${this.nickname} enter the room`;
      groupchat.type = 'join';
      const navigateRoom = (key) => {
        this.router.navigate(['/grouproom',key]);
      }

      if(bool) {
        const newMessage = firebase.database().ref('groupmessages/').push({messages : []})
        const groupref = firebase.database().ref('group/' + row.key);
        groupref.update({chatKey: newMessage.key});
        newMessage.then(function (response){
         response.child("messages").push(groupchat)
        //  console.log("newMsg.key",newMessage.key )
          navigateRoom(newMessage.key);
        });
      } else{
        firebase.database().ref('groupmessages/' + row.chatKey).child("messages").push(groupchat)
        // console.log("Row.chatkey" , row.chatKey)
        navigateRoom(row.chatKey);
      }
    }
    if(row.chatKey) {
      sendInitialMessage();
      this.router.navigate(['/grouproom',row.chatKey]);
    }else {
      sendInitialMessage(true);
      
    }
  }


  enterOnetoOneChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    const newMessage = firebase.database().ref('Onechats/').push();
    newMessage.set(chat);

    firebase.database().ref('Oneroomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);







      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('Oneroomusers/' + user.key);
        // userRef.update({status: 'online'});
      } else {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        // newroomuser.status = 'online';
        const newRoomUser = firebase.database().ref('Oneroomusers/').push();
        newRoomUser.set(newroomuser);
      }
    });

    this.router.navigate(['/chatroomone', roomname]);
  }



  logout(): void {
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }

}
