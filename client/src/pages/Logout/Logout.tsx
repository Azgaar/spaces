import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Redirect} from "react-router-dom";
import {logout} from "../../services";
import {actions} from "../../store/actions";
import {MessageType, useMessage} from "../../components/providers/MessageProvider";

function Logout() {
  const dispatch = useDispatch();
  const {pushMessage} = useMessage();

  useEffect(() => {
    logout().then(res => {
      if (!res.ok) {
        pushMessage({title: res.message, type: MessageType.ERROR});
        return;
      }
      dispatch(actions.logout());
    });
  });

  return <Redirect to="/signin" />;
}

export default Logout;
