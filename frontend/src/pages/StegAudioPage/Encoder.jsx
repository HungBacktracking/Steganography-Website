import classes from './StegAudioPage.module.css';
import { TwoSideTextBox } from '../../components/Box';
import { useRef, useState } from 'react';
import UploadComponent from '../../components/UploadComponent/UploadComponent'

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
  const [audio, setAudio] = useState(null);
  const [audioSize, setAudioSize] = useState("N/A");
  const audioFormat = "WAV";
  const [audioTime, setAudioTime] = useState("N/A");

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
        setAudioSize((file.size / (1024 * 1024)).toFixed(2) + " MB");

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
          onClick={(e) => {fileInput.current.click()}}>
          {audio ? (
            <audio controls src={audio} style={{ maxWidth: '100%', maxHeight: 'auto'}} />
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