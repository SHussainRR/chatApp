import { Injectable } from '@angular/core'; // at top
import { BehaviorSubject } from 'rxjs';
import { isLoggedIn } from 'src/utils/functions';

@Injectable({
    providedIn: 'root' // just before your class
  })
export class DataService {

  private isLoggedIn = new BehaviorSubject(isLoggedIn());
  loginInfo = this.isLoggedIn.asObservable();

  constructor() { }

  emitLoginStatus(isLoggedIn: boolean) {
    this.isLoggedIn.next(isLoggedIn);
  }
}