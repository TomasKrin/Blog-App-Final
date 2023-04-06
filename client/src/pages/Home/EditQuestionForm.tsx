import * as Yup from "yup";

import { AddQuestion, EditQuestion } from "../../types/postsTypes";
import { Dispatch, SetStateAction } from "react";
import { Form, Formik } from "formik";
import { useEditQuestion, useQuestions } from "../../hooks/posts";

import Button from "../../components/Button/Button";
import FormikInput from "../../components/Formik/FormikInput";
import FormikTextArea from "../../components/Formik/FormikTextArea";
import { required } from "../../consts/validations";
import styled from "styled-components";
import toast from "react-hot-toast";

type Props = {
  titleRef: string | null | undefined;
  questionRef: string | null | undefined;
  question_id: string;
  setIsEditingQuestion: Dispatch<SetStateAction<boolean>>;
};

const validationSchema: Yup.ObjectSchema<AddQuestion> = Yup.object().shape({
  title: Yup.string().required(required),
  question: Yup.string().required(required),
});

const EditQuestionForm = ({ titleRef, questionRef, question_id, setIsEditingQuestion }: Props) => {
  const { mutateAsync: editQuestion } = useEditQuestion();
  const { refetch } = useQuestions();

  const handleSubmit = (values: AddQuestion) => {
    if (values.title !== titleRef || values.question !== questionRef) {
      const redactedQuestion: EditQuestion = {
        question_id: question_id,
        question: values,
      };
      editQuestion(redactedQuestion)
        .then(() => {
          refetch();
          setIsEditingQuestion(false);
          toast.success("Question edited successfully!");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Something went wrong..");
        });
    } else {
      setIsEditingQuestion(false);
    }
  };

  const initialValues: AddQuestion = {
    title: titleRef ?? "",
    question: questionRef ?? "",
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
            <FormikInput type="text" name="title" />
          </RowContainer>
          <RowContainer>
            <FormikTextArea type="text" name="question" />
          </RowContainer>
          <ButtonContainer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditingQuestion(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" disabled={isSubmitting}>
              Edit
            </Button>
          </ButtonContainer>
        </StyledForm>
      )}
    </Formik>
  );
};

export default EditQuestionForm;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  textarea {
    height: 120px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-end;
`;
