import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Photopage from './components/Photopage';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['AuthToken']); 
  
  const authToken = cookies.AuthToken; 
  
  return (
    <div className="app">
      {!authToken && <Login />}
      {authToken && <Photopage />}
    </div>
  )
}


export default App;
