import { ClientService } from "src/utils/client";
import { DATABASE_NAME } from "src/utils/dbConstants";
import { getUserData } from "./transform";

export abstract class UserService {

  static getUsersList(result){
    const callback = (response: any) => {
        const [onlineUsers, offlineUsers, allUsers] = getUserData(response);
        result(onlineUsers, offlineUsers, allUsers);
    };
    
    ClientService.get(DATABASE_NAME.user, "on", "value", callback, [{
        key: 'orderByChild',
        value: 'status',
    }]);
  }

  static makeUserOnline(online: boolean) {
    if(localStorage.getItem('userId') !== null){
      const ref = DATABASE_NAME.user + localStorage.getItem('userId');
      const params = {status: online? "online" : "ofline" };
      ClientService.update(ref, params);
    }
  }

  // static changeUserStatus(online,result) {
  //   ClientService.update(DATABASE_NAME,"on","dasdas",{das})
  // }

}

// const makeUserOnline = (online) => {
//   const userRef = firebase.database().ref('users/' + localStorage.getItem('userId'));
//   userRef.update({status: online? "online" : "ofline" });