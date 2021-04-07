import React, {FC, useEffect} from "react";
import Spinner from "../Spinner/Spinner";
import {UserService} from "../../services";
import {useDispatch} from "react-redux";
import {actions} from "../../store/actions";
import {useRequest} from "../../hooks";

const AuthProvider: FC = ({children}) => {
  const {isLoading, handleRequest} = useRequest();
  const dispatch = useDispatch();

  useEffect(() => {
    handleRequest(UserService.fetch()).then(res => {
      if (!res) return; // user is not logged in
      dispatch(actions.login(res));
    });
  }, []);

  return isLoading ? <Spinner /> : <>{children}</>;
};

export default AuthProvider;
