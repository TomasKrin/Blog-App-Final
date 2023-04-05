import { useContext, useEffect } from "react";

import { UserContext } from "../contexts/UserContext";
import { useUser } from "./user";

export const useAutoUpdateUser = () => {
  const { user, userId, setUser } = useContext(UserContext);

  if (userId && user) {
    const { data: updateData } = useUser(userId);
    useEffect(() => {
      const updatedUser = updateData || [];
      if (user !== updatedUser[0] && updatedUser[0]) {
        setUser(updatedUser[0]);
      }
    }, [updateData, user]);
  }
};
