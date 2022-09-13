import { Document } from "mongoose";

export interface ILectureModel {
  lectureTitle?: string;
  lectureContent?: string;
  lecturePrice?: number;
  lectureOldPrice?: number;
  image?: string;
  rating?: number;
  tag?: string;
  instructor?: string;
}
export interface IUserModel extends Document {
  username?: string;
  email?: string;
  password?: string | CryptoJS.lib.CipherParams;
  isAdmin?: boolean;
  img?: string;
  _doc?: any;
}
interface ILecture {
  lectureId: string;
  quantity: number;
}
export interface IOrderModel {
  userId: string;
  lectures: ILecture;
  amount: number;
  address: Object;
  status: string;
}
