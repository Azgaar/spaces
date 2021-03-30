import React, {FC, useEffect, useState} from "react";
import Spinner from "../Spinner/Spinner";
import {fetchUserData} from "../../services";
import {useDispatch} from "react-redux";
import {actions} from "../../store/actions";

const AuthProvider: FC = ({children}) => {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserData().then(res => {
        if (!res.email) return; // user is not logged in
        const {email, firstName, lastName, role} = res;
        dispatch(actions.login({email, firstName, lastName, role}));
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return isLoading ? <Spinner /> : <>{children}</>;
};

export default AuthProvider;
