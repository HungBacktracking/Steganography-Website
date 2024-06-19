import classes from './StegAudioPage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { useRef, useState } from 'react';

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
  const [audio, setAudio] = useState(null);


  const handleAudioContainerClick = () => {
    fileInput.current.click();
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAudio(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };

  return (
      <div className={classes.left}>
        <div className={classes.audio_container} onClick={handleAudioContainerClick}>
          {audio ? (
            <audio controls src={audio} style={{ maxWidth: '100%', maxHeight: '100%' }} />
          ) : (
            <div className={classes.uploadPrompt}>Click to upload an audio file</div>
          )}
          <input
            type="file"
            accept=".wav" // Accept only .wav files
            style={{ display: 'none' }} // Hide the file input
            onChange={handleFileSelection}
            ref={fileInput}
          />
        </div>

          {/* <div className={classes.info}>Resolution</div> */}
          {/* <TwoSideTextBox 
            titleComponent={<div className="basis-1/3" >Resolution</div>}
            content={imageResolution}
          /> */}

          {/* <div className={classes.info}>Mode</div> */}
          {/* <TwoSideTextBox
            titleComponent={<div className="basis-1/3" >Mode</div>}
            content={"...."}
          /> */}


          {/* <div className={classes.info}>Format</div> */}
          {/* <TwoSideTextBox
            titleComponent={<div className="basis-1/3" >Format</div>}
            content={imageFormat}
          /> */}

          {/* <div className={classes.info}>Size</div> */}
          {/* <TwoSideTextBox
            titleComponent={<div className="basis-1/3" >Size</div>}
            content={imageSize}
          /> */}
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