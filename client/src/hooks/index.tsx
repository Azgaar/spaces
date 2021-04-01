import {useSelector} from "react-redux";
import {RootState} from "../types";

export const useUserData = () => {
  return useSelector((state: RootState) => state.user);
};
