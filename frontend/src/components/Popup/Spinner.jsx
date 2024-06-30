import style from './Spinner.module.css';
import stylePopup from './Popup.module.css';

const SpinnerPopup = () => {
  return (
    <div className={stylePopup.popup_background}>
      <div className={style["lds-roller"]}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
}

export default SpinnerPopup;