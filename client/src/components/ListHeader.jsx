import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useHistory } from "react-router-dom";

const ListHeader = ({ listName, getData }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const history = useHistory();

  const signOut = () => {
    try {
      removeCookie('Email');
      removeCookie('AuthToken');
      history.push('/login');
    } catch (error) {
      console.error("Failed to clear cookies: ", error);
    }
  }

  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <div className="button-container">
        <button className="create" onClick={() => console.log('Create')}>ADD NEW</button>
        <button className="signout" onClick={signOut}>SIGN OUT</button>
      </div>
    </div>
  )
}

export default ListHeader 
