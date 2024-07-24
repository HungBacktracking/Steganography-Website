import React, { useState } from 'react';
import classes from './StegVideoPage.module.css';

import Encoder from './Encoder';
import Decoder from './Decoder';

const StegVideoPage = () => {

    const [activeTab, setActiveTab] = useState('encode');

    return (
        <div className={classes.container_page}>
            {activeTab === 'encode' ? <Encoder setActiveTab={setActiveTab} /> : <Decoder setActiveTab={setActiveTab}/>}      
        </div>
    );
}

export default StegVideoPage;
