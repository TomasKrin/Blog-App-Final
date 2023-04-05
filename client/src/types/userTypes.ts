import { Answer, Post, Question } from "./postsTypes";

export type LoginUser = {
  email: string;
  password: string;
};

export type NewUser = {
  name: string;
  last_name: string;
  email: string;
  nickname: string;
  password: string;
  confirm_password?: string;
};

export type User = {
  _id: string;
  name: string;
  last_name: string;
  email: string;
  nickname: string;
  password: string;
  disliked_posts: Post[] | [];
  liked_posts: Post[] | [];
  questions: Question[] | [];
  answers: Answer[] | [];
};

export type UserInfoInQuestion = {
  nickname: string;
  _id: string;
};

export type ReactionPatchTypes = {
  userId: string;
  postId: string;
  type: string;
};
