import { BsSortDownAlt, BsSortUp } from "react-icons/bs";
import { useContext, useState } from "react";

import AddQuestionForm from "./AddQuestionForm";
import Button from "../../components/Button/Button";
import { Comment } from "react-loader-spinner";
import QuestionCard from "./QuestionCard";
import StyledModal from "../../components/StyledModal/StyledModal";
import { UserContext } from "../../contexts/UserContext";
import { primaryColor } from "../../consts/styles";
import styled from "styled-components";
import { useAutoUpdateUser } from "../../hooks/autoUpdateUser";
import { useQuestions } from "../../hooks/posts";

const Home = () => {
  const [sortOption, setSortOption] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const { isLoggedIn } = useContext(UserContext);

  useAutoUpdateUser();

  const { data, isLoading } = useQuestions();
  const questions = data || [];

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortOption === "date") {
      if (sortDirection === "desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    } else if (sortOption === "answers") {
      if (sortDirection === "desc") {
        return a.answers.length - b.answers.length;
      } else {
        return b.answers.length - a.answers.length;
      }
    } else {
      return 0;
    }
  });

  const handleSortOptionChange = (sortOption: string) => {
    if (sortOption === "date") {
      if (sortOption === sortOption) {
        setSortDirection((prevSortDirection) => (prevSortDirection === "desc" ? "asc" : "desc"));
      } else {
        setSortDirection("desc");
      }
      setSortOption(sortOption);
    } else if (sortOption === "answers") {
      if (sortOption === sortOption) {
        setSortDirection((prevSortDirection) => (prevSortDirection === "desc" ? "asc" : "desc"));
      } else {
        setSortDirection("desc");
      }
      setSortOption(sortOption);
    }
  };

  const handleToggleQuestionForm = () => {
    setQuestionFormOpen((prevOpen) => !prevOpen);
  };

  if (isLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Comment
          visible={true}
          height="80"
          width="80"
          ariaLabel="comment-loading"
          wrapperClass="comment-wrapper"
          color="#fff"
          backgroundColor={primaryColor}
        />
      </div>
    );
  } else {
    return (
      <Container>
        {questions.length ? (
          <>
            <ButtonContainer>
              {isLoggedIn && (
                <Button variant="primary" onClick={handleToggleQuestionForm}>
                  Ask a Question
                </Button>
              )}
            </ButtonContainer>
            <ButtonContainer>
              <Button variant="secondary" onClick={() => handleSortOptionChange("date")}>
                <SortButtonText>
                  Sort by Date
                  {sortOption === "date" && sortDirection === "desc" && (
                    <DownArrow>
                      <BsSortDownAlt />
                    </DownArrow>
                  )}
                  {sortOption === "date" && sortDirection === "asc" && (
                    <UpArrow>
                      <BsSortUp />
                    </UpArrow>
                  )}
                </SortButtonText>
              </Button>
              <Button variant="secondary" onClick={() => handleSortOptionChange("answers")}>
                <SortButtonText>
                  Sort by Answers
                  {sortOption === "answers" && sortDirection === "desc" && (
                    <DownArrow>
                      <BsSortDownAlt />
                    </DownArrow>
                  )}
                  {sortOption === "answers" && sortDirection === "asc" && (
                    <UpArrow>
                      <BsSortUp />
                    </UpArrow>
                  )}
                </SortButtonText>
              </Button>
            </ButtonContainer>
            {sortedQuestions.map((question) => (
              <div key={question._id}>
                <QuestionCard
                  title={question.title}
                  question={question.question}
                  userNickname={question.user.nickname}
                  question_id={question._id}
                  answers={question.answers}
                  type={question.type}
                  edited={question.edited}
                  postedById={question.user._id}
                  date={question.date}
                />
              </div>
            ))}
            <StyledModal
              modalSize="medium"
              modalIsOpen={questionFormOpen}
              closeModal={handleToggleQuestionForm}
              title="Ask a Question"
            >
              <AddQuestionForm closeModal={handleToggleQuestionForm} />
            </StyledModal>
          </>
        ) : (
          <>
            <ButtonContainer>
              {isLoggedIn && (
                <Button variant="primary" onClick={handleToggleQuestionForm}>
                  Ask a Question
                </Button>
              )}
            </ButtonContainer>
            <h5>There are no questions right now..</h5>
            <StyledModal
              modalSize="medium"
              modalIsOpen={questionFormOpen}
              closeModal={handleToggleQuestionForm}
              title="Ask a Question"
            >
              <AddQuestionForm closeModal={handleToggleQuestionForm} />
            </StyledModal>
          </>
        )}
      </Container>
    );
  }
};

export default Home;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 50%;
  margin: 0 auto;
  gap: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UpArrow = styled.span`
  font-size: 1rem;
`;
const DownArrow = styled.span`
  font-size: 1rem;
`;

const SortButtonText = styled.div`
  display: flex;
  gap: 8px;
`;
