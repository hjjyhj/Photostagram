import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import Navbar from './Navbar';
import deleteIcon from './deletebutton.svg'; // add this line

const Photopage = ({ cookies }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const imagesListRef = ref(storage, `${cookies.Email}/`);

  const getImages = () => {
    listAll(imagesListRef).then((response) => {
      const promises = response.items.map(async item => {
        const url = await getDownloadURL(item).catch(err => {
          console.error("Failed to get download URL: ", err);
        });
        return { url, ref: item };
      });
      Promise.all(promises).then((images) => {
        setImages(images.reverse())
      }).catch(err => {
        console.error("Failed to get images: ", err);
      });
    });
  }

  const deleteImage = (image) => {
    deleteObject(image.ref).then(() => {
      getImages();
    }).catch((error) => {
      console.error("Failed to delete image: ", error);
    });
  }

  useEffect(() => {
    getImages();
  }, []);

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className='photo-page'>
      <Navbar cookies={cookies} imagePath={`${cookies.Email}/`} setImages={setImages} />
      <div className="list-header">
        <div className="image-container">
          {images.map((image, index) => {
            return (
              <div className="image-card" key={index}>
                <img src={image.url} onClick={() => setSelectedImage(image.url)} alt="Not found" />
                <button className="delete-button" onClick={() => deleteImage(image)} />
              </div>
            );
          })}
        </div>
        {selectedImage && (
          <div className="modal" onClick={closeModal}>
            <img src={selectedImage} className="selected-image" alt="Not found" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Photopage;
