import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';
import { MyErrorStateMatcher } from 'src/utils/functions';



@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.css'],
})
export class AddroomComponent implements OnInit {
  roomForm: FormGroup;
  nickname = '';
  roomname = '';
  ref = firebase.database().ref('rooms/');
  matcher = new MyErrorStateMatcher();
  @Input() showConferenceModal: (bool) => {};
  @Input() set item(item: string) {
    this.nickname = item;
    console.log(this.nickname, ' FROM @Input');
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // this.nickname = localStorage.getItem('nickname');
  }

  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      roomname: [null, Validators.required],
    });
    // this.nickname = localStorage.getItem('nickname');
  }

  gooBack(): void {
    this.router.navigate(['/roomlist']);
  }

  onFormSubmit(form: any) {
    const room = form;
    this.ref
      .orderByChild('roomname')
      .equalTo(room.roomname)
      .once('value', (snapshot: any) => {
        if (snapshot.exists()) {
          this.snackBar.open('Room name already exist!', 'Dismiss', {
            duration: 3000,
          });
        } else {
          const newRoom = firebase.database().ref('rooms/').push();
          newRoom.set(room);
          // this.router.navigate(['/roomlist']);
          this.roomForm.reset();
          this.showConferenceModal(false);
        }
      });
  }
}
