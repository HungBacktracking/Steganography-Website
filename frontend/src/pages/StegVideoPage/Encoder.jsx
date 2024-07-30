import { useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

// Entity Object
import VideoData from './VideoData';

// Component
import classes from './StegVideoPage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { PasswordPopup, Spinner } from '../../components/Popup';
import { UploadComponent } from '../../components/UploadComponent';
import { TextDataEncode } from '../../entities';
import { VideoServices } from '../../services'
// Service

const PASSWORD_POPUP = 'passwordPopup';

const encode = async (videoDatabase64, textData, password) => {

  // Check Condition
  if (!textData) {
    toast.error("No data to encode. Please try again.");
    return;
  }
  if (!videoDatabase64) {
    toast.error("No video to encode. Please try again.");
    return;
  } 
  let data = null;

  const textDataEncode = new TextDataEncode(message, password);
  const cipherText = textDataEncode.encrypt();
  data = await VideoServices.embeddMessage(base64Encodedata, cipherText);
  const downloadLink = document.createElement('a');
  downloadLink.href = data.audio;
  downloadLink.download = 'encoded_video.wav';
  downloadLink.click();
  return data;
}

const Encoder = ({ setActiveTab }) => {
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = (popupName) => {
    setShowPopup((prevState) => ({
      ...prevState,
      [popupName]: !prevState[popupName]
    }));
  };
  const isOpen = (popupName) => showPopup[popupName] || false;

  /* #region Data to Encode*/
  /**
   * message: {name, size, content} : User's file upload
   * textareaRef: Ref to textarea to display the content of the file
   * imageData: {name, base64encode, resolution, format, size} : Image uploaded
   * password: Password is call in handleEncode
   */
  
  const [message, setMessage] = useState({});
  const textareaRef = useRef(null);

  const handleChooseFile = useCallback((fileObject) => {
    setMessage(fileObject);
    textareaRef.current.value = fileObject.content;
  }, []);

  const [videoData, setVideoData] = useState(new VideoData({}));
  
  const [isEncoding, setIsEncoding] = useState(false);

  const handleEncode = async (videoDatabase64, textData, password) => {
    setIsEncoding(true);
    try {
      let data = await encode(videoDatabase64, textData, password);
      if(!data) {
        toast.error("Failed to encode. Please try again.");
        return;
      }
      toast.success("Encode successfully");
      // download this image 
      const downloadLink = document.createElement('a');
      downloadLink.href = data.video;
      downloadLink.download = 'encoded_video.mp4';
      downloadLink.click();
    } catch (err) {
      toast.error("Failed to encode. Please try again.");
    } finally {
      setIsEncoding(false);
    }
  }
  /* #endregion */

  /* #region Child Component */
  const EncoderLeftComponent = ({
    togglePopup,
    videoData, setVideoData
  }) => {

    const fileInput = useRef(null);

    const readDataUploaded = (e) => {
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
        {/* Video Container */}
        <div className={`${classes.video_container}`}>
          { 
            videoData.base64encode ? ( 
              <video className={classes.video} controls>
                <source src={videoData.base64encode} type={videoData.format} />
              </video>
              ) : (
              <UploadComponent readDataUploaded={readDataUploaded} fileInput={fileInput} fileAccepted={"video/*"} />
            )
          }
        </div>

        {/* Resolution */}
        {/* <TwoSideTextBox
          titleComponent={<div className="basis-1/3" >Resolution</div>}
          content={videoData.resolution}
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
          {/* Encode button */}
          <div
            className={`${classes.button_action_1} ${classes.success_}`}
            onClick={() => togglePopup(PASSWORD_POPUP)}
          >
            Encode
          </div>

          {/* Delete button */}
          <div 
            className={`${classes.button_action_1} ${classes.destroy_}`} 
            onClick={() => {setVideoData(new VideoData({})); setMessage({}); textareaRef.current.value = ""}}
          >
            Delete
          </div>
        
        </div>
      </div>
    );
  }

  const EncoderRightComponent = ({
    handleChooseFile,
    textareaRef,
  }) => {
    const [textData, setTextData] = useState(textareaRef.current?.value || "");
    const handleFileChange = async (e) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      // console.log("File Choose: ", file);

      // Check Condition
      const checkError = EncodeVideoFile.checkFileError(file);
      if (checkError) {
        toast.error(checkError);
        return;
      }

      // Read the file
      let readFileResponse = await EncodeVideoFile.readFile(file);
      if (readFileResponse.error) {
        toast.error(readFileResponse.error);
        return;
      }

      let fileObject = readFileResponse.data;
      handleChooseFile(fileObject);
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
  /* #endregion */

  return (
    <div className={classes.steg_container}>
      {/* Title */}
      <div className={classes.list_title}>
        <div className={`${classes.title_active} ${classes.title}`}>Encode</div>
        <div className={classes.title} onClick={() => setActiveTab('decode')}>Decode</div>
      </div>

      <div className={classes.steg_wrapper}>
        <EncoderLeftComponent
          togglePopup={togglePopup}
          videoData={videoData}
          setVideoData={setVideoData}
        />

        <EncoderRightComponent
          handleChooseFile={handleChooseFile}
          textareaRef={textareaRef}
        />
      </div>

      <div>
        {
          isOpen(PASSWORD_POPUP) && (
            <PasswordPopup
              onConfirm={(password) => {
                handleEncode(videoData.base64encode, textareaRef.current?.value || "", password);
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

class EncodeVideoFile {
  static MAX_SIZE_IN_BYTE = 1024 * 1024; // 1 MB

  constructor(file) {
    this.name = file.name;
    this.size = file.size;
    this.content = file.content;
  }

  static _checkFileType(file) {
    if (file.type !== 'text/plain') {
      return "Invalid file type. Please upload a text file.";
    }
    return null;
  }

  static _checkFileSize(file) {
    if (EncodeVideoFile.MAX_SIZE_IN_BYTE > 0 && file.size > EncodeVideoFile.MAX_SIZE_IN_BYTE) {
      return "File size exceeds the limit. Please upload a smaller file.";
    }
    return null;
  }

  static checkFileError(file) {
    let checkError = EncodeVideoFile._checkFileType(file)
      || EncodeVideoFile._checkFileSize(file);

    return checkError;
  }

  static async readFile(file) {
    // Read the file
    try {
      // Read path of file and save to fileInfo
      const reader = new FileReader();

      // Await to read the file and get the content
      const content = await new Promise((resolve, reject) => {
        reader.onload = (e) => {
          // console.log("File content: ", e.target.result);
          resolve(e.target.result);
        }
        reader.onerror = (e) => {
          reject(e);
        }
        reader.readAsText(file);
      });

      file.content = content;
      return {
        data: new EncodeVideoFile(file),
        error: null,
      }
    } catch (err) {
      // console.log("Error: ", err);
      return {
        data: null,
        error: "Failed to read the file. Please try again.",
      }
    }
  }
}


  
export default Encoder;