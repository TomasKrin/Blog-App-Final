import * as Yup from "yup";

import { Dispatch, SetStateAction } from "react";
import { Form, Formik } from "formik";
import { useEditAnswer, useQuestions } from "../../hooks/posts";

import Button from "../../components/Button/Button";
import { EditAnswer } from "../../types/postsTypes";
import FormikTextArea from "../../components/Formik/FormikTextArea";
import { required } from "../../consts/validations";
import styled from "styled-components";
import toast from "react-hot-toast";

type Props = {
  answer_id: string;
  answerRef: string | null | undefined;
  setIsEditingAnswer: Dispatch<SetStateAction<boolean>>;
};

export type SubmitAnswer = {
  answer: string;
};

const validationSchema: Yup.ObjectSchema<SubmitAnswer> = Yup.object().shape({
  answer: Yup.string().required(required),
});

const EditAnswerForm = ({ answer_id, answerRef, setIsEditingAnswer }: Props) => {
  const { mutateAsync: editAnswer } = useEditAnswer();
  const { refetch } = useQuestions();

  const handleSubmit = (values: SubmitAnswer) => {
    if (values.answer !== answerRef) {
      const newAnswer: EditAnswer = {
        answer_id: answer_id,
        answer: values,
      };
      editAnswer(newAnswer)
        .then(() => {
          refetch();
          setIsEditingAnswer(false);
          toast.success("Answer edited successfully!");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Something went wrong..");
        });
    } else {
      setIsEditingAnswer(false);
    }
  };

  const initialValues: SubmitAnswer = {
    answer: answerRef ?? "",
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
            <FormikTextArea type="text" name="answer" />
          </RowContainer>
          <ButtonContainer>
            <Button variant="primary" disabled={isSubmitting}>
              Edit
            </Button>
            <Button variant="secondary" onClick={() => setIsEditingAnswer(false)}>
              Cancel
            </Button>
          </ButtonContainer>
        </StyledForm>
      )}
    </Formik>
  );
};

export default EditAnswerForm;

const StyledForm = styled(Form)`
  display: flex;
  margin-bottom: 16px;
  flex-direction: column;
  width: 600px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  align-items: baseline;
  textArea {
    width: 600px;
    height: 100px;
    font-size: 0.8rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-end;
  align-self: flex-end;
  height: 50px;
`;
