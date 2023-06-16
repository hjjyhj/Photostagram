import React from 'react';
import Login from './components/Login';
import Photopage from './components/Photopage';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['AuthToken', 'Email', 'UserId']); 

  const authToken = cookies.AuthToken; 

  return (
    <div className="app">
      {!authToken && <Login cookies={cookies} />} {/* pass cookies as a prop to Login */}
      {authToken && <Photopage cookies={cookies} />} {/* pass cookies as a prop to Photopage */}
    </div>
  );
}

export default App;
