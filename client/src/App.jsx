import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Photopage from './components/Photopage';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['token']); // Replace 'token' with the name of your auth token cookie
  
  const authToken = cookies.token; // Replace 'token' with the name of your auth token cookie
  
  return (
    <div className="app">
      {!authToken && <Login />}
      {authToken && <Photopage />}
    </div>
  )
}

export default App;
