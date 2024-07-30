import classes from './StegAudioPage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { useRef, useState } from 'react';
import UploadComponent from '../../components/UploadComponent/UploadComponent';

import { PasswordPopup, Spinner } from '../../components/Popup';
import { AudioService } from '../../services';
import { TextDataEncode } from '../../entities';
import AudioVisualizer from '../../components/Visualizer/AudioVisualizer';
import { toast } from 'react-toastify';


const PASSWORD_POPUP = 'passwordPopup';

const decode = async (audioBase64Data, password) => {
  if (!audioBase64Data) {
    toast.error("Please upload an audio first.");
    return;
  }

  let data = await AudioService.decodeMessage(audioBase64Data);
  if (data) {
    return data.message;
  }
  else {
    toast.error("Failed to decode the message. Please try again.");
  }
}

const Decoder = ({ setActiveTab }) => {
  const [data, setData] = useState();
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

  const handleDecode = async (data, password = "") => {
    setIsDecoding(true);
    try{
      let cipherText = await decode(data);
      let textData = TextDataEncode.fromCipherText(cipherText, password);
      let message = textData.decrypt();
      
      if(!message){
        toast.error("Decode failed. Try another password.");
        setMessage("");
        return;
      }
      console.log({message});
      setMessage(message);
    }
    catch(e){
      console.log(e);
      toast.error("Failed to decode the message. Please try again.");
    }
    finally{
      setIsDecoding(false);
    }
  }

  return (
      <div className={classes.steg_container}>
          <div className={classes.list_title}>
            <div className={classes.title} onClick={() => setActiveTab('encode')}>Encode</div>
            <div className={ `${classes.title_active} ${classes.title}`}>Decode</div>
          </div>
        
          <div className={classes.steg_wrapper}>
            <DecoderLeftComponent 
              data={data}
              setData={setData}
              togglePopup={togglePopup}
            />
              <DecoderRightComponent 
                message={message}
              />
          </div>

          {
          isOpen(PASSWORD_POPUP) && (
            <PasswordPopup
              onConfirm={(password) => {
                handleDecode(data, password);
              }
              }
              onCancel={() => {
                toast.warning("Decode canceled");
              }}
              onClose={() => togglePopup(PASSWORD_POPUP)}
            />
          )
        }

        {
          isDecoding && <Spinner />
        }
      </div> 
  )
}

const DecoderLeftComponent = ({
  data, 
  setData,
  togglePopup
}) => {
  const fileInput = useRef(null);
  const [audio, setAudio] = useState(null);
  const [audioSize, setAudioSize] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioTime, setAudioTime] = useState(0);
  const audioFormat = "WAV";

  const handleAudioContainerClick = () => {
    if(fileInput.current) fileInput.current.click();
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      
      const fileExtension = fileName.split('.').pop().toLowerCase();
      if (fileExtension !== 'wav') {
        alert('Only WAV files are allowed.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setAudio(reader.result);
        setData(reader.result);
        setAudioSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
        setAudioBlob(file);

        // Get audio duration
        const audio = new Audio(reader.result);
        audio.onloadedmetadata = () => {
          setAudioTime(audio.duration);
        };
      }
      reader.readAsDataURL(file);
    } else {
      alert('No file selected!');
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = Math.floor(seconds % 60);
  
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = secondsLeft.toString().padStart(2, '0');
  
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  return (
      <div className={classes.left}>
        <div className={classes.audio_container} onClick={handleAudioContainerClick}>
          {audio ? (
            <AudioVisualizer  blob={audioBlob} />
          ) : (
            <UploadComponent 
              readDataUploaded={handleFileSelection}
              accept=".wav"
              fileInput={fileInput}
            />
          )}
        </div>

          {/* <div className={classes.info}>Duration</div> */}
          <TwoSideTextBox 
            titleComponent={<div className="basis-1/3" >Duration</div>}
            content={formatDuration(audioTime)}
          />

          {/* <div className={classes.info}>Format</div> */}
          <TwoSideTextBox
            titleComponent={<div className="basis-1/3" >Format</div>}
            content={audioFormat}
          />

           {/* <div className={classes.info}>Size</div> */}
           <TwoSideTextBox
            titleComponent={<div className="basis-1/3" >Size</div>}
            content={audioSize}
          />

          <div className={classes.action}>
              <div className={`${classes.button_action_1} ${classes.success_}`}
                onClick={() => {
                  console.log('toggle: ', PASSWORD_POPUP);
                  togglePopup(PASSWORD_POPUP)}
                }
              >
                Decode
              </div>
              <div className={`${classes.button_action_1} ${classes.destroy_}`}
                onClick={() => {
                  setData(null);
                  setAudio(null);
                }}>Delete</div>
          </div>
      </div>
  )
}

const DecoderRightComponent = ({
  message
}) => { 
  const messageSizeBytes = message ? new Blob([message]).size.toString() + " B" : 0;
  const wordCount = message ? message.split(/\s+/).length : 0;
  const handleDownloadMessage = (message) => {
    if (!message) {
      toast.error("No message to download.");
      return;
    }
    // Download the message as a text file
    const element = document.createElement("a");
    const file = new Blob([message], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "message_audio.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div className={classes.right}>
      <div className={classes.header_notepad}>
        <div className={classes.small_title}>Extracted text</div>
        <div className={`${classes.action_list} ms-auto`}>
            <div className={classes.button_action_2} onClick={() => handleDownloadMessage(message)}>Save</div>
            <div className={classes.button_action_2} onClick={() => handleDownloadMessage(message)}>Save as</div>
        </div>
      </div>
      <span className={classes.notepad}>
        {message}
      </span>

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

export default Decoder;