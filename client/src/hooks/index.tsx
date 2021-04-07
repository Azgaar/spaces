import {useState} from "react";
import {useSelector} from "react-redux";
import {AxiosPromise} from "axios";
import {RootState, UserRole} from "../types";

type UserData = {
  user: RootState["user"];
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export const useUser = (): UserData => {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = user.isAuthenticated;
  const isAdmin = user.role === UserRole.ADMIN;
  return {user, isAuthenticated, isAdmin};
};

type RequestState = {
  isLoading: boolean;
  error: string;
};

export const useRequest = () => {
  const initialState: RequestState = {isLoading: false, error: ""};
  const [requestState, setRequestState] = useState<RequestState>(initialState);
  const resetRequest = (): void => setRequestState(() => initialState);

  const handleRequest = async (request: AxiosPromise) => {
    try {
      const {data} = await request;
      setRequestState(() => ({isLoading: false, error: ""}));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setRequestState(() => ({isLoading: false, error: message}));
      throw error;
    }
  };

  return {...requestState, handleRequest, resetRequest};
};
