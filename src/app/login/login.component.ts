import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as firebase from 'firebase';
import { DataService } from 'src/services/data.service';
import { Subscription } from 'rxjs';
import { snapshotToArray } from 'src/utils/functions';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  PageStatus = true;
  alreadyExist= false;
  errorMessage = ""
  isLoggedIn = false;
  loginForm: FormGroup;
  signupForm: FormGroup;
  nickname = '';
  ref = firebase.database().ref('users/');
  matcher = new MyErrorStateMatcher();
  subscription: Subscription;

  constructor(private router: Router, private formBuilder: FormBuilder, private data: DataService) { }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  checkUserNameAvailable(name, login = false){
    return new Promise((res)=>{
      this.ref.orderByChild('nickname').equalTo(name).once('value', snapshot => {
        const exists = snapshot.exists();
        if(login) {
          if(exists) {
            return res(null)
          } else {
            return res({usernameExists:false});
          }
        }else {
          console.log("HERE",name)
          if(exists) {
            console.log("EXISTS")
            return res({usernameExists:true});
          } else{
            
          console.log("NOT EXISTS")
            return res(null)
          }
        }
      });
    })
  }
 
   usernameValidator(login) {
     return (control) => {
      return this.checkUserNameAvailable(control.value,login);
    };
  }
  ngOnInit() {
    this.subscription = this.data.loginInfo.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn)

    if (localStorage.getItem('nickname')) {
      this.router.navigate(['/roomlist']);
    }

    this.loginForm = this.formBuilder.group({
      nickname: [
        null,
        {
          validators: [Validators.required],
          asyncValidators: [this.usernameValidator(true)],
          updateOn: 'blur'
        }
      ]
    });


    this.signupForm = this.formBuilder.group({
      nickname: [
        null,
        {
          validators: [Validators.required],
          asyncValidators: [this.usernameValidator(false)],
          updateOn: 'blur'
        }
      ]
    });


  }
  showError(text:string) {
    this.errorMessage = text;
    Object.values(this.loginForm.controls).forEach(control => {
        control.setErrors({})
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
    });
  }
  onFormSubmit(form: any) {
    if (this.loginForm.valid) {      
      this.data.emitLoginStatus(true);
      const login = form;
      localStorage.setItem('nickname', login.nickname);
      this.ref.orderByChild('nickname').equalTo(login.nickname).once('value', snapshot => {
        const res = snapshotToArray(snapshot);
        if(res?.length)
        localStorage.setItem('userId', res[0].key);
      });
      this.router.navigate(['/roomlist']);
    } 
  }

  onSignUpFormSubmit(form: any) {
    const login = this.signupForm.value;
    if (this.signupForm.valid) {      
      this.data.emitLoginStatus(true);
      const newUser = firebase.database().ref('users/').push();
      newUser.set({nickname: login.nickname});
      console.log({login})
      localStorage.setItem('nickname', login.nickname);
      localStorage.setItem('userId', newUser.key);
      
      this.router.navigate(['/roomlist']);
    }
  }




}
