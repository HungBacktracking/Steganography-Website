import React from 'react';
import { UploadContainer } from '../../assets';
import classes from './UploadComponent.module.css';

function UploadComponent({ 
  readDataUploaded, 
  fileInput,
  accept }) {
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
        onChange={readDataUploaded}
        style={{ display: 'none' }}
        accept={accept  }
      />
    </div>
  );
}

export default UploadComponent;