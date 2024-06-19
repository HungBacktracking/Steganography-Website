import classes from './StegImagePage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { useRef, useState } from 'react';

const Encoder = ({ setActiveTab }) => {
  return (
      <div className={classes.steg_container}>
          {/* Title */}
          <div className={classes.list_title}>
            <div className={ `${classes.title_active} ${classes.title}`}>Encode</div>
            <div className={classes.title} onClick={() => setActiveTab('decode')}>Decode</div>
          </div>
          
          <div className={classes.steg_wrapper}>
              <EncoderLeftComponent />
              <EncoderRightComponent />
          </div>
      </div>
  )
}

const EncoderLeftComponent = ({}) => {

  const fileInput = useRef(null);
  const [image, setImage] = useState(null);
  const [imageResolution, setImageResolution] = useState("N/A");
  const [imageFormat, setImageFormat] = useState("N/A");
  const [imageSize, setImageSize] = useState("N/A");

  const handleImageContainerClick = () => {
    fileInput.current.click();
  }

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Set the image to be displayed
      setImageFormat(file.type.split('/')[1].toUpperCase());
      setImageSize((file.size / 1024 / 1024).toFixed(2) + 'Mb'); // Convert bytes to megabytes

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        alert("File uploaded successfully!");

        // Get image resolution
        const img = new Image();
        img.onload = () => {
          setImageResolution(`${img.width}x${img.height}`);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
      console.log(file);
      // do something with the file

    }
    else {
      alert("Failed to upload file. Please try again.");
      console.log("No file selected");
    }
  };

  return (
      <div className={classes.left}>
          <div className={classes.image_container} onClick={handleImageContainerClick}>
            {image ? (<img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <div className={classes.uploadPrompt}>Click to upload an image</div>
            )}
            <input
              type="file"
              ref={fileInput}
              onChange={handleFileSelection}
              style={{ display: 'none' }}
              accept="image/*" // Accept only images
            />
          </div>
          
          {/* <div className={classes.info}>Resolution</div> */}
          <TwoSideTextBox 
            titleComponent={<div className="basis-1/3" >Resolution</div>}
            content={imageResolution}
          />

          {/* <div className={classes.info}>Mode</div> */}
          {/* <TwoSideTextBox
            titleComponent={<div className="basis-1/3" >Mode</div>}
            content={"...."}
          /> */}


          {/* <div className={classes.info}>Format</div> */}
          <TwoSideTextBox
            titleComponent={<div className="basis-1/3" >Format</div>}
            content={imageFormat}
          />

           {/* <div className={classes.info}>Size</div> */}
           <TwoSideTextBox
            titleComponent={<div className="basis-1/3" >Size</div>}
            content={imageSize}
          />

          <div className={classes.action}>
              <div className={`${classes.button_action_1} ${classes.success_}`}>Encode</div>
              <div className={`${classes.button_action_1} ${classes.destroy_}`}>Delete</div>
          </div>
      </div>
  );
}

const EncoderRightComponent = ({}) => {
  return (
      <div className={classes.right}>
          <div className={classes.header_notepad}>
              <div className={classes.small_title}>Notepad</div>
              <div className={`${classes.action_list} ms-auto`}>
                  <div className={classes.button_action_2}>Open</div>
                  <div className={classes.button_action_2}>Save</div>
                  <div className={classes.button_action_2}>Save as</div>
                  <div className={classes.button_action_2}>New</div>
              </div>
          </div>
          <div className={classes.notepad}></div>
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