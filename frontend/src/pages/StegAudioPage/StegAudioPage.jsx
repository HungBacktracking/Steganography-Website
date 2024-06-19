import React, { useState } from 'react';
import classes from './StegAudioPage.module.css';

import Encoder from './Encoder';
import Decoder from './Decoder';

const StegAudioPage = () => {

    const [activeTab, setActiveTab] = useState('encode');

    return (
        <div className={classes.container_page + " flex flex-1"}>
            {activeTab === 'encode' ? <Encoder setActiveTab={setActiveTab} /> : <Decoder setActiveTab={setActiveTab}/>}      
        </div>
    );
}

export default StegAudioPage;
