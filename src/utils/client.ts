import * as firebase from "firebase";

const config = {
    apiKey: 'AIzaSyAiwJQPJ_XmcsK6ibRvYhRW_X8YnCvkDQg',
    databaseURL: 'https://angularchat-fff13-default-rtdb.firebaseio.com',
};

export abstract class ClientService {

    private static database = null;

    private static getDataBase(){
        this.initApp();
        return this.database;
    }
    
    static initApp(){
        if(this.database === null) {
            this.database = firebase.initializeApp(config);
        }
    }

    static get(ref:string, on:string, value:string, callback, opts = []){
        let result = this.getDataBase().database().ref(ref);
        if(opts?.length) {
            opts.forEach(opt=>{
                result = result[opt.key](opt.value);
            })
        }
        return result[on](value, callback)
    }
    
    // static update ( ref: string, value: string){
    //     let result = this.getDataBase().database().ref(ref);
    //     return result(value)
    // }

    // const makeUserOnline = (online) => {
    //     const userRef = firebase.database().ref('users/' + localStorage.getItem('userId'));
    //     userRef.update({status: online? "online" : "ofline" });


  }