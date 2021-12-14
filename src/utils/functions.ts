import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export const isLoggedIn = () => getUserId() && true;

export const snapshotToArray = (snapshot: any) => {
    const returnArr = [];
  
    snapshot.forEach((childSnapshot: any) => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
  
    return returnArr;
  };

  export const getUserId = () => {
    return localStorage.getItem('nickname')
  }

  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }
  