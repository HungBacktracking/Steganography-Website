import classes from './StegAudioPage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { useCallback, useRef, useState } from 'react';
import UploadComponent from '../../components/UploadComponent/UploadComponent'
import AudioVisualizer from '../../components/Visualizer/AudioVisualizer';
import EncodeFile from '../../utils/EncodeFile';
import { PasswordPopup, Spinner, EncodedPopup } from '../../components/Popup';
import { toast } from 'react-toastify';
import { TextDataEncode } from '../../entities'; 
import { AudioService } from '../../services'

const PASSWORD_POPUP = 'passwordPopup';

const encode = async (base64Encodedata, message, password) => {

  // Check Condition
  if (!message) {
    toast.error("No data to encode. Please try again.");
    return;
  }
  if (!base64Encodedata) {
    toast.error("No audio to encode. Please try again.");
    return;
  }

  const textDataEncode = new TextDataEncode(message, password);
  const cipherText = textDataEncode.encrypt();
  let data = await AudioService.embeddMessage(base64Encodedata, cipherText);
  const downloadLink = document.createElement('a');
  downloadLink.href = data.audio;
  downloadLink.download = 'encoded_audio.wav';
  downloadLink.click();
  return data;
}

const Encoder = ({ setActiveTab }) => {
  const textAreaRef = useRef(null);
  const handleChooseFile = useCallback((fileObject) => {
    textAreaRef.current.value = fileObject.content;
  }, []); 

  const [isEncoding, setIsEncoding] = useState(false);
  const [audioData, setAudioData] = useState();
  const [encodedData, setEncodedData] = useState();
  
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = (popupName) => {
    setShowPopup((prevState) => ({
      ...prevState,
      [popupName]: !prevState[popupName]
    }));
  };
  const isOpen = (popupName) => showPopup[popupName] || false;

  const handleEncode = async(data, message, password) => {
    setIsEncoding(true);
    try{
      let encodedData = await encode(data, message, password);
      console.log({encodedData});

      if(!encodedData) {
        toast.error("Failed to encode. Please try again.");
        return;
      }
      toast.success("Encode successfully");

      // console.log({encodedData});
      setEncodedData(encodedData);
    }catch (err) {
      console.log("Error: ", err);
      toast.error("Failed to encode. Please try again.");
    } finally {
      setIsEncoding(false);
    }
  }

  return (
      <div className={classes.steg_container}>
          {/* Title */}
          <div className={classes.list_title}>
            <div className={ `${classes.title_active} ${classes.title}`}>Encode</div>
            <div className={classes.title} onClick={() => setActiveTab('decode')}>Decode</div>
          </div>
          
          <div className={classes.steg_wrapper}>
              <EncoderLeftComponent 
                togglePopup={togglePopup}
                setData={setAudioData}
              />
              <EncoderRightComponent 
                textareaRef={textAreaRef}
                handleChooseFile={handleChooseFile}
              />
          </div>

          <div>
        {
          isOpen(PASSWORD_POPUP) && (
            <PasswordPopup
              onConfirm={(password) => {
                handleEncode(audioData, textAreaRef.current?.value || "", password);
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
          isEncoding && <Spinner />
        }
      </div>
      </div>
  )
}


const EncoderLeftComponent = ({
  togglePopup,
  setData
}) => {
  const fileInput = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audio, setAudio] = useState(null);
  const [audioSize, setAudioSize] = useState("N/A");
  const audioFormat = "WAV";
  const [audioTime, setAudioTime] = useState("N/A");

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
        <div className={`${classes.audio_container} ${audio ? classes.audio_uploaded : ''}`}
          onClick={handleAudioContainerClick}>
          {audio ? (
            // <audio controls src={audio} style={{ maxWidth: '100%', maxHeight: 'auto'}} />
            <AudioVisualizer blob={audioBlob} />  
          ) : (
            // <div className={classes.uploadPrompt}>Click to upload an audio file</div>
            <UploadComponent 
              readDataUploaded={handleFileSelection}
              accept=".wav"
              fileInput={fileInput}
            />
          )}
          {/* <input
            type="file"
            accept=".wav" // Accept only .wav files
            style={{ display: 'none' }} // Hide the file input
            onChange={handleFileSelection}
            ref={fileInput}
          /> */}
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
              onClick={() => togglePopup(PASSWORD_POPUP)}>Encode</div>
            <div className={`${classes.button_action_1} ${classes.destroy_}`}
              onClick={() => {setData(null); setAudio(null);}}>Delete</div>
        </div>
      </div>
  );
}

const EncoderRightComponent = ({
  handleChooseFile,
  textareaRef,
}) => {
  const [message, setMessage] = useState({});
  const [textData, setTextData] = useState(textareaRef.current?.value || "");
  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    // console.log("File Choose: ", file);

    // Check Condition
    const checkError = EncodeFile.checkFileError(file);
    if (checkError) {
      toast.error(checkError);
      return;
    }

    // Read the file
    let readFileResponse = await EncodeFile.readFile(file);
    if (readFileResponse.error) {
      toast.error(readFileResponse.error);
      return;
    }

    let fileObject = readFileResponse.data;
    handleChooseFile(fileObject);
    setTextData(fileObject.content);
  }


  return (
    <div className={classes.right}>
      <div className={classes.header_notepad}>
        <div className={classes.small_title}>Notepad</div>
        <div className={`${classes.action_list} ms-auto`}>
          <div className={classes.button_action_2}
            onClick={(e) => {
              e.target.nextElementSibling.click();
            }}>
            Open
          </div>
          <input type="file" style={{ display: 'none' }}
            accept=".txt"
            onChange={handleFileChange}
            multiple={false}
          />
          <div className={classes.button_action_2} 
            onClick={() => {setMessage({}); textareaRef.current.value = ""}}
          >
            New
          </div>
        </div>
      </div>
      <textarea
        className={classes.notepad}
        ref={textareaRef}
        value={textData}
        onChange={(e) => setTextData(e.target.value)}
      >
      </textarea>
      <div className={classes.info_list + " mt-auto"}>
        {/* Capacity */}
        <TwoSideTextBox className={"flex-[70%] p-[0.7vw]"} title="Capacity"
          content={message.size ? `${message.size}B` : `N/A`}
        />
        {/* File name */}
        <TwoSideTextBox className={"flex-[70%] p-[0.7vw]"} title="File name" content={message.name || `N/A`} />
      </div>
    </div>
  )
}



export default Encoder;