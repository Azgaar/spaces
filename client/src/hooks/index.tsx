import {useSelector} from "react-redux";
import {RootState} from "../types";

export const useAuth = (): {isAuthenticated: boolean} => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  return {isAuthenticated};
};

export const useUserData = () => {
  return useSelector((state: RootState) => state.user);
};
