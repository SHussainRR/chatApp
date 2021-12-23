import * as moment from 'moment';
import { ClientService } from 'src/utils/client';
import { DATABASE_NAME } from 'src/utils/dbConstants';
import { getOneToOneRoomData } from './transform';

export abstract class NotificationService {
  static oneToOneRoom(roomnames: string[], nickname, date, result) {
    const currentDate = moment(date);
    const callback = (data) => {
      const filteredData = getOneToOneRoomData(data);
      if(filteredData.nickname !== nickname && filteredData.date, moment(filteredData.date, 'DD/MM/YYYY hh:mm:ss').diff(currentDate, 'seconds') >= 0) {
        let message = '';
        if(filteredData.type === "message") {
          message = `You got a new message in room ${filteredData.roomname}`
        }else {
          message = `${filteredData.message}`
        }
        result({
          message,
          type: 'info'
        })
      }
    };
    //Onechats/{roomname}

    roomnames.forEach((roomname) => {
      ClientService.child('Onechats', roomname, 'on', 'child_added', callback);
    });
  }



  static groupRoom(chatKeys: string[], nickname, date, result) {
    const currentDate = moment(date);
    const callback = (data) => {
      // const filteredData = getOneToOneRoomData(data);
      // if(filteredData.nickname !== nickname && filteredData.date, moment(filteredData.date, 'DD/MM/YYYY hh:mm:ss').diff(currentDate, 'seconds') >= 0) {
      //   let message = '';
      //   if(filteredData.type === "message") {
      //     message = `You got a new message in room ${filteredData.roomname}`
      //   }else {
      //     message = `${filteredData.message}`
      //   }
      //   result({
      //     message,
      //     type: 'info'
      //   })
      // }


      const filteredData = getOneToOneRoomData(data);


      // console.log("Asim was here " , getOneToOneRoomData(data))
    };


    chatKeys.forEach((chatKey) => {
      ClientService.child('groupmessages', chatKey, 'on', 'child_added', callback);
    });
  }




}
