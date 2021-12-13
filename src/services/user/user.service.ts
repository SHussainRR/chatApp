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

//   static changeUserStatus(online,result) {
//     ClientService.update(DATAB_NAME,"on","dasdas",{das})
//   }
}
