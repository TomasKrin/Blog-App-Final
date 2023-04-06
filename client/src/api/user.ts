import { LoginUser, NewUser, User } from "../types/userTypes";

import axios from "axios";

const REGISTER_URL = "http://127.0.0.1:8080/register/";
const LOGIN_URL = "http://127.0.0.1:8080/login/";

const userReactionLikesUrl = (user_id: string, post_id: string) => {
  return `http://127.0.0.1:8080/user/${user_id}/posts/${post_id}/likes`;
};
const userReactionDislikesUrl = (user_id: string, post_id: string) => {
  return `http://127.0.0.1:8080/user/${user_id}/posts/${post_id}/dislikes`;
};

const userUrl = (user_id: string) => {
  return `http://127.0.0.1:8080/user/${user_id}`;
};

export const registerUser = (newUser: NewUser): Promise<User[]> => {
  return axios.post(REGISTER_URL, newUser).then((response) => response.data);
};

export const loginUser = (loginUser: LoginUser): Promise<User[]> => {
  return axios.post(LOGIN_URL, loginUser).then((response) => response.data);
};

export const getUser = (user_id: string): Promise<User[]> => {
  return axios.get(userUrl(user_id)).then((response) => response.data);
};

export const addLikedPost = (user_id: string, post_id: string, postType: string) => {
  return axios
    .patch(userReactionLikesUrl(user_id, post_id), { type: postType })
    .then((response) => response.data);
};

export const addDislikedPost = (user_id: string, post_id: string, postType: string) => {
  return axios
    .patch(userReactionDislikesUrl(user_id, post_id), { type: postType })
    .then((response) => response.data);
};
