import classes from './StegImagePage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ImageData from './ImageData';

import { ImageServices } from '../../services';
import { TextDataEncode } from '../../entities';
import { UploadComponent } from '../../components/UploadComponent';

import { PasswordPopup, Spinner } from '../../components/Popup';

const PASSWORD_POPUP = 'passwordPopup';

const decode = async (imageData, password) => {
  if (!imageData.base64encode) {
    toast.error("Please upload an image first.");
    return;
  }

  let data = await ImageServices.decodeMessage(imageData.base64encode);
  if (data) {
    return data.message;
  }
  else {
    toast.error("Failed to decode the message. Please try again.");
  }
}

const Decoder = ({ setActiveTab }) => {
  const [imageData, setImageData] = useState(new ImageData({}));
  const [message, setMessage] = useState();

  const [isDecoding, setIsDecoding] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = (popupName) => {
    setShowPopup((prevState) => ({
      ...prevState,
      [popupName]: !prevState[popupName]
    }));
  };
  const isOpen = (popupName) => showPopup[popupName] || false;

  const handleDecode = async (imageData, password = "") => {
    setIsDecoding(true);
    try{
      let cipherText = await decode(imageData);
      // console.log("cipherText: ", cipherText);
      // console.log("password: ", password);
      let textData = TextDataEncode.fromCipherText(cipherText, password);
      let message = textData.decrypt();
      
      if(!message){
        toast.error("Decode failed. Try another password.");
        setMessage("");
        return;
      }
      // console.log({message});
      setMessage(message);
    }
    catch(e){
      // console.log(e);
      toast.error("Failed to decode the message. Please try again.");
    }
    finally{
      setIsDecoding(false);
    }
  }

  const handleDownloadMessage = (message) => {
    if (!message) {
      toast.error("No message to download.");
      return;
    }
    // Download the message as a text file
    const element = document.createElement("a");
    const file = new Blob([message], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "message_image.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const DecoderLeftComponent = ({
    imageData,
    setImageData
  }) => {
    const fileInput = useRef(null);
  
    const handleImageContainerClick = () => {
      fileInput.current.click();
    }
  
    const readImageData = (e) => {
      const file = e.target.files[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const imageData = new ImageData({
              name: file.name,
              base64encode: e.target.result,
              resolution: `${img.width} x ${img.height}`,
              format: file.type,
              size: file.size
            });
            setImageData(imageData);
          };
  
          img.src = e.target.result;
        };
        reader.onerror = (e) => {
          toast.error("Failed to upload file. Please try again.");
        }
  
        reader.readAsDataURL(file);
      }
      else {
        toast.error("Failed to upload file. Please try again.");
        return;
      }
    };
  
  
    return (
      <div className={classes.left}>
        {/* Image Container */}
        { 
          imageData.base64encode ? ( <img className={classes.image} src={imageData.base64encode} alt="Uploaded" /> ) : (
            <UploadComponent readDataUploaded={readImageData} fileInput={fileInput} />
          )
        }

        {/* Resolution */}
        <TwoSideTextBox 
          titleComponent={<div className="basis-1/3" >Resolution</div>}
          content={imageData.resolution}
        />

        {/* Format */}
        <TwoSideTextBox
          titleComponent={<div className="basis-1/3" >Format</div>}
          content={imageData.format}
        />

        {/* Size */}
        <TwoSideTextBox
          titleComponent={<div className="basis-1/3" >Size</div>}
          content={imageData.size}
        />
          
        <div className={classes.action}>
          {/* Decode button */}
          <div className={`${classes.button_action_1} ${classes.success_}`}
            onClick={() => togglePopup(PASSWORD_POPUP)}
          >
            Decode
          </div>
          
          {/* Delete button */}
          <div className={`${classes.button_action_1} ${classes.destroy_}`} 
            onClick={() => { setImageData(new ImageData({})); setMessage(""); }}
          >
            Delete
          </div>
        </div>
      </div>
    )
  }
  
  const DecoderRightComponent = ({
    message
  }) => { 
    const messageSizeBytes = message ? new Blob([message]).size.toString() + " B" : 0;
    const wordCount = message ? message.split(/\s+/).length : 0;
    
    return (
      <div className={classes.right}>
        <div className={classes.header_notepad}>
          <div className={classes.small_title}>Extracted text</div>
          <div className={`${classes.action_list} ms-auto`}>
              <div className={classes.button_action_2} onClick={() => handleDownloadMessage(message)}>Save</div>
              <div className={classes.button_action_2} onClick={() => handleDownloadMessage(message)}>Save as</div>
          </div>
        </div>
        <div className={classes.notepad}>
          {message}
        </div>

        <div className={classes.info_list + " mt-auto"} >
          {/* Text size */}
          <TwoSideTextBox 
            title = "Text size"
            content={messageSizeBytes}
            className={"flex-[70%] p-[0.7vw]"}
          />

          {/* Word count */}
          <TwoSideTextBox
            title = "Word count"
            content = {wordCount}
            className={"flex-[70%] p-[0.7vw]"}
          />
        </div>
      </div>
    )
  }
  return (
    <div className={classes.steg_container}>
      <div className={classes.list_title}>
        <div className={classes.title} onClick={() => setActiveTab('encode')}>Encode</div>
        <div className={ `${classes.title_active} ${classes.title}`}>Decode</div>
      </div>
      
      <div className={classes.steg_wrapper}>
        <DecoderLeftComponent
        imageData={imageData}
        setImageData={setImageData} 
        />
        <DecoderRightComponent 
          message={message}/>
      </div>

      <div>
        {
          isOpen(PASSWORD_POPUP) && (
            <PasswordPopup
              onConfirm={(password) => {
                handleDecode(imageData, password);
              }
              }
              onCancel={() => {
                toast.warning("Encode canceled");
              }}
              onClose={() => togglePopup(PASSWORD_POPUP)}
            />
          )
        }

        {
          isDecoding && <Spinner />
        }
      </div>
    </div> 
  )
}

export default Decoder;