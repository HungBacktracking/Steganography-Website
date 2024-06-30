import React from 'react';
import { UploadContainer } from '../../assets';
import classes from './UploadComponent.module.css';

function UploadComponent({ handleFileSelection, fileInput }) {
  return (
    <div className={classes.upload_container} onClick={() => fileInput.current && fileInput.current.click()}>
      <div className={classes.uploadPrompt}>
        <img src={UploadContainer} alt="Upload" />
        <p>Choose a file or drag & drop it here</p>
        <button className={classes.browseButton}>Browse File</button>
      </div>
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileSelection}
        style={{ display: 'none' }}
        accept="image/*" // Accept only images
      />
    </div>
  );
}

export default UploadComponent;