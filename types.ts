import { Types } from "mongoose";
export interface IUserModel {
  name?: string;
  email?: string;
  password?: string;
  role?: string[];
  picture?: string;
  courses?: any;
  stripe_account_id?: string;
  stripe_seller?: {};
  stripeSession?: {};
  passwordResetCode?: string;
}
export interface ILessonModel {
  title: string;
  slug?: string;
  content?: {};
  quiz?: {};
  lecture_notes?: {};
  free_preview?: boolean;
}

export interface ICourseModel {
  name: string;
  slug?: string;
  description: {};
  category: string;
  price: number;
  image: {};
  published?: boolean;
  paid: boolean;
  instructor: Types.ObjectId;
  lessons: ILessonModel;
}
