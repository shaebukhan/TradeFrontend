import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import './sidebar.css';
import SignLogo from "../../assets/images/logo.jpg";
import { MdDashboardCustomize } from "react-icons/md";
import Cookies from 'js-cookie';
import { AiOutlineLogout } from "react-icons/ai";
import axios from 'axios';
import { useAuth } from '../../Context/authContext';
import { toast } from 'react-toastify';
import { IoMdApps } from "react-icons/io";
import { FaNetworkWired, FaPeopleArrows } from 'react-icons/fa';
import { useEffect } from 'react';
import { MdSettingsSuggest } from "react-icons/md";
import { GiScarecrow } from "react-icons/gi";
const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activePath, setActivePath] = useState('');
    const [auth, setAuth] = useAuth();


    const handleLogout = async () => {
        try {
            // Send POST request to the server to log out
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/logout`);

            if (res.data.success) {
                // Update auth state and remove cookies
                setAuth({
                    ...auth, user: null, token: ""
                });

                Cookies.remove("token"); // Removes the 'token' cookie
                Cookies.remove("auth");  // Removes the 'auth' cookie

                // Show a logout notification
                toast.info("Logged out successfully");

                // Redirect to the login page
                navigate('/login');
            } else {
                toast.error("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);

        }
    };

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    return (
        <nav id="sidebar" className={sidebarOpen ? "active" : ""}>
            <div className="custom-menu">
                <button type="button" id="closeSidebar" onClick={toggleSidebar}>
                    <IoClose />
                </button>
            </div>

            <div className="py-2">
                <div className="my-2">
                    <Link to="/dashboard/admin">
                        <img className='sidebar-logo' src={SignLogo} alt="logo" />
                    </Link>
                </div>

                <ul className="list-unstyled components mb-5">
                    <li className={activePath === '/dashboard/admin' ? 'active-sidebar' : ''} >
                        <Link to="/dashboard/admin">
                            <MdDashboardCustomize className="mr-3" /> Dashboard
                        </Link>
                    </li>
                    <li className={activePath === '/dashboard/admin/trades' ? 'active-sidebar' : ''}>
                        <Link to="/dashboard/admin/trades">
                            <FaNetworkWired className="mr-3" />  All  Trades
                        </Link>
                    </li>
                    <li className={activePath === '/dashboard/admin/listings' ? 'active-sidebar' : ''}>
                        <Link to="/dashboard/admin/listings">
                            <FaPeopleArrows className="mr-3" /> Trades People
                        </Link>
                    </li>
                    <li className={activePath === '/dashboard/admin/recruitements' ? 'active-sidebar' : ''}>
                        <Link to="/dashboard/admin/recruitements">
                            <GiScarecrow className="mr-3" /> Recruitements
                        </Link>
                    </li>
                    <li className={activePath === '/dashboard/admin/jobseekers' ? 'active-sidebar' : ''}>
                        <Link to="/dashboard/admin/jobseekers">
                            <IoMdApps className="mr-3" /> Jobseekers
                        </Link>
                    </li>
                    <li className={activePath === '/dashboard/admin/complaints' ? 'active-sidebar' : ''}>
                        <Link to="/dashboard/admin/complaints">
                            <MdSettingsSuggest className="mr-3" />  All Complaints
                        </Link>
                    </li>
                    <li>
                        <Link onClick={() => {
                            handleLogout();

                        }}>
                            <AiOutlineLogout className="mr-3" /> Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;
