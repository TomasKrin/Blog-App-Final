import { Dispatch, SetStateAction, useContext } from "react";
import { useDeleteAnswer, useDeleteQuestion, useQuestions } from "../../hooks/posts";

import { UserContext } from "../../contexts/UserContext";
import { primaryColor } from "../../consts/styles";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useUser } from "../../hooks/user";

type Props = {
  post_id: string;
  type: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

const UserPostManagement = ({ post_id, type, setIsOpen, setIsEditing }: Props) => {
  const { userId } = useContext(UserContext);
  const { mutateAsync: deleteQuestion } = useDeleteQuestion();
  const { mutateAsync: deleteAnswer } = useDeleteAnswer();
  const { refetch: refetchQuestion } = useQuestions();
  const userIdChecked = userId ? userId : "";
  const { refetch: refetchUser } = useUser(userIdChecked);

  const handleDeleteQuestion = () => {
    deleteQuestion(post_id);
    setIsOpen(false);
    setTimeout(() => {
      refetchQuestion();
      refetchUser();
      toast.success("Question deleted successfully!");
    }, 100);
  };

  const handleDeleteAnswer = () => {
    deleteAnswer(post_id);
    setTimeout(() => {
      refetchQuestion();
      refetchUser();
      toast.success("Answer deleted successfully!");
    }, 100);
  };

  return (
    <Container>
      {type === "question" && (
        <>
          <EditButton onClick={() => setIsEditing(true)}>Edit</EditButton>
          <DeleteButton onClick={handleDeleteQuestion}>Delete</DeleteButton>
        </>
      )}
      {type === "answer" && (
        <>
          <EditButton onClick={() => setIsEditing(true)}>Edit</EditButton>
          <DeleteButton onClick={handleDeleteAnswer}>Delete</DeleteButton>
        </>
      )}
    </Container>
  );
};

export default UserPostManagement;
const Container = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;
const EditButton = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: ${primaryColor};
  }
`;
const DeleteButton = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: red;
  }
`;
