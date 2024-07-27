import React, { useState } from 'react';
import classes from './Popup.module.css';

const EncodedPopup = ({ dataInput, dataEncoded, type}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  if (!dataEncoded) {
    return null;
  }

  return (
    <div>
      <button onClick={toggleVisibility} className={classes.showButton}>Show Encoded {type}</button>
      {isVisible && (
        <div className={classes.modal}>
          <div className={classes.modalContent}>
            <span className={classes.closeButton} onClick={toggleVisibility}>&times;</span>
            <div className={classes.dataContainer}>
              <div className={classes.dataBlock}>
              <h3>Input Data</h3>
                {type === 'image' && <img src={dataInput} alt="Input" className={classes.modalImage} />}
                {type === 'audio' && <audio controls src={dataInput} className={classes.audio} />}
                {type === 'video' && <video controls src={dataInput} className={classes.video} />}
              </div>

              <div className={classes.dataBlock}>
                <h3>Encoded Data</h3>
                {type === 'image' && <img src={dataEncoded} alt="Encoded" className={classes.modalImage} />}
                {type === 'audio' && <audio controls src={dataEncoded} className={classes.audio} />}
                {type === 'video' && <video controls src={dataEncoded} className={classes.video} />}
              </div>
            </div>
          </div>
        </div>            
      )}
    </div>
  );
};

export default EncodedPopup;