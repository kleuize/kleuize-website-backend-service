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
  name?: string;
  email?: string;
  password?: string;
  role?: string[];
  picture: string;
  courses?: any;
  stripe_account_id: string;
  stripe_seller: {};
  stripeSession: {};
  passwordResetCode: string;
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
