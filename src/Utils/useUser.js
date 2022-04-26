import React from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../redux/reducers/auth/authSlice';

function useUser() {
  const dispatch = useDispatch();
  const user = useSelector(state=>state.auth);
  if(user.isLoggedIn)
    return {...user, logout: ()=>dispatch(logout())};;
  return {};
}

export default useUser