import {useSelector} from "react-redux";
import {RootState, UserRole} from "../types";

export const useUserData = (): RootState["user"] => {
  return useSelector((state: RootState) => state.user);
};

export const useAdmin = (): boolean => {
  const isAdmin = useSelector((state: RootState) => state.user.role === UserRole.ADMIN);
  return isAdmin;
};
