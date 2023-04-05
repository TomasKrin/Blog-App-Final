import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { useAddDislikedPost, useAddLikedPost, useUser } from "../../hooks/user";

import { UserContext } from "../../contexts/UserContext";
import { primaryColor } from "../../consts/styles";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useContext } from "react";

type Props = {
  user_id: string;
  post_id: string;
  type: string;
};

const ReactionButtons = ({ user_id, post_id, type }: Props) => {
  const { user } = useContext(UserContext);
  const { mutateAsync: addLikedPost } = useAddLikedPost(user_id, post_id);
  const { mutateAsync: addDislikedPost } = useAddDislikedPost(user_id, post_id);

  const liked = user && user?.liked_posts.some((post) => post.postId === post_id);
  const disLiked = user && user?.disliked_posts.some((post) => post.postId === post_id);

  const userId = user ? user._id : "";
  const { refetch } = useUser(userId);

  const handleLike = async () => {
    try {
      await addLikedPost({ postType: type });
      refetch();
    } catch (error) {
      toast.error("Something wend wrong..");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await addDislikedPost({ postType: type });
      refetch();
    } catch (error) {
      toast.error("Something wend wrong..");
      console.error(error);
    }
  };

  return (
    <Container>
      <LikeButton isLiked={liked} onClick={handleLike}>
        <AiFillLike />
      </LikeButton>
      <DislikeButton isDisliked={disLiked} onClick={handleDelete}>
        <AiFillDislike />
      </DislikeButton>
    </Container>
  );
};

export default ReactionButtons;

const Container = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 1.2rem;
`;

const LikeButton = styled.div`
  cursor: pointer;
  color: ${({ isLiked }: { isLiked: boolean | null }) => (isLiked ? `${primaryColor}` : "inherit")};
  &:hover {
    color: ${primaryColor};
  }
`;
const DislikeButton = styled.div`
  cursor: pointer;
  color: ${({ isDisliked }: { isDisliked: boolean | null }) => (isDisliked ? `red` : "inherit")};
  &:hover {
    color: red;
  }
`;
