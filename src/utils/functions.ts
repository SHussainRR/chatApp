import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const isLoggedIn = () => getUserId() && true;

export const snapshotToArray = (snapshot: any, returnValue = []) => {
  const returnArr : any = returnValue;

  snapshot.forEach((childSnapshot: any) => {
    const value = childSnapshot.val();
    let item = value;
    if (Array.isArray(returnValue)) {
      item.key = childSnapshot.key;
      returnArr.push(item);
    } else {
      returnArr[childSnapshot.key] = value
    }
  });

  return returnArr;
};

export const getUserId = () => {
  return localStorage.getItem('nickname');
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface Notification {
  type: 'info' | 'success' | 'error',
  message: string;
  duration? : number;
}
