import classes from './StegImagePage.module.css';
import { TwoSideTextBox } from '../../components/Box';

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
          {/* <div className={classes.info}>Resolution</div> */}
          <TwoSideTextBox 
            titleComponent={<div className="text-[1.3vw] basis-1/3" >Resolution</div>}
            content={"1920x1080"}
          />

          {/* <div className={classes.info}>Mode</div> */}
          {/* <TwoSideTextBox
            titleComponent={<div className="text-[1.3vw] basis-1/3" >Mode</div>}
            content={"...."}
          /> */}


          {/* <div className={classes.info}>Format</div> */}
          <TwoSideTextBox
            titleComponent={<div className="text-[1.3vw] basis-1/3" >Format</div>}
            content={"PNG"}
          />

          {/* <div className={classes.info}>Size</div> */}
          <TwoSideTextBox
            titleComponent={<div className="text-[1.3vw] basis-1/3" >Size</div>}
            content={"10Mb"}
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