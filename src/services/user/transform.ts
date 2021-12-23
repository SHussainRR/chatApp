import { transformData } from "../utils/functions";

export const getUserData = (data) => {
    const roomUser = transformData(data);
    const onlineUsers = roomUser.filter(x => x.status === 'online');
    const offlineUsers = roomUser.filter(x => x.status !== 'online');
    const allUsers = roomUser;

    return [onlineUsers, offlineUsers, allUsers];
}
