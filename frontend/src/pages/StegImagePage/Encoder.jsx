import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import classes from './StegImagePage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { PasswordPopup } from '../../components/Popup';
import { TextData } from '../../entities';
import { UploadImage } from '../../assets';

const PASSWORD_POPUP = 'passwordPopup';

class ImageData {
  constructor(image) {
    this.name         = image.name || "N/A";
    this.base64encode = image.base64encode || "";
    this.resolution   = image.resolution || "N/A";
    this.format       = image.format || "N/A";
    this.size         = image.size || "N/A";
  }
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
     
  const [isEncode, setIsEncode] = useState(true);

  const [imageObject, setImageObject] = useState(null);

  const handleEncode = async (base64encodeData, password) => {
    console.log("Handle Encode");

    setIsEncode(true);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    setIsEncode(false);

    if(!base64encodeData) {
      toast.error("No data to encode. Please try again.");
    }
  }

  const [messageContent, setMessageContent] = useState("");

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
        />

        <EncoderRightComponent 
          messageContent={messageContent}
          setMessageContent={setMessageContent}   
        />
      </div>

      <div>
        {
          isOpen(PASSWORD_POPUP) && (
            <PasswordPopup
              onConfirm={(password) => {
                handleEncode("data", password);
              }
            }
              onCancel={() => {
                toast.warning("Encode canceled");
              }}
              onClose={() => togglePopup(PASSWORD_POPUP)}
            />
          )
        }
      </div>
    </div>
  )
}

const EncoderLeftComponent = ({
  togglePopup,
}) => {

  const fileInput = useRef(null);
  const [imageData, setImageData] = useState(new ImageData({}));

  const handleImageContainerClick = () => {
    fileInput.current.click();
  }

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {

          // read data from image uploaded
          const imageData = new ImageData({
            name: file.name,
            base64encode: e.target.result,
            resolution: `${img.width} x ${img.height}`,
            format: file.type.split('/')[1].toUpperCase(),
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          });
          setImageData(imageData);
          
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
      // do something with the file

    }
    else {
      toast.error("Failed to upload file. Please try again.");
      return;
    }
  };

  return (
    <div className={classes.left}>
      <div className={classes.image_container} onClick={handleImageContainerClick}>
          <div className={classes.uploadPrompt}>
            { imageData.base64encode 
              ? (<img src={imageData.base64encode} alt="Uploaded" />)
              : (<>
                <img src={UploadImage} className='' alt="Upload" />
                <p className="">Click to upload an image</p>
              </>) }
          </div>
        <input
          type="file"
          ref={fileInput}
          onChange={handleFileSelection}
          style={{ display: 'none' }}
          accept="image/*" // Accept only images
        />
      </div>
      
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

        <div 
          className={`${classes.button_action_1} ${classes.success_}`}
          onClick={() => togglePopup(PASSWORD_POPUP)}
        >
          Encode
        </div>
        
        <div className={`${classes.button_action_1} ${classes.destroy_}`}>Delete</div>
      </div>
    </div>
  );
}

class EncodeImageFile {
  static MAX_SIZE_IN_BYTE = 1024 * 1024; // 1 MB

  constructor(file) {
    this.filePath = file.filePath;
    this.fileSize = file.fileSize;
    this.content  = file.content;
  }

  static _checkFileType(file) {
    if (file.type !== 'text/plain') {
      return "Invalid file type. Please upload a text file.";
    }
    return null;
  }

  static _checkFileSize(file) {
    if (EncodeImageFile.MAX_SIZE_IN_BYTE > 0 && file.size > EncodeImageFile.MAX_SIZE_IN_BYTE) {
      return "File size exceeds the limit. Please upload a smaller file.";
    }
    return null;
  }

  static checkFileError(file) {
    let checkError = EncodeImageFile._checkFileType(file) 
                  || EncodeImageFile._checkFileSize(file);
  
    return checkError;
  }

  static async readFile(file) {
    // Read the file
    try{
      const fileInfo = {};
      // fileInfo.filePath = file.webkitRelativePath || file.path || file.name; // Get path or name
      // fileInfo.fileSize = file.size;

      // Read path of file and save to fileInfo

      const reader = new FileReader();

      // Await to read the file and get the content
      const content = await new Promise((resolve, reject) => {
        reader.onload = (e) => {
          console.log("File content: ", e.target.result);
          resolve(e.target.result);
        }
        reader.onerror = (e) => {
          reject(e);
        }
        reader.readAsText(file);
      });

      fileInfo.content = content;
      return {
        data: new EncodeImageFile(fileInfo),
        error: null,
      }
    }catch(err){  
      console.log("Error: ", err);
      return {
        data: null,
        error: "Failed to read the file. Please try again.",
      }
    }
  }
}

const EncoderRightComponent = ({
  messageContent,
  setMessageContent,
}) => {
  const handleFileChange = async (e) => {
    console.log("File full path: ", e.target.value);
    if (!e.target.files || e.target.files.length === 0) return;
  
    const file = e.target.files[0];
    console.log("file choose: ", file);

    // Check Condition
    const checkError = EncodeImageFile.checkFileError(file);
    if (checkError) {
      toast.error(checkError);
      return;
    }

    // Read the file
    let readFileResponse = await EncodeImageFile.readFile(file);
    if (readFileResponse.error) {
      toast.error(readFileResponse.error);
      return;
    }

    let fileObject = readFileResponse.data;
    console.log("fileObject: ", fileObject);
    setMessageContent(fileObject.content);
  }

  return (
    <div className={classes.right}>
      <div className={classes.header_notepad}>
        <div className={classes.small_title}>Notepad</div>
        <div className={`${classes.action_list} ms-auto`}>
          <div className={classes.button_action_2}
            onClick={(e) => {
              e.target.nextElementSibling.click();
            } }>
            Open
          </div>
          <input type="file" style={{ display: 'none' }} 
            accept=".txt"
            onChange={handleFileChange}
            multiple={false}
          />
          <div className={classes.button_action_2}>Save</div>
          <div className={classes.button_action_2}>Save as</div>
          <div className={classes.button_action_2}>New</div>
        </div>
      </div>
      <textarea 
        className={classes.notepad} 
        onChange={(e) => { setMessageContent(e.target.value) }}
        value={messageContent}
      >
      </textarea>
      <div className={classes.info_list + " mt-auto"}>
          {/* <div className={classes.info_item_capacity}>Capacity</div> */}
          <TwoSideTextBox className={"flex-[70%] p-[0.7vw]"} title="Capacity" content="2.1Kb/ 10Kb" />
          {/* <div className={classes.info_item_path}>Path</div> */}
          <TwoSideTextBox className={"flex-[70%] p-[0.7vw]"} title="Path" content="D:\path\sub_path" />
      </div>
    </div>
  )
}

export default Encoder;