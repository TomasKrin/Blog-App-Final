import { PropsWithChildren, createContext } from "react";

import { LOGIN_PATH } from "../routes/consts";
import { User } from "../types/userTypes";
import { toast } from "react-hot-toast";
import { useLocalStorage } from "../hooks/localStorage";
import { useNavigate } from "react-router-dom";

const UserContext = createContext<{
  user: User | null;
  isLoggedIn: boolean;
  userId: string | undefined;
  userNickname: string | undefined;
  setUser: (user: User) => void;
  handleLogIn: (user: User) => void;
  handleLogOut: () => void;
}>({
  user: null,
  userId: "",
  userNickname: "",
  isLoggedIn: false,
  setUser: () => {},
  handleLogIn: () => {},
  handleLogOut: () => {},
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const handleLogIn = (user: User) => {
    setUser(user);
    toast.success("Successfully logged in!");
  };

  const userId = user?._id;
  const userNickname = user?.nickname;

  const handleLogOut = () => {
    setUser(null);
    toast.success("Successfully logged out!");
    navigate(LOGIN_PATH);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoggedIn, handleLogIn, handleLogOut, userId, userNickname }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserProvider };
