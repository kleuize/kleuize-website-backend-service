import { Types, Document } from "mongoose";

export interface IUserDocument {
  /**
   * user name
   */
  name: string;
   /**
   * user surName
   */
  surName: string;
  /**
   * user e-mail
   */
  email: string;
  /**
   * user password
   */
  password: string;
  /**
   * user TCKN
   */
  identityNumber?: string;
   /**
   * user city
   */
  city?: string;
  country?: string;
  ip?: string;
  registrationAddress?: string;
  contactName?: string;
  address?: string;
  itemType?: string;
  productName?: string;
  category1?: string;
  price?: number;
  role?: string[];
  picture?: string;
  phoneNumber?: string;
  courses?: any;
  passwordResetCode?: string;
  cardUserKey?: string;
  identifyNumber: string;
  // you should after delete
  stripe_account_id?: string;
  stripe_seller?: {};
  stripeSession?: {};
}

export interface ILessonModel {
  lessonTitle: string;
  slug?: string;
  quiz?: {};
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

export type AnswerDocument = Document & {
  text: string;
  isCorrect: boolean;
};

export type QuestionDocument = Document & {
  content: string;
  answers: AnswerDocument["_id"];
};

export type QuizDocument = Document & {
  quizTitle: string;
  questions: QuestionDocument["_id"];
};
