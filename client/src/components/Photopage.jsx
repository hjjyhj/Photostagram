import React, { useEffect, useState } from 'react'
import ListHeader from './ListHeader';

const Photopage = () => {
  const [photos, setPhotos] = useState([]);

  const getData = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/api/photos`);
    const data = await response.json();
    setPhotos(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <ListHeader listname='Photo List' getData={getData} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {photos.map((photoUrl, index) => (
          <img key={index} src={photoUrl} alt={`Photo ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
        ))}
      </div>
    </div>
  )
}

export default Photopage
