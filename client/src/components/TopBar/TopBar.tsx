import { HOME_PATH, LOGIN_PATH, REGISTER_PATH } from "../../routes/consts";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { RiLogoutCircleRLine } from "react-icons/ri";
import { UserContext } from "../../contexts/UserContext";
import { primaryColor } from "../../consts/styles";
import styled from "styled-components";

const TopBar = () => {
  const [infoScreenVisible, setInfoScreenVisible] = useState(false);
  const navigate = useNavigate();
  const { user, handleLogOut, isLoggedIn } = useContext(UserContext);

  const handleInfoScreenVisibility = () => {
    setInfoScreenVisible((prev) => !prev);
  };

  return (
    <Container>
      <span onClick={() => navigate(HOME_PATH)}>QuestiMania</span>
      <div>
        {user && isLoggedIn ? (
          <UserLoggedInContainer>
            <UserNickname onClick={handleInfoScreenVisibility}>{user.nickname}</UserNickname>
            <UserInfoScreen isVisible={infoScreenVisible}>
              <h5>Hello {user.name}..</h5>
              <p>Total questions: {user.questions.length}</p>
              <p>Total answers: {user.answers.length}</p>
              <p>Liked posts: {user.liked_posts.length}</p>
              <p>Disliked posts: {user.disliked_posts.length}</p>
            </UserInfoScreen>
            <LogOutButtonContainer onClick={handleLogOut}>
              <RiLogoutCircleRLine />
            </LogOutButtonContainer>
          </UserLoggedInContainer>
        ) : (
          <LinksContainer>
            <Link to={LOGIN_PATH}>Login</Link>
            <Link to={REGISTER_PATH}>Register</Link>
          </LinksContainer>
        )}
      </div>
    </Container>
  );
};

export default TopBar;

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: ${primaryColor};
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
  color: white;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  span {
    cursor: pointer;
    font-weight: 700;
    font-size: 16px;
  }
`;

const LogOutButtonContainer = styled.div`
  font-size: 1.5em;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 2;
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 16px;
  a {
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const UserLoggedInContainer = styled.div`
  display: flex;
  gap: 80px;
  align-items: center;
  position: relative;
`;

const UserNickname = styled.div`
  cursor: pointer;
  z-index: 1;
`;

const UserInfoScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: snow;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
  color: black;
  width: 150px;
  height: 200px;
  font-size: 0.8rem;
  gap: 4px;
  transition: 0.7s ease-in-out;
  position: absolute;
  right: 55px;
  z-index: 0;
  transform: translateY(62.5%);
  opacity: ${({ isVisible }: { isVisible: boolean }) => (isVisible ? 1 : 0)};
`;
