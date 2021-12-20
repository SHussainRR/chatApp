import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
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

  ref = firebase.database().ref('OnetoOne/');
  matcher = new MyErrorStateMatcher();

  @Input() showOneModal: (bool) => {};
  @Input() set item(item: string) {
    this.nickname = item;
    console.log(this.nickname, ' FROM @Input');
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
        this.UserTwo = '';
        this.showOneModal(false);
      }
    }
  }
}
