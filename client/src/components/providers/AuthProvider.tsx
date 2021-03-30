import React, {FC, useEffect, useState} from "react";
import Spinner from "../Spinner/Spinner";
import {fetchData} from "../../services";
import {useDispatch} from "react-redux";
import {actions} from "../../store/actions";

const AuthProvider: FC = ({children}) => {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData().then(res => {
        console.log(res);
        if (!res.email) return;
        const {email, firstName, lastName, role = "user"} = res;
        dispatch(actions.login({email, firstName, lastName, role}));
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return isLoading ? <Spinner /> : <>{children}</>;
};

export default AuthProvider;
