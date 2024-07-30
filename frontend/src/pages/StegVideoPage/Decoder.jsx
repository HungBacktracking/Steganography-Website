import classes from './StegVideoPage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import VideoData from './VideoData';

import { UploadComponent } from '../../components/UploadComponent';

import { PasswordPopup, Spinner } from '../../components/Popup';
import { VideoServices } from '../../services';

const PASSWORD_POPUP = 'passwordPopup';

const decode = async (videoDatabase64, password) => {
  console.log()
  if (!videoDatabase64) {
    toast.error("Please upload an video first.");
    return;
  }

//   let data = await ImageServices.decodeMessage(imageData.base64encode);
  let data = null; 
  data = await VideoServices.decodeMessage(audioBase64Data);
  if (data) {
    return data.message;
  }
  else {
    toast.error("Failed to decode the message. Please try again.");
  }
}

const Decoder = ({ setActiveTab }) => {
  const [videoData, setVideoData] = useState(new VideoData({}));
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

  const handleDecode = async (videoDatabase64, password = "") => {
    setIsDecoding(true);
    try{
      let cipherText = await decode(videoDatabase64);
      console.log("cipherText: ", cipherText);
      console.log("password: ", password);
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
    element.download = "message.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const DecoderLeftComponent = ({
    videoData,
    setVideoData
  }) => {
    const fileInput = useRef(null);
  
    const readVideoData = (e) => {
      const file = e.target.files[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64encode = e.target.result;
          const video = new VideoData({
            base64encode,
            name: file.name,
            size: (file.size / (1024 ** 3)).toFixed(2) + " GB",
            format: file.type,
          });
          setVideoData(video);
        };
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
        <div className={`${classes.video_container}`}>
          { 
            videoData.base64encode ? ( 
              <video className={classes.video} controls>
                <source src={videoData.base64encode} type={videoData.format} />
              </video>
              ) : (
              <UploadComponent readDataUploaded={readVideoData} fileInput={fileInput} fileAccepted={"video/*"} />
            )
          }
        </div>

        {/* Resolution */}
        {/* <TwoSideTextBox 
          titleComponent={<div className="basis-1/3" >Resolution</div>}
          content={imageData.resolution}
        /> */}

        {/* Format */}
        <TwoSideTextBox
          titleComponent={<div className="basis-1/3" >Format</div>}
          content={videoData.format}
        />

        {/* Size */}
        <TwoSideTextBox
          titleComponent={<div className="basis-1/3" >Size</div>}
          content={videoData.size}
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
            onClick={() => { setVideoData(new VideoData({})); setMessage(""); }}
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
        videoData={videoData}
        setVideoData={setVideoData} 
        />
        <DecoderRightComponent 
          message={message}/>
      </div>

      <div>
        {
          isOpen(PASSWORD_POPUP) && (
            <PasswordPopup
              onConfirm={(password) => {
                handleDecode(videoData.base64encode, password);
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