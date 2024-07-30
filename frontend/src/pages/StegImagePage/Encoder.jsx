import { useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

// Entity Object
import { TextDataEncode } from '../../entities';
import ImageData from './ImageData';

// Component
import classes from './StegImagePage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { PasswordPopup, Spinner, EncodedPopup } from '../../components/Popup';
import { UploadComponent } from '../../components/UploadComponent';
import EncodeFile from '../../utils/EncodeFile';

// Service
import { ImageServices } from '../../services';

const PASSWORD_POPUP = 'passwordPopup';

const encode = async (imageData, textData, password) => {

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
  // await new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 2000);
  // });


  // Encode Text Data
  const textDataEncode = new TextDataEncode(textData, password);
  const cipherText = textDataEncode.encrypt();
  let data = await ImageServices.embeddMessage(imageData.base64encode, cipherText);
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
    // console.log("Handle Choose File: ", fileObject);
    setMessage(fileObject);
    textareaRef.current.value = fileObject.content;
  }, []);
  const [imageData, setImageData] = useState(new ImageData({}));
  /* #endregion */

  const [isEncoding, setIsEncoding] = useState(false);
  const [encodedData, setEncodedData] = useState(null);

  const handleEncode = async (imageData, textData, password) => {
    setIsEncoding(true);
    try {
      let data = await encode(imageData, textData, password);
      if(!data) {
        toast.error("Failed to encode. Please try again.");
        return;
      }
      toast.success("Encode successfully");
      // download this image 
      // const downloadLink = document.createElement('a');
      // downloadLink.href = data.image;
      // downloadLink.download = 'encoded_image.png';
      // downloadLink.click();
      setEncodedData(data);

    } catch (err) {
      // console.log("Error: ", err);
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

    const readDataUploaded = (e) => {
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
          imageData.base64encode ? ( 
            <div> 
              <img className={classes.image} src={imageData.base64encode} alt="Uploaded" /> 
              {encodedData &&(
                <EncodedPopup
                  dataInput={imageData}
                  dataEncoded={encodedData.image}
                  type="image"
                />
              )}
            </div>
            ) : (
            <UploadComponent readDataUploaded={readDataUploaded} fileInput={fileInput} fileAccepted={"image/*"} />
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
            onClick={() => {setImageData(new ImageData({})); setMessage({}); setEncodedData({}); textareaRef.current.value = ""}}
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


  
export default Encoder;