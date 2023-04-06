import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";

import EditAnswerForm from "./EditAnswerForm";
import ReactionButtons from "../../components/ReactionButtons/ReactionButtons";
import { UserContext } from "../../contexts/UserContext";
import UserPostManagement from "../../components/UserPostManagement/UserPostManagement";
import styled from "styled-components";

type Props = {
  id: string;
  user_id: string;
  user_nickname: string;
  date: string;
  edited: boolean;
  answer: string;
  type: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const AnswerCard = ({
  id,
  user_id,
  user_nickname,
  date,
  edited,
  answer,
  type,
  setIsOpen,
}: Props) => {
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);

  const answerRef = useRef<HTMLParagraphElement>(null);

  const { userId } = useContext(UserContext);

  return (
    <div>
      {userId && (
        <AnswerCardContainer>
          {isEditingAnswer ? (
            <>
              <EditAnswerForm
                answer_id={id}
                answerRef={answerRef.current?.textContent}
                setIsEditingAnswer={setIsEditingAnswer}
              />
            </>
          ) : (
            <>
              <User>
                <span>{user_nickname}</span>
              </User>
              <AnswerDiv>
                <AnswerDateContainer>
                  <Date>{date}</Date>
                </AnswerDateContainer>
                {edited && (
                  <EditedIndicatorAnswer>
                    <i>Edited</i>
                  </EditedIndicatorAnswer>
                )}
                <p ref={answerRef}>{answer}</p>
                <ControlButtonsForAnswerContainer>
                  <ReactionButtons user_id={userId} post_id={id} type={type} />
                  {user_id.includes(userId) && (
                    <UserPostManagement
                      post_id={id}
                      type={type}
                      setIsOpen={setIsOpen}
                      setIsEditing={setIsEditingAnswer}
                    />
                  )}
                </ControlButtonsForAnswerContainer>
              </AnswerDiv>
            </>
          )}
        </AnswerCardContainer>
      )}
    </div>
  );
};

export default AnswerCard;

const AnswerDateContainer = styled.div`
  position: absolute;
  top: 0;
  font-size: 0.7rem;
`;

const EditedIndicatorAnswer = styled.div`
  font-size: 0.6rem;
  position: absolute;
  top: 0px;
  right: 80px;
  font-weight: 600;
  color: gray;
`;

const ControlButtonsForAnswerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 0px;
  font-size: 0.6rem;
`;

const AnswerDiv = styled.div`
  flex: 10;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  position: relative;
  p {
    margin-top: 18px;
  }
`;

const AnswerCardContainer = styled.div`
  width: 95%;
  display: flex;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid lightgray;
  padding: 16px 8px;
  font-weight: 300;
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

const Date = styled.span`
  color: gray;
  font-weight: 300;
`;
