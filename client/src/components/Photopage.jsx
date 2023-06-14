import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

const Photopage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const signOut = () => {
    try {
      removeCookie('Email');
      removeCookie('AuthToken');
      window.location.reload(); // Reload the page after signing out
    } catch (error) {
      console.error("Failed to clear cookies: ", error);
    }
  }

  const imagesListRef = ref(storage, "images/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div>
      <div className="list-header">
        <div className="list-button-container">
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <button onClick={uploadFile}> Upload Image</button>
          <button className="signout" onClick={signOut}>SIGN OUT</button>
          {imageUrls.map((url) => {
            return <img src={url} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Photopage;
