import {useSelector} from "react-redux";
import {RootState, UserRole} from "../types";

type UserDataHook = {
  user: RootState["user"];
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useUser = (): UserDataHook => {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = user.isAuthenticated;
  const isAdmin = user.role === UserRole.ADMIN;
  return {user, isAuthenticated, isAdmin};
};
