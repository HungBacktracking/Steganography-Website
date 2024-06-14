import classes from './StegImagePage.module.css';


const Decoder = ({}) => {
  return (
      <div className={classes.steg_container}>
          <div className={classes.title}>Decode</div>
          <div className={classes.steg_wrapper}>
             <DecoderLeftComponent />
              <DecoderRightComponent />
          </div>
      </div> 
  )
}

const DecoderLeftComponent = ({}) => {
  return (
      <div className={classes.left}>
          <div className={classes.image_container}></div>
          <div className={classes.info}>Resolution</div>
          <div className={classes.info}>Created on</div>
          <div className={classes.info}>Payload</div>
          <div className={classes.info}>Size</div>
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
          <div className={classes.info_list}>
              <div className={classes.info_item_capacity}>Text size</div>
              <div className={classes.info_item_path}>Path</div>
          </div>
      </div>
  )
}

export default Decoder;