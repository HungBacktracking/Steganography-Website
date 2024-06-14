import React from 'react';
import classes from './StegImagePage.module.css';

import Encoder from './Encoder';
import Decoder from './Decoder';

const StegImagePage = () => {
    return (
        <div className={classes.container_page}>
            <Encoder />
            <Decoder />          
        </div>
    );
}

export default StegImagePage;
