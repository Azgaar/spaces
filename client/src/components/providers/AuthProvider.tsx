import React, {FC, useEffect, useState} from 'react';
import Spinner from '../Spinner/Spinner';
import {UserService} from '../../services';
import {useDispatch} from 'react-redux';
import {actions} from '../../store/actions';
import {useToasterCatcher} from '../../hooks';
import {UserData} from '../../types';

const AuthProvider: FC = ({children}) => {
  const [isLoading, setLoading] = useState(true);
  const {catchAndTossError} = useToasterCatcher();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      const user: UserData = await catchAndTossError(UserService.fetch());
      if (!user) {return;} // user is not logged in
      dispatch(actions.login(user));
    }
    fetchUser().then(() => setLoading(false));
  }, []);

  return isLoading ? <Spinner /> : <>{children}</>;
};

export default AuthProvider;
