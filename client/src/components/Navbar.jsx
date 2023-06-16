import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

const Navbar = ({ cookies, imagePath, setImages }) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [, , removeCookie] = useCookies(['Email', 'AuthToken', 'UserId']); 

  const signOut = () => {
    try {
      removeCookie('Email');
      removeCookie('AuthToken');
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear cookies: ", error);
    }
  }

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `${imagePath}${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      setImageUpload(null);
      setImages([]);
    }).catch(err => {
      console.error("Failed to upload file: ", err);
    });
  };

  return (
    <div className="navbar">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}>Upload Image</button>
      <button onClick={signOut}>SIGN OUT</button>
    </div>
  );
}

export default Navbar;
