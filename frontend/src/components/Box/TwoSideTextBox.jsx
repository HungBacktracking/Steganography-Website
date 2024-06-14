const TwoSideTextBox = ({ 
    title, titleComponent,
    content, contentComponent,
    className }) => {
  return (
    <div className={
      `two_side_text_box   
      ${className}
      border-2 boder-solid border-myGray rounded-md p-2
      font-normal text-base
      flex flex-row 
      overflow-hidden
      gap-4
      `} style={{borderWidth: 1 + 'px', color: 'rgb(148, 163, 184)'}}>

        {
          titleComponent
          ? titleComponent
          : <div className="title"  >{title}</div>
        }

        <div className="line border-[1px] border-solid border-inherit "></div> {/* "line" */}

        {
          contentComponent 
          ? contentComponent
          : <div className="content">{content}</div>
        }
    </div>
  );
}

export default TwoSideTextBox;