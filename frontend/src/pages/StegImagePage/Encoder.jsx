import { useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

// Entity Object
import { TextDataEncode } from '../../entities';
import ImageData from './ImageData';

// Asset
import { UploadImage } from '../../assets';

// Component
import classes from './StegImagePage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { PasswordPopup, Spinner } from '../../components/Popup';

const PASSWORD_POPUP = 'passwordPopup';

const encode = async (imageData, textData, password) => {
  console.log("Handle Encode");
  console.log("Image Data: ", imageData);
  console.log("Text Data: ", textData);
  console.log("Password: ", password);

  // Check Condition
  if (!textData) {
    toast.error("No data to encode. Please try again.");
    return;
  }
  if (!imageData.base64encode) {
    toast.error("No image to encode. Please try again.");
    return;
  }

  // Fake Encode
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });


  // Encode Text Data
  const textDataEncode = new TextDataEncode(textData, password);
  console.log("Text Data Encode: ", textDataEncode);  
  const cipherText = textDataEncode.encrypt();
  console.log("Cipher Text: ", cipherText);
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
    console.log("Handle Choose File: ", fileObject);
    setMessage(fileObject);
    textareaRef.current.value = fileObject.content;
  }, []);
  const [imageData, setImageData] = useState(new ImageData({}));
  /* #endregion */

  const [isEncoding, setIsEncoding] = useState(false);

  const handleEncode = async (imageData, textData, password) => {
    setIsEncoding(true);
    try {
      await encode(imageData, textData, password);
    } catch (err) {
      console.log("Error: ", err);
      toast.error("Failed to encode. Please try again.");
    } finally {
      setIsEncoding(false);
    }
  }

  /* #region Child Component */
  const EncoderLeftComponent = ({
    togglePopup,
    imageData, setImageData
  }) => {

    const fileInput = useRef(null);

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
            {imageData.base64encode
              ? (<img src={imageData.base64encode} alt="Uploaded" />)
              : (<>
                <img src={UploadImage} className='' alt="Upload" />
                <p className="">Click to upload an image</p>
              </>)}
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

  const EncoderRightComponent = ({
    handleChooseFile,
    textareaRef,
  }) => {
    const [textData, setTextData] = useState(textareaRef.current?.value || "");
    const handleFileChange = async (e) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      console.log("File Choose: ", file);

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
            <div className={classes.button_action_2}>Save</div>
            <div className={classes.button_action_2}>Save as</div>
            <div className={classes.button_action_2}>New</div>
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
          {/* <div className={classes.info_item_capacity}>Capacity</div> */}
          <TwoSideTextBox className={"flex-[70%] p-[0.7vw]"} title="Capacity"
            content={message.size ? `${message.size}B/ 10Kb` : `2.1Kb/ 10Kb`}
          />
          {/* <div className={classes.info_item_path}>Path</div> */}
          <TwoSideTextBox className={"flex-[70%] p-[0.7vw]"} title="Name" content={message.name || `D:\\path\\sub_path`} />
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
          imageData={imageData}
          setImageData={setImageData}
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
                handleEncode(imageData, textareaRef.current?.value || "", password);
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

class EncodeImageFile {
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
    try {
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

      file.content = content;
      return {
        data: new EncodeImageFile(file),
        error: null,
      }
    } catch (err) {
      console.log("Error: ", err);
      return {
        data: null,
        error: "Failed to read the file. Please try again.",
      }
    }
  }
}


  
export default Encoder;