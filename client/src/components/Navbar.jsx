import React, { useState, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

const Navbar = ({ cookies, imagePath, setImages }) => {
    const [, , removeCookie] = useCookies(['Email', 'AuthToken', 'UserId']); 
    const [currentEmail,] = useCookies(['Email']); 
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [users, setUsers] = useState([]);

    // Fetch users when component mounts
    useEffect(() => {
      fetch(`${process.env.REACT_APP_SERVERURL}/person`)
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(err => console.error(err));
    }, []);

    const signOut = () => {
      try {
        removeCookie('Email');
        removeCookie('AuthToken');
        window.location.reload();
      } catch (error) {
        console.error("Failed to clear cookies: ", error);
      }
    }
  
    const uploadFile = (file) => {
      if (file == null) return;
      const imageRef = ref(storage, `${imagePath}${file.name + v4()}`);
      uploadBytes(imageRef, file).then(() => {
        setImages([]);
      }).catch(err => {
        console.error("Failed to upload file: ", err);
      });
    };

    const uploadProfilePic = (file) => {
			if (file == null) return;
			const imageRef = ref(storage, `profile/${cookies.Email}/profile_pic`);
			uploadBytes(imageRef, file).then(() => {
				setImages([]); // you may want to handle this differently since it's a separate action
			}).catch(err => {
				console.error("Failed to upload file: ", err);
			});
		};
		
    return (
      <div className="navbar">
        <div className="navbar-brand">
          <span className="navbar-text">Photostagram</span>
        </div>
        <input
					type="file"
					id="profile-pic-input"
					className="file-input"
					onChange={(event) => {
						uploadProfilePic(event.target.files[0]);
					}}
				/>
					<button onClick={() => document.getElementById("profile-pic-input").click()}>
						Profile Image
        	</button>
        <input
          type="file"
          id="file-input" // Assign an id to the file input
          className="file-input" // Add the hidden styling
          onChange={(event) => {
            uploadFile(event.target.files[0]);
          }}
        />
        <button onClick={() => document.getElementById("file-input").click()}>
          Upload Image
        </button>
        <button onClick={() => setIsSearchVisible(true)}>Search Users</button>
        <div className={`search-bar ${isSearchVisible ? 'open' : ''}`}>
          <button className="close-search" onClick={() => setIsSearchVisible(false)}>Close</button>
          <div className="search-results"> {/* New div for wrapping user buttons */}
            {users.filter(user => user.email !== currentEmail.Email).map((user, index) => (
              <button key={index} className="user-button">{user.email}</button>
            ))}
          </div>
        </div>
        <button onClick={signOut}>SIGN OUT</button>
      </div>
    );
  }

export default Navbar;
