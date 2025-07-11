import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import { FaBarsStaggered } from "react-icons/fa6";
import axios from 'axios';
import Loader from '../../components/Loader';
const Admin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tradesCount, setTradesCount] = useState(0);
    const [complaintsCount, setComplaintsCount] = useState(0);
    const [approvedListingsCount, setApprovedListingsCount] = useState(0);
    const [pendingListingsCount, setPendingListingsCount] = useState(0);
    const [approvedRecruitmentCount, setApprovedRecruitmentCount] = useState(0);
    const [pendingRecruitmentCount, setPendingRecruitmentCount] = useState(0);
    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Check user authentication and role
    const token = Cookies.get('token');

    const getAllTradesData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/trade/m-trades`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
            if (data?.success) {
                setTradesCount(data?.trades.length);  // Store trades count
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch all complaints data from the server
    const getAllComplaintsData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/complaints`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
            if (data?.success) {
                const sortedComplaints = data.complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setComplaintsCount(sortedComplaints.length); // Store complaints count
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch all listings data from the server
    const getAllListingsData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/sub-trade/all-listings`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
            if (data?.success) {
                setApprovedListingsCount(data?.Listings.filter(item => item.status === 1).length);  // Count approved  
                setPendingListingsCount(data?.Listings.filter(item => item.status === 0).length);  // Count pending listings
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getAllRecruitmentData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/recruitments`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
            if (data?.success) {
                setApprovedRecruitmentCount(data?.recruitements.filter(item => item.status === "approved").length);  // Count approved  
                setPendingRecruitmentCount(data?.recruitements.filter(item => item.status === "pending").length);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        getAllTradesData();
        getAllComplaintsData();
        getAllListingsData();
        getAllRecruitmentData();
    }, []);
    return (
        <>
            {loading && <Loader />}
            <div className="wrapper d-flex align-items-stretch">
                <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                {/* Page Content */}
                <div id="content" className="px-2 pt-5">
                    <button type="button" id="openSidebar" onClick={toggleSidebar} className="bars-btn">
                        <FaBarsStaggered />
                    </button>
                    <h2 className='mb-3'>Dashboard</h2>
                    <div className="admin-dash-main">
                        <div className="admin-card">
                            <h4 className="adin-trade-title">
                                Total Trades
                            </h4>
                            <h4 className="adin-trade-title">
                                {tradesCount}
                            </h4>
                        </div>

                        <div className="admin-card">
                            <h4 className="adin-trade-title">
                                Approved Trades People
                            </h4>
                            <h4 className="adin-trade-title">
                                {approvedListingsCount}
                            </h4>
                        </div>

                        <div className="admin-card">
                            <h4 className="adin-trade-title">
                                Pending  Trades People
                            </h4>
                            <h4 className="adin-trade-title">
                                {pendingListingsCount}
                            </h4>
                        </div>
                        <div className="admin-card">
                            <h4 className="adin-trade-title">
                                Pending  Recruitments
                            </h4>
                            <h4 className="adin-trade-title">
                                {pendingRecruitmentCount}
                            </h4>
                        </div>
                        <div className="admin-card">
                            <h4 className="adin-trade-title">
                                Approved  Recruitments
                            </h4>
                            <h4 className="adin-trade-title">
                                {approvedRecruitmentCount}
                            </h4>
                        </div>
                        <div className="admin-card">
                            <h4 className="adin-trade-title">
                                Pending  Jobseekers
                            </h4>
                            <h4 className="adin-trade-title">
                                {pendingRecruitmentCount}
                            </h4>
                        </div>
                        <div className="admin-card">
                            <h4 className="adin-trade-title">
                                Approved  Jobseekers
                            </h4>
                            <h4 className="adin-trade-title">
                                {approvedRecruitmentCount}
                            </h4>
                        </div>
                        <div className="admin-card">
                            <h4 className="adin-trade-title">
                                Total  Complaints
                            </h4>
                            <h4 className="adin-trade-title">
                                {complaintsCount}
                            </h4>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Admin;
