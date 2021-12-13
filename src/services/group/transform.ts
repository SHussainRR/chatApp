import { transformData } from "../utils/functions";

export const getGroupData = (data, userId) => transformData(data).filter(el => el?.members?.includes(userId)).filter(el => el);
