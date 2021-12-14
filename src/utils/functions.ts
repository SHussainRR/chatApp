import * as firebase from "firebase";

export const isLoggedIn = () => getUserId() && true;

export const makeUserOnline = (online) => {
  if(localStorage.getItem('userId') !== null){
    
    const userRef = firebase.database().ref('users/' + localStorage.getItem('userId'));
    userRef.update({status: online? "online" : "ofline" });
  }
}

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
  