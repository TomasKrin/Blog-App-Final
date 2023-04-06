import { addDislikedPost, addLikedPost, getUser, loginUser, registerUser } from "../api/user";
import { useMutation, useQuery } from "@tanstack/react-query";

const USER = "USER";
const USER_REACTIONS = "USER_REACTIONS";

export const useCreateUser = () => {
  return useMutation(registerUser);
};

export const useLoginUser = () => {
  return useMutation(loginUser);
};

export const useUser = (user_id: string) => {
  return useQuery([USER], () => getUser(user_id), {
    staleTime: 500,
    refetchOnWindowFocus: true,
  });
};

export const useAddLikedPost = (user_id: string, post_id: string) => {
  return useMutation([USER_REACTIONS], ({ postType }: { postType: string }) =>
    addLikedPost(user_id, post_id, postType)
  );
};

export const useAddDislikedPost = (user_id: string, post_id: string) => {
  return useMutation([USER_REACTIONS], ({ postType }: { postType: string }) =>
    addDislikedPost(user_id, post_id, postType)
  );
};
