import React, { useRef } from 'react'
import { useCookies } from 'react-cookie'

const ListHeader = ({ listName, getData }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/api/photos/upload`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // Refresh the photo list after a new photo is uploaded
      getData();
    }
  }

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
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
        <button className="create" onClick={() => fileInputRef.current.click()}>ADD NEW</button>
        <button className="signout" onClick={signOut}>SIGN OUT</button>
      </div>
    </div>
  )
}

export default ListHeader 
