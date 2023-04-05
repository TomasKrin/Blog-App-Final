import { UserInfoInQuestion } from "./userTypes";

export type Question = {
  type: "question";
  _id: string;
  date: string;
  title: string;
  user: UserInfoInQuestion;
  question: string;
  edited: boolean;
  answers: Answer[];
};

export type NewQuestion = {
  title: string;
  question: string;
  user_id: string;
  type: "question";
};

export type AddQuestion = {
  title: string;
  question: string;
};

export type Answer = {
  date: string;
  user_id: string;
  type: "answer";
  question_id: string;
  user: UserInfoInQuestion;
  _id: string;
  answer: string;
  user_nickname: string;
  edited: boolean;
};

export type NewAnswer = {
  answer: string;
  user_id: string;
  user_nickname: string;
  type: "answer";
};

export type AddAnswer = {
  answer: string;
  question_id: string;
  user_id: string;
};

export type AnswerEdited = {
  answer: string;
};

export type Post = {
  postId: string;
  _id: string;
  post_id: string;
  post_type: string;
  isLiked: boolean;
};

export type EditQuestion = {
  question_id: string;
  question: AddQuestion;
};

export type EditAnswer = {
  answer_id: string;
  answer: AnswerEdited;
};
