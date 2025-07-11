import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../components/Loader';
import LocationAutocomplete from '../components/LocationAutocomplete';
import Cookies from "js-cookie";
import { Button, Modal } from 'antd';
import TermsR from '../components/TermsR';
const Recruitment = () => {
    const { id } = useParams();
    const [trade, setTrade] = useState("");
    const [loading, setLoading] = useState(false);
    const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
    const [pendingSubmission, setPendingSubmission] = useState(null); // Store pending submission data

    const authData = Cookies.get('auth') ? JSON.parse(Cookies.get('auth')) : null;
    const token = Cookies.get('token');
    const userId = authData?.user?._id;


    const [postJobData, setPostJobData] = useState({
        userId: userId,
        title: '',
        description: '',
        salary: '',
        location: '',
        latitude: '',
        longitude: '',
        startDate: '',
        endDate: '',
        type: 'JobPost' // Add type for post job
    });

    const [seekJobData, setSeekJobData] = useState({
        userId: userId,
        title: '',
        description: '',
        salary: '',
        location: '',
        latitude: '',
        longitude: '',
        startDate: '',
        endDate: '',
        type: 'JobSeek' // Add type for seek job
    });




    // Fetch single trade data
    const getSingleTradesData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/trade/${id}`);
            if (data?.success) {
                setTrade(data.trade);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch trade data');
        }
    };

    // Fetch trades when component mounts
    useEffect(() => {
        getSingleTradesData();
    }, [id]);

    // Handle input change for post job form
    const handlePostJobChange = (e) => {
        const { name, value } = e.target;
        setPostJobData({ ...postJobData, [name]: value });
    };

    // Handle input change for seek job form
    const handleSeekJobChange = (e) => {
        const { name, value } = e.target;
        setSeekJobData({ ...seekJobData, [name]: value });
    };

    const handlePostLocationSelect = (selectedPlace) => {
        setPostJobData({
            ...postJobData,
            location: selectedPlace.label,
            latitude: selectedPlace.latitude,
            longitude: selectedPlace.longitude
        });
    };

    const handleSeekLocationSelect = (selectedPlace) => {
        setSeekJobData({
            ...seekJobData,
            location: selectedPlace.label,
            latitude: selectedPlace.latitude,
            longitude: selectedPlace.longitude
        });
    };


    const handleTermsAccept = async () => {
        setIsTermsModalVisible(false);
        if (pendingSubmission) {
            try {
                setLoading(true);
                const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/payment/checkout-session`, pendingSubmission);
                if (res.data.checkoutSessionUrl) {
                    window.location.href = res.data.checkoutSessionUrl;
                } else {
                    throw new Error("Submission failed, try again");
                }
            } catch (error) {
                console.error('Error submitting job request:', error);
                toast.error('Failed to submit job request');
            } finally {
                setLoading(false);
            }
            setPendingSubmission(null); // Clear pending data after submission
        }
    };

    const handleSubmitJob = async (e, type) => {
        e.preventDefault();
        if (!token) return toast.error('Login to post a job!');

        const jobData = type === 'JobPost' ? postJobData : seekJobData;

        if (!jobData.startDate || !jobData.endDate) return toast.error("Please select both start and end dates!");
        if (jobData.startDate === jobData.endDate) return toast.error("Start date and end date cannot be the same!");
        if (!jobData.title || !jobData.description || !jobData.salary || !jobData.location) return toast.error('Please fill all required fields');

        // Store submission data and show modal
        setPendingSubmission({ ...jobData, type });
        setIsTermsModalVisible(true);
    };


    return (
        <>
            {loading && <Loader />}
            <Navbar />
            <div className="job-main-sec">
                <h2>{trade.trade}</h2>
                <div className="job-btns-main">
                    <div className="job-btns-left">
                        <div className="text-center">
                            <button className='common-btn-job' >{trade.trade} post job</button>
                        </div>
                        <form onSubmit={(e) => handleSubmitJob(e, 'JobPost')}>
                            <div className="text-center py-4">
                                <button type='submit' className='common-btn-job' >+ ADD</button>
                            </div>
                            <div className="recruit-border"></div>
                            <input
                                type='text'
                                className="recruit-inp"
                                placeholder='Hi, I am looking to hire...'
                                name="title"
                                value={postJobData.title}
                                onChange={handlePostJobChange}
                                required
                            />
                            <div className="recruit-border"></div>
                            <div className="recruit-second-inp">
                                <div className="recruit-second-inp-sub">
                                    Salary <input
                                        type="text"
                                        maxLength="40"
                                        placeholder='€'
                                        name="salary"
                                        value={postJobData.salary}
                                        onChange={handlePostJobChange}
                                        required
                                    />
                                </div>
                                <div className="recruit-second-inp-sub">
                                    Location  <LocationAutocomplete onSelect={handlePostLocationSelect} />

                                </div>
                            </div>
                            <div className="recruit-border"></div>
                            <input
                                type='text'
                                className="recruit-inp"
                                placeholder='Description'
                                name="description"
                                value={postJobData.description}
                                onChange={handlePostJobChange}
                                required
                            />
                            <div className="recruit-border"></div>
                            <div className="recruit-second-inp">
                                <div className="recruit-second-inp-sub">
                                    Start Date <input
                                        type="date"

                                        name="startDate"
                                        value={postJobData.startDate}
                                        onChange={handlePostJobChange}
                                        min={new Date().toISOString().split("T")[0]} // Prevent past dates
                                        required
                                    />
                                </div>
                                <div className="recruit-second-inp-sub">
                                    End Date <input
                                        type="date"

                                        name="endDate"
                                        value={postJobData.endDate}
                                        onChange={handlePostJobChange}
                                        min={postJobData.startDate || new Date().toISOString().split("T")[0]} // End date  
                                        required
                                    />

                                </div>
                            </div>




                        </form>
                    </div>

                    <div className="job-btns-right">
                        <div className="text-center">
                            <button className='common-btn-job' >{trade.trade} seek job</button>
                        </div>
                        <form onSubmit={(e) => handleSubmitJob(e, 'JobSeek')}>
                            <div className="text-center py-4">
                                <button type='submit' className='common-btn-job' >+ ADD</button>
                            </div>
                            <div className="recruit-border"></div>
                            <input
                                type='text'
                                className="recruit-inp"
                                placeholder='Hi, I am looking for apprenticeship as I am a professional...'
                                name="title"
                                value={seekJobData.title}
                                onChange={handleSeekJobChange}
                                required
                            />
                            <div className="recruit-border"></div>
                            <div className="recruit-second-inp">
                                <div className="recruit-second-inp-sub">
                                    Salary <input
                                        type="text"
                                        maxLength="40"
                                        placeholder='€'
                                        name="salary"
                                        value={seekJobData.salary}
                                        onChange={handleSeekJobChange}
                                        required
                                    />
                                </div>
                                <div className="recruit-second-inp-sub">
                                    Location  <LocationAutocomplete onSelect={handleSeekLocationSelect} />


                                </div>
                            </div>

                            <div className="recruit-border"></div>
                            <input
                                type='text'
                                className="recruit-inp"
                                placeholder='Description'
                                name="description"
                                value={seekJobData.description}
                                onChange={handleSeekJobChange}
                                required
                            />
                            <div className="recruit-border"></div>
                            <div className="recruit-second-inp">
                                <div className="recruit-second-inp-sub">
                                    Start Date <input
                                        type="date"

                                        name="startDate"
                                        value={seekJobData.startDate}
                                        onChange={handleSeekJobChange}
                                        min={new Date().toISOString().split("T")[0]} // Prevent past dates
                                        required
                                    />
                                </div>
                                <div className="recruit-second-inp-sub">
                                    End Date <input
                                        type="date"

                                        name="endDate"
                                        value={seekJobData.endDate}
                                        onChange={handleSeekJobChange}
                                        min={seekJobData.startDate || new Date().toISOString().split("T")[0]} // End date  
                                        required
                                    />

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <Modal
                    open={isTermsModalVisible}
                    closable={false}
                    footer={[
                        <Button key="accept" type="primary" onClick={handleTermsAccept}>
                            Accept
                        </Button>,
                    ]}
                    width={800}
                >
                    <TermsR />
                </Modal>

            </div>
        </>
    );
};

export default Recruitment;