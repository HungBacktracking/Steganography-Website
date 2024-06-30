import classes from './StegImagePage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { useRef, useState } from 'react';
import { UploadImage } from '../../assets';

class ImageData {
  constructor(image) {
    this.name         = image.name || "N/A";
    this.base64encode = image.base64encode || "";
    this.resolution   = image.resolution || "N/A";
    this.format       = image.format || "N/A";
    this.size         = image.size || "N/A";
  }
};

const Decoder = ({ setActiveTab }) => {
  return (
      <div className={classes.steg_container}>
          <div className={classes.list_title}>
            <div className={classes.title} onClick={() => setActiveTab('encode')}>Encode</div>
            <div className={ `${classes.title_active} ${classes.title}`}>Decode</div>
          </div>
        
          <div className={classes.steg_wrapper}>
             <DecoderLeftComponent />
              <DecoderRightComponent />
          </div>
      </div> 
  )
}

const DecoderLeftComponent = ({}) => {
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
        const image = new Image();
        image.onload = () => {
          const imageData = new ImageData({
            name: file.name,
            base64encode: e.target.result,
            resolution: `${image.width} x ${image.height}`,
            format: file.type,
            size: file.size
          });
          setImageData(imageData);
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
      console.log(file);
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
              <div className={`${classes.button_action_1} ${classes.success_}`}>Decode</div>
              <div className={`${classes.button_action_1} ${classes.destroy_}`}>Delete</div>
          </div>
      </div>
  )
}

const DecoderRightComponent = ({}) => { 
  return (
      <div className={classes.right}>
          <div className={classes.header_notepad}>
              <div className={classes.small_title}>Extracted text</div>
              <div className={`${classes.action_list} ms-auto`}>
                  <div className={classes.button_action_2}>Save</div>
                  <div className={classes.button_action_2}>Save as</div>
              </div>
          </div>
          <div className={classes.notepad}></div>
          <div className={classes.info_list + " mt-auto"} >
              {/* <div className={classes.info_item_capacity}>Text size</div> */}
              <TwoSideTextBox 
               title = "Text size"
                content = "2.1Kb"
                className={"flex-[70%] p-[0.7vw]"}
              />

              {/* <div className={classes.info_item_path}>Path</div> */}
              <TwoSideTextBox
                title = "Path"
                content = "/home/user/Downloads"
                className={"flex-[70%] p-[0.7vw]"}
              />
          </div>
      </div>
  )
}

export default Decoder;