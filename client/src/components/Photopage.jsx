<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import ListHeader from './ListHeader';
import { useCookies } from 'react-cookie';
=======
import React from 'react'
>>>>>>> parent of 834d49d (sign in/ registration working)

const Photopage = () => {
  const [cookies] = useCookies(['AuthToken']);
  const [photos, setPhotos] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/api/photos/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cookies.AuthToken}`,
        }
      });
  
      if (!response.ok) { // if HTTP-status is 200-299
        // get the error message from the server's response
        throw new Error(response.statusText);
      }
  
      const data = await response.json();
      console.log(data);
      setPhotos(data);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  
  

  useEffect(() => {
    getData();
  }, []);

  return (
<<<<<<< HEAD
    <div>
      <ListHeader listName='Photo List' getData={getData} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
      {photos.map((photoUrl, index) => (
        <img key={index} src={photoUrl} alt={`Uploaded image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
      ))}
      </div>
    </div>
=======
    <div>Photopage</div>
>>>>>>> parent of 834d49d (sign in/ registration working)
  )
}

export default Photopage