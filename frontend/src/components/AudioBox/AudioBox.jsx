import React from 'react';
import styles from './AudioBox.module.css';

const AudioBox = () => {
  return (
    <div className={styles.audioBox}>
        <div className={styles.header}>
            <div className={styles.name}>BabyElephant</div>
            <div className={styles.action_list}>
                <div className={styles.delete}>
                    <i class="fa-regular fa-trash-can"></i>
                </div>
            </div>
        </div>
        <div className={styles.author}>Anonymous</div>
        <div className={styles.playback}>
            <div className={styles.play_button}>
                <i class="fa-solid fa-play"></i>
            </div>
            <div className={styles.progress}></div>
        </div>
        <div className={styles.bottomLine}>
            <div className={styles.list_tag}>
                <div className={styles.tag}>File Encoding</div>
                <div className={styles.tag}>MP3 File</div>
            </div>
            <div className={styles.time}>00:45-01:00</div>
        </div>
        
    </div>
  );
};

export default AudioBox;