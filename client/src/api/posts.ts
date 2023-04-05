import { AddQuestion, Answer, AnswerEdited, NewQuestion, Question } from "../types/postsTypes";

import { SubmitAnswer } from "../pages/Home/AddAnswerForm";
import axios from "axios";

const QUESTIONS_URL = "http://127.0.0.1:8080/questions";

const questionUrl = (question_id: string) => {
  return `http://127.0.0.1:8080/questions/${question_id}/`;
};

export const fetchQuestions = (): Promise<Question[]> => {
  return axios.get(QUESTIONS_URL).then((response) => response.data);
};

export const createQuestion = (question: NewQuestion): Promise<Question> => {
  return axios.post(QUESTIONS_URL, question).then((response) => response.data);
};

export const editQuestion = (question_id: string, question: AddQuestion): Promise<Question[]> => {
  return axios.patch(questionUrl(question_id), question).then((response) => response.data);
};

export const deleteQuestion = (question_id: string): Promise<Question> => {
  return axios.delete(questionUrl(question_id)).then((response) => response.data);
};

const answersToQuestionUrl = (question_id: string) => {
  return `http://127.0.0.1:8080/questions/${question_id}/answers`;
};

const answersUrl = (answer_id: string) => {
  return `http://127.0.0.1:8080/answers/${answer_id}`;
};

export const addNewAnswers = (question_id: string, answer: SubmitAnswer): Promise<Answer> => {
  return axios.post(answersToQuestionUrl(question_id), answer).then((response) => response.data);
};

export const editAnswer = (answer_id: string, newAnswer: AnswerEdited): Promise<Answer> => {
  return axios.patch(answersUrl(answer_id), newAnswer).then((response) => response.data);
};

export const deleteAnswer = (answer_id: string): Promise<Answer> => {
  return axios.delete(answersUrl(answer_id)).then((response) => response.data);
};
