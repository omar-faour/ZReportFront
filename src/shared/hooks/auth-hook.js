import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [position, setPosition] = useState(false);
  const [vacation, setVacation] = useState(false);
  const [zone, setZone] = useState(false);


  const login = useCallback((uid, token, position, zone, expirationDate) => {

    console.log("Testing Position" + position)
    console.log("POSITION2: " + position)
    setToken(token);
    setUserId(uid);
    setPosition(position);
    setZone(zone);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 3000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        position: position,
        vacation: vacation,
        zone: zone,
        expiration: tokenExpirationDate.toISOString(),  
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setPosition(null)
    setVacation(null);
    setZone(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      console.log(tokenExpirationDate)
     // const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
   //   logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    console.log(storedData)
    if (
      storedData &&
      storedData.token &&
      storedData.position &&
      storedData.vacation &&
      storedData.zone &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, storedData.position, storedData.vacation, storedData.zone, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId, position, vacation, zone };
};