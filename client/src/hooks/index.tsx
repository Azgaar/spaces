import {useState} from "react";
import {useSelector} from "react-redux";
import {AxiosPromise} from "axios";
import {RootState, UserRole} from "../types";
import {MessageType, useMessage} from "../components/providers/MessageProvider";

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

export const useRequest = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const {pushMessage} = useMessage();

  const handleRequest = async (request: AxiosPromise) => {
    try {
      const {data} = await request;
      return data;
    } catch (err) {
      pushMessage({title: err.response?.data?.message || err.message, type: MessageType.ERROR});
    } finally {
      setLoading(() => false);
    }
  };

  return {isLoading, setLoading, handleRequest};
};
