import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import { FaBarsStaggered } from "react-icons/fa6";

import axios from 'axios';

const Complaints = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [complaints, setComplaints] = useState([]);  // List of trades from the server
    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    // Fetch all trades data from the server
    const getAllComplaintsData = async () => {
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/complaints`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
            if (data?.success) {
                const sortedComplaints = data.complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setComplaints(sortedComplaints);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch trades when component mounts
    useEffect(() => {
        getAllComplaintsData();
    }, []);

    return (
        <div className="wrapper d-flex align-items-stretch">
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            {/* Page Content */}
            <div id="content" className="px-2 pt-5">
                <button type="button" id="openSidebar" onClick={toggleSidebar} className="bars-btn">
                    <FaBarsStaggered />
                </button>
                <h1>Complaints</h1>
                <div className="tbl-main">
                    <table className="simple-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.length > 0 ? (
                                complaints.map((complain) => (
                                    <tr key={complain._id}>
                                        <td className='trade-name'>{complain.name}</td>
                                        <td className='trade-name'>{complain.email}</td>
                                        <td className='trade-name'>{complain.subject}</td>
                                        <td className='trade-name'>{complain.message}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No Complaints found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default Complaints;
