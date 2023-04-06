import { useContext, useRef, useState } from "react";

import AddAnswerForm from "./AddAnswerForm";
import { Answer } from "../../types/postsTypes";
import AnswerCard from "./AnswerCard";
import EditQuestionForm from "./EditQuestionForm";
import ReactionButtons from "../../components/ReactionButtons/ReactionButtons";
import { UserContext } from "../../contexts/UserContext";
import UserPostManagement from "../../components/UserPostManagement/UserPostManagement";
import styled from "styled-components";
import toast from "react-hot-toast";

type Props = {
  title: string;
  question: string;
  userNickname: string;
  question_id: string;
  type: string;
  answers: Answer[];
  edited: boolean;
  postedById: string;
  date: string;
};

const QuestionCard = ({
  title,
  question,
  userNickname,
  question_id,
  answers,
  type,
  edited,
  postedById,
  date,
}: Props) => {
  const [openQuestion, setOpenQuestion] = useState(false);
  const { isLoggedIn, userId } = useContext(UserContext);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const questionRef = useRef<HTMLParagraphElement>(null);

  const toggleOpenQuestion = () => {
    if (isLoggedIn) {
      setOpenQuestion((prev) => !prev);
    } else {
      toast.error("Login to check the question..");
    }
  };

  if (isLoggedIn && openQuestion && userId) {
    return (
      <Wrapper>
        {isEditingQuestion ? (
          <QuestionCardWrapper>
            <EditQuestionForm
              titleRef={titleRef.current?.textContent}
              questionRef={questionRef.current?.textContent}
              question_id={question_id}
              setIsEditingQuestion={setIsEditingQuestion}
            />
          </QuestionCardWrapper>
        ) : (
          <QuestionCardWrapper>
            <Title onClick={toggleOpenQuestion}>
              <span ref={titleRef}>{title}</span>
              <QuestionDateContainer>
                <Date>{date}</Date>
              </QuestionDateContainer>
            </Title>
            <QuestionContainer>
              <User>{userNickname}</User>
              <Question>
                {edited && (
                  <EditedIndicatorQuestion>
                    <i>Edited</i>
                  </EditedIndicatorQuestion>
                )}
                <p ref={questionRef}>{question}</p>
              </Question>
              <ControlButtonsForQuestionContainer>
                <ReactionButtons user_id={userId} post_id={question_id} type={type} />
                {postedById.includes(userId) && (
                  <UserPostManagement
                    post_id={question_id}
                    type={type}
                    setIsOpen={setOpenQuestion}
                    setIsEditing={setIsEditingQuestion}
                  />
                )}
              </ControlButtonsForQuestionContainer>
            </QuestionContainer>
            <AddAnswerForm question_id={question_id} />
          </QuestionCardWrapper>
        )}

        {answers.length ? (
          <AnswersContainer>
            {answers.map((answer) => (
              <div key={answer._id}>
                <AnswerCard
                  id={answer._id}
                  user_id={answer.user_id}
                  user_nickname={answer.user_nickname}
                  date={answer.date}
                  edited={answer.edited}
                  answer={answer.answer}
                  type={answer.type}
                  setIsOpen={setOpenQuestion}
                />
              </div>
            ))}
          </AnswersContainer>
        ) : (
          <AnswersContainer>No answers for this question, yet..</AnswersContainer>
        )}
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <QuestionCardWrapper>
          <QuestionContainer>
            <User>{userNickname}</User>
            <Title onClick={toggleOpenQuestion}>
              {title}
              <QuestionDateContainer>
                <Date>{date}</Date>
              </QuestionDateContainer>
            </Title>
          </QuestionContainer>
        </QuestionCardWrapper>
      </Wrapper>
    );
  }
};

export default QuestionCard;

const Wrapper = styled.div`
  position: relative;
  padding: 16px;
`;

const QuestionCardWrapper = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
  padding: 16px;
  background-color: snow;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

const QuestionContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const Title = styled.h3`
  cursor: pointer;
  flex: 10;
`;

const User = styled.p`
  display: flex;
  justify-content: center;
  border: 1px solid lightgray;
  padding: 6px;
  height: 12px;
  font-size: 0.8rem;
  border-radius: 5px;
  flex: 1;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
`;

const Question = styled.div`
  display: flex;
  gap: 24px;
  flex: 10;
  p {
    margin-top: 24px;
  }
`;

const AnswersContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 90%;
  border: 1px solid lightgray;
  border-top: none;
  margin: 0 auto;
  font-size: 0.8rem;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
`;

const ControlButtonsForQuestionContainer = styled.div`
  font-size: 0.8rem;
  display: flex;
  position: absolute;
  bottom: 15px;
  left: 20px;
  flex: 1;
  gap: 16px;
`;

const EditedIndicatorQuestion = styled.div`
  font-size: 0.8rem;
  position: absolute;
  top: 20px;
  right: 20px;
  font-weight: 600;
  color: gray;
`;

const Date = styled.span`
  color: gray;
  font-weight: 300;
`;

const QuestionDateContainer = styled.div`
  position: absolute;
  font-size: 0.7rem;
`;
