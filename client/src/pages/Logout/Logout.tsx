import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Redirect} from "react-router-dom";
import {logout} from "../../services";
import {actions} from "../../store/actions";

function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    logout().then(res => {
      // TODO: set isLoading and show error if any
      if (!res.ok) return;
      dispatch(actions.logout());
    });
  });

  return <Redirect to="/signin" />;
}

export default Logout;
