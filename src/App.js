import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Auth from './user/pages/Auth'
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Signup from './user/pages/Signup';
import MiniDrawer from './shared/components/Navigation/Drawer'
import ChangePassword from './user/pages/ChangePassword'
import ZReport from './places/pages/ZReport.tsx'
import { supabase } from './shared/util/supabase';

const SignIN = async() =>{
  const { user, session, error } = await supabase.auth.signIn({
    email: 'omar.faour@mec-kin.com',
    password: "254241AABB@!"
  })
  console.log(user)
}

const App = () =>  {
  const { token, login, logout, userId, position } = useAuth();

  
  

  useEffect(() => {
    document.title = "Z-Report"
    SignIN()
  }, [])
  
  let routes;
  console.log(login);
  console.log(userId)
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Auth />
        </Route>
        <Route path="/zReport" exact>
          <ZReport/>
        </Route>
        <Route path="/changePassword" exact>
          <ChangePassword/>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Auth />
        </Route>
        <Route path="/signup" exact>
          <Signup />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth"/>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        position: position
      }}
    >
      <Router>
        {token ? <MiniDrawer /> : <></>}
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
