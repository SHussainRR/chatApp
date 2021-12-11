import * as firebase from "firebase";

export const isLoggedIn = () => localStorage.getItem('nickname') && true;

export const makeUserOnline = (online) => {
    const userRef = firebase.database().ref('users/' + localStorage.getItem('userId'));
    userRef.update({status: online? "online" : "ofline" });
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