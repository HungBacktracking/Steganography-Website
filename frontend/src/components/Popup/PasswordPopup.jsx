import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';


import classes from './Popup.module.css';

function PasswordPopup({
  onConfirm = () => {},
  onCancel = () => {},
  onClose = () => {},
  ...props
}) {
  const passwordRef = useRef(null);

  const handleSubmit = () => {
    let password = passwordRef.current.value;
    onConfirm(password);
    onClose();
  };

  const handleCancle = () => {
    onCancel();
    onClose();
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }

    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  })

  return (
    <div>
        <div className={"popup " + classes.popup_background}
          onClick={(e)=>{
            if(e.target.classList.contains(classes.popup_background)){
              onClose();
            }
          }}>
          
          <div className={"popup-container " + classes.popup_container}>
            {/* <div className={"popup-title " + classes.popup_title}>
              <h1>Password Popup</h1>
              <button className="p-4" onClick={onClose}>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div> */}

            <div className={classes.popup_content + " " }>
              <h2>Type your password</h2>
              <input
                ref={passwordRef}
                type="password"
                placeholder="Password to Encrypt (Optional)"
                autoFocus={true}
                />

              <div className='ms-auto flex justify-end'>
                <button className={classes.cancel} onClick={handleCancle}>Cancel</button>
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default PasswordPopup;