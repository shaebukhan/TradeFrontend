import React, { useEffect, useState } from 'react';
import { HiArrowSmRight } from "react-icons/hi";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
const HomeSec = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [trades, setTrades] = useState([]);
    // Toggle the dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Fetch all trades data from the server
    const getAllTradesData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/trade/m-trades`);
            if (data?.success) {
                setTrades(data?.trades);

            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch trades when component mounts
    useEffect(() => {
        getAllTradesData();
    }, []);

    const authDataString = Cookies.get('auth');
    const auth = authDataString ? JSON.parse(authDataString) : null;


    return (
        <>
            <div className="home-sec-left-sec-main">
                <Link to={"/contact"} className="home-sec-left-sec-main-card">Help & Feedback</Link>
                <div onClick={toggleDropdown} className="home-sec-left-sec-main-card position-relative">List yourself
                    {isOpen && (
                        <div className="dropdown-menu-sub " style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff' }}>
                            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                                {trades.map((trade) => (
                                    <li key={trade._id} > <Link to={`/workers/${trade._id}`} className="nav-link">{trade.trade}</Link></li>
                                ))}

                            </ul>
                        </div>
                    )}
                </div>


                <div className="home-sec-left-sec-main-card">Advertise</div>
                <Link to={`/dashboard/${auth?.user.role === 1 ? "admin" : "user"}`} className="home-sec-left-sec-main-card">Dashboard</Link>
            </div>
            <div className="home-sec-main">
                <div className="home-sec-left">

                    <div className="trade-person">
                        <h2 className="trade-person-title">Find A TradesPerson</h2>
                        <div className="jobs-trade-main">
                            {trades.map((category) => (
                                <div className="job-trade" key={category._id}>
                                    <Link to={`/workers/${category._id}`}>
                                        <span className="job-trade-text">{category.trade}</span>
                                        <span className="job-trade-icon">
                                            <HiArrowSmRight />
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="home-sec-right">
                    <h2 className="trade-person-title">Recruitment</h2>
                    <div className="jobs-trade-main">

                        {trades.map((job) => (
                            <div className="job-trade" key={job._id}>
                                <Link to={`/recruitment/${job._id}`}>
                                    <span className='job-trade-text'>Jobs</span>
                                    <span className='job-trade-icon'><HiArrowSmRight /></span>
                                </Link>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeSec;