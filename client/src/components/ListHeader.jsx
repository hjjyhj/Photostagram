import React from 'react'
import { useCookies } from 'react-cookie'

const ListHeader = ({ listName, getData }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)

  const signOut = () => {
    try {
      removeCookie('Email');
      removeCookie('AuthToken');
      window.location.reload(); // Reload the page after signing out
    } catch (error) {
      console.error("Failed to clear cookies: ", error);
    }
  }

  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <div className="list-button-container">
        <button className="create" onClick={() => console.log('Create')}>ADD NEW</button>
        <button className="signout" onClick={signOut}>SIGN OUT</button>
      </div>
    </div>
  )
}

export default ListHeader 