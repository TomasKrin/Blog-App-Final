import { EditAnswer, EditQuestion } from "../types/postsTypes";
import {
  addNewAnswers,
  createQuestion,
  deleteAnswer,
  deleteQuestion,
  editAnswer,
  editQuestion,
  fetchQuestions,
} from "../api/posts";
import { useMutation, useQuery } from "@tanstack/react-query";

import { SubmitAnswer } from "../pages/Home/AddAnswerForm";

const QUESTIONS = "QUESTIONS";
const ANSWERS = "ANSWERS";

export const useQuestions = () => {
  return useQuery([QUESTIONS], fetchQuestions);
};

export const useCreateQuestion = () => {
  return useMutation([QUESTIONS], createQuestion);
};

export const useEditQuestion = () => {
  return useMutation([QUESTIONS], ({ question_id, question }: EditQuestion) =>
    editQuestion(question_id, question)
  );
};

export const useDeleteQuestion = () => {
  return useMutation([QUESTIONS], deleteQuestion);
};

export const useAddAnswer = (question_id: string) => {
  return useMutation([ANSWERS], (answer: SubmitAnswer) => addNewAnswers(question_id, answer));
};

export const useEditAnswer = () => {
  return useMutation([ANSWERS], ({ answer_id, answer }: EditAnswer) =>
    editAnswer(answer_id, answer)
  );
};

export const useDeleteAnswer = () => {
  return useMutation([ANSWERS], deleteAnswer);
};
