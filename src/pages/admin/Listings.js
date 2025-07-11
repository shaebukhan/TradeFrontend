import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import { FaBarsStaggered } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Modal, Pagination, Select } from 'antd';
import axios from 'axios';
import Loader from '../../components/Loader';

const { Option } = Select;

const Listings = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [listings, setListings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [loading, setLoading] = useState(false);
    // Modal state for editing status
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentListing, setCurrentListing] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };



    // Fetch all listings data from the server
    const getAllListingsData = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/sub-trade/all-listings`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
            if (data?.success) {
                const sortedListings = data.Listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setListings(sortedListings);
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error (e.g., redirect to login)
                Cookies.remove('token'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch listings when component mounts
    useEffect(() => {
        getAllListingsData();
    }, []);

    // Handle Pagination change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle Delete Listing
    const handleDeleteListing = async (listingId) => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/sub-trade/worker-delete/${listingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );
            if (data.success) {
                toast.success('Listing deleted successfully');
                getAllListingsData(); // Refresh the listings
            }
        } catch (error) {
            console.log(error);
            toast.error('Error deleting listing');
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error (e.g., redirect to login)
                Cookies.remove('token'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
        } finally {
            setLoading(false);
        }
    };

    // Open Edit Modal for a listing
    const openEditModal = (listing) => {
        setCurrentListing(listing);
        setNewStatus(listing.status);
        setIsEditModalVisible(true);
    };

    // Handle updating the listing's status
    const handleUpdateStatus = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/sub-trade/worker-update/${currentListing._id}`,
                {
                    status: newStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAllListingsData();
                setIsEditModalVisible(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error updating status');
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error (e.g., redirect to login)
                Cookies.remove('token'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
        } finally {
            setLoading(false);
        }
    };

    // Paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentListings = listings.slice(startIndex, endIndex);

    return (
        <>
            {loading && <Loader />}
            <div className="wrapper d-flex align-items-stretch">
                <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

                <div id="content" className="px-2 pt-5">
                    <button type="button" id="openSidebar" onClick={toggleSidebar} className="bars-btn">
                        <FaBarsStaggered />
                    </button>

                    <div className="listing-sub-main">
                        <h3 className="mb-5">All Trade People</h3>

                        <div className="listing-sub">
                            {currentListings && currentListings.length > 0 ? (
                                currentListings.map((listing) => (
                                    <div className="listing-card" key={listing._id}>
                                        <h6 className="listing-card-title">{listing.companyName}</h6>
                                        <div className="listing-card-padd">
                                            <h5>Location : {listing.location}</h5>
                                            <ul className="">
                                                {listing.services.map((service, index) => (
                                                    <li key={index}>{service}</li>
                                                ))}
                                            </ul>


                                            {
                                                listing.status === 0 ? <>
                                                    <p className="status-text">
                                                        {listing.status === 0 ? (
                                                            <span className="btn btn-outline-info">Pending</span>
                                                        ) : (
                                                            <span className="btn btn-success">Approved</span>
                                                        )}
                                                    </p>
                                                    <div className="card-actions">
                                                        {/* Edit Button */}
                                                        <button className='btn btn-primary me-3' onClick={() => openEditModal(listing)}>Edit</button>

                                                        {/* Delete Button */}
                                                        <button className='btn btn-danger' danger onClick={() => handleDeleteListing(listing._id)}>Delete</button>
                                                    </div>
                                                </> : <p className="status-text">
                                                    {listing.status === 0 ? (
                                                        <span className="btn btn-outline-info">Pending</span>
                                                    ) : (
                                                        <span className="btn btn-success">Approved</span>
                                                    )}
                                                </p>
                                            }

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data-message mt-4">
                                    <h2>No listings available</h2>
                                </div>
                            )}
                        </div>

                        {/* Pagination Component */}
                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={listings.length}
                            onChange={handlePageChange}
                            className="mt-4"
                        />
                    </div>
                </div>

                {/* Edit Modal for Updating Status */}
                <Modal

                    open={isEditModalVisible}
                    onOk={handleUpdateStatus}
                    onCancel={() => setIsEditModalVisible(false)}
                    okText="Update"
                    cancelText="Cancel"
                >
                    <h3 className='mb-3'>{currentListing?.companyName}</h3>
                    <Select
                        value={newStatus}
                        onChange={(value) => setNewStatus(value)}
                        style={{ width: '100%' }}
                    >
                        <Option value={0}>Pending</Option>
                        <Option value={1}>Approved</Option>
                    </Select>
                </Modal>
            </div>
        </>
    );
};

export default Listings;
