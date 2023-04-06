import * as Yup from "yup";

import { AddQuestion, NewQuestion } from "../../types/postsTypes";
import { Form, Formik } from "formik";
import { useCreateQuestion, useQuestions } from "../../hooks/posts";

import Button from "../../components/Button/Button";
import FormikInput from "../../components/Formik/FormikInput";
import FormikTextArea from "../../components/Formik/FormikTextArea";
import { UserContext } from "../../contexts/UserContext";
import { required } from "../../consts/validations";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useContext } from "react";
import { useUser } from "../../hooks/user";

type Props = {
  closeModal: () => void;
};

const initialValues: AddQuestion = {
  title: "",
  question: "",
};

const validationSchema: Yup.ObjectSchema<AddQuestion> = Yup.object().shape({
  title: Yup.string().required(required),
  question: Yup.string().required(required),
});

const AddQuestionForm = ({ closeModal }: Props) => {
  const { userId } = useContext(UserContext);
  const userIdChecked = userId ? userId : "";
  const { refetch: refetchUser } = useUser(userIdChecked);
  const { mutateAsync: createQuestion } = useCreateQuestion();
  const { refetch: refetchQuestions } = useQuestions();

  const handleSubmit = ({ title, question }: AddQuestion) => {
    if (userId) {
      const newQuestion: NewQuestion = {
        title: title,
        question: question,
        user_id: userId,
        type: "question",
      };

      createQuestion(newQuestion)
        .then(() => {
          refetchQuestions();
          refetchUser();
          closeModal();
          toast.success("Your question has been posted");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Something went wrong..");
        });
    } else {
      toast.error("Login to ask a question..");
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
            <FormikInput type="text" name="title" placeholder="Title" />
          </RowContainer>
          <RowContainer>
            <FormikTextArea type="text" name="question" placeholder="Write your question.." />
          </RowContainer>
          <ButtonContainer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" disabled={isSubmitting}>
              Submit
            </Button>
          </ButtonContainer>
        </StyledForm>
      )}
    </Formik>
  );
};

export default AddQuestionForm;

const StyledForm = styled(Form)`
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  h1 {
    text-align: center;
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-end;
`;
