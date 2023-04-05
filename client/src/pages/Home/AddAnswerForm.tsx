import * as Yup from "yup";

import { Form, Formik, FormikHelpers } from "formik";
import { useAddAnswer, useQuestions } from "../../hooks/posts";

import Button from "../../components/Button/Button";
import FormikInput from "../../components/Formik/FormikInput";
import { NewAnswer } from "../../types/postsTypes";
import { UserContext } from "../../contexts/UserContext";
import { required } from "../../consts/validations";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useContext } from "react";
import { useUser } from "../../hooks/user";

type Props = {
  question_id: string;
};

export type SubmitAnswer = {
  answer: string;
};

const initialValues: SubmitAnswer = {
  answer: "",
};

const validationSchema: Yup.ObjectSchema<SubmitAnswer> = Yup.object().shape({
  answer: Yup.string().required(required),
});

const AddAnswerForm = ({ question_id }: Props) => {
  const { userId, userNickname } = useContext(UserContext);
  const { mutateAsync: addNewAnswers } = useAddAnswer(question_id);
  const userIdChecked = userId ? userId : "";
  const { refetch: refetchUser } = useUser(userIdChecked);
  const { refetch: refetchQuestions } = useQuestions();

  const handleSubmit = ({ answer }: SubmitAnswer, { resetForm }: FormikHelpers<SubmitAnswer>) => {
    if (userNickname) {
      const newAnswer: NewAnswer = {
        answer: answer,
        user_id: userIdChecked,
        user_nickname: userNickname,
        type: "answer",
      };
      addNewAnswers(newAnswer)
        .then(() => {
          toast.success("Answer Posted!");
          refetchQuestions();
          refetchUser();
          resetForm();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Something went wrong..");
        });
    } else {
      toast.error("Log In to answer the question");
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting }) => (
        <StyledForm>
          <RowContainer>
            <FormikInput type="text" name="answer" placeholder="Write an answer..." />
            <Button variant="primary" disabled={isSubmitting}>
              Post
            </Button>
          </RowContainer>
        </StyledForm>
      )}
    </Formik>
  );
};

export default AddAnswerForm;

const StyledForm = styled(Form)`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
  h1 {
    text-align: center;
  }
`;

const RowContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: baseline;
  input {
    width: 35vw;
  }
`;
