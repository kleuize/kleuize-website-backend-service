import { Types, Document } from "mongoose";
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
