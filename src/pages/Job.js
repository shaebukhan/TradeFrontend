import React from 'react';
import Navbar from '../components/Navbar';

const Job = () => {
    return (
        <>
            <Navbar />

            <div className="job-main-sec">
                <h2>Home & Garden</h2>
                <div className="job-btns-main">
                    <button className='common-btn-job' >Post Job</button>
                    <button className='common-btn-job' >Seeking Job</button>
                </div>
            </div>
        </>
    );
};

export default Job;