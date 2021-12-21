import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';
import { MyErrorStateMatcher, snapshotToArray } from 'src/utils/functions';

type User = string;
interface SelectUser {
  itemName: User;
  id: string;
}

@Component({
  selector: 'app-addone',
  templateUrl: './addone.component.html',
  styleUrls: ['./addone.component.css'],
})
export class AddoneComponent implements OnInit {
  roomForm: FormGroup;
  nickname = '';
  roomname = '';
  UserTwo = '';
  UserOne = '';
  // ng dropdown
  dropdownList = [];
  dropdownSettings = {};
  selectedItems: SelectUser[] = [];
  allUsers: SelectUser[] = [];

  ref = firebase.database().ref('OnetoOne/');
  matcher = new MyErrorStateMatcher();

  @Input() showOneModal: (bool) => {};
  @Input() set item(item: string) {
    this.nickname = item;
    console.log(this.nickname, ' FROM @Input');

    if (item != null) {
      firebase
        .database()
        .ref('users/')
        .orderByChild('nickname')
        .on('value', (resp2: any) => {
          const roomusers = snapshotToArray(resp2);
          const newVar: SelectUser[] = roomusers
            .filter((el) => el.nickname && el.nickname !== this.nickname)
            .map((ru) => {
              return { id: ru.key, itemName: ru.nickname };
            });
          this.dropdownList = newVar;
        });
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      roomname: [null, Validators.required],
    });
    this.nickname = localStorage.getItem('nickname');

    this.dropdownSettings = {
      singleSelection: true,
      text: 'Select Users to Add in Group',
      classes: 'myclass custom-class',
      enableSearchFilter: true,
    };
  }

  gooBack(): void {
    this.router.navigate(['/roomlist']);
  }
  async findData(name): Promise<boolean> {
    return new Promise((res) => {
      this.ref
        .orderByChild('roomname')
        .equalTo(name)
        .once('value', (snapshot: any) => {
          if (snapshot.exists()) {
            res(true);
          } else {
            res(false);
          }
        });
    });
  }
  async onFormSubmit(form: any) {
    const { selectedItems } = this;
    if (!(selectedItems?.length && selectedItems[0]?.itemName)) {
      // required
      return;
    }
    this.UserTwo = selectedItems[0].itemName;
    const room = form;
    const roomExists: Boolean[] = await Promise.all([
      this.findData(this.UserTwo + ' ' + this.nickname),
      this.findData(this.nickname + ' ' + this.UserTwo),
    ]);
    if (roomExists.some((item) => item)) {
      this.snackBar.open('Your Room with this User already exists !! ', 'Dismiss', {
        duration: 3000,
      });
    } else {
      if (this.UserTwo == this.nickname) {
        this.snackBar.open('Please enter A valid User to chat !! ', 'Dismiss', {
          duration: 3000,
        });
      } else {
        const newRoom = firebase.database().ref('OnetoOne/').push();
        room.UserTwo = this.UserTwo;
        room.UserOne = this.nickname;
        room.roomname = this.nickname + ' ' + this.UserTwo;
        // console.log( "rooomname : " + this.roomname , "NICK:"+ this.nickname , this.UserOne , "USER TWO"+ this.UserTwo);
        newRoom.set(room).catch((e) => this.showOneModal(false));
        this.router.navigate(['/roomlist']);
        this.showOneModal(false);
      }
    }
  }
}
