import React, { useState } from 'react';
import classes from './StegImagePage.module.css';

import Encoder from './Encoder';
import Decoder from './Decoder';

const StegImagePage = () => {

    const [activeTab, setActiveTab] = useState('encode');

    return (
        <div className={classes.container_page + " flex flex-1"}>
            <div className={classes.tab_container}>
                <button  className={`${classes.tab} ${activeTab === 'encode' ? classes.active : ''}`}
                    onClick={() => setActiveTab('encode')}> Encode </button>
                <button className={`${classes.tab} ${activeTab === 'decode' ? classes.active : ''}`}
                    onClick={() => setActiveTab('decode')}> Decode </button>
            </div>

            {activeTab === 'encode' ? <Encoder /> : <Decoder />}      
        </div>
    );
}

export default StegImagePage;
