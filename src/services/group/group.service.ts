import { ClientService } from "src/utils/client";
import { DATABASE_NAME } from "src/utils/dbConstants";
import { getUserId, snapshotToArray } from "src/utils/functions";
import { getGroupData } from "./transform";

export abstract class GroupService {

  static getGroupList(result){
    const callback = (response: any) => {
        const userId: String = getUserId();
        const data = getGroupData(response, userId);
        result(data);
    };
    ClientService.get(DATABASE_NAME.group, "on", "value", callback);
  }
}
