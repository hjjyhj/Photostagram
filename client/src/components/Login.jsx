import React, {useState} from 'react';
import { useCookies } from 'react-cookie';

const Login = () => {
  const [cookies, setCookie] = useCookies(['Email', 'AuthToken']);
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogIn && password !== confirmPassword) {
      setError('Password does not match');
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.detail) {
      setError(data.detail)
    } else {
      setCookie('Email', data.email);
      setCookie('AuthToken', data.token);
      setCookie('UserId', data.id); // Save the user_id in a cookie
      window.location.reload();
    }
  }

  const lButtonStyle = {
    backgroundColor: isLogIn ? 'white' : 'gray',
  }

  const rButtonStyle = {
    backgroundColor: isLogIn ? 'gray' : 'white',
  }

  return (
    <div className='loginpage'>
      <p className="photostagram">PhotoStagram</p>
      <div className = "inputs">
        <input 
          className='email'
          required
          maxLength={30}
          placeholder="EMAIL"
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          className='password'
          required
          maxLength={30}
          placeholder="PASSWORD"
          onChange={e => setPassword(e.target.value)}
        />
        {isLogIn &&
          <button 
            className='login-button'
            onClick={(e) => handleSubmit(e, 'login')}
          >
            Login
          </button>
        }
        {!isLogIn && 
          <div className='confirm'>
            <input 
              className='confirm-password'
              required
              maxLength={30}
              placeholder="CONFIRM PASSWORD"
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button
              className='register-button'
              onClick={(e) => handleSubmit(e, 'signup')}
            >
              Register
            </button>
          </div>
        }
      </div>
      <div>
        <div className="button-container">
          <button 
            style={rButtonStyle}
            onClick={() => {
              setIsLogIn(false);
            }}
          >REGISTER</button>
          <button 
            style={lButtonStyle}
            onClick={() => {
              setIsLogIn(true);
            }}
          >SIGN IN</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
