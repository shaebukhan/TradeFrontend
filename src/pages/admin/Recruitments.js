import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import { FaBarsStaggered } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Modal, Pagination, Select, Input } from 'antd'; // Remove DatePicker import
import axios from 'axios';
import Loader from '../../components/Loader';

const { Option } = Select;
const { TextArea } = Input;

const Recruitments = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [recruitments, setRecruitments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [loading, setLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentRecruitment, setCurrentRecruitment] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        salary: '',
        location: '',
        startDate: '',
        endDate: '',
        status: ''
    });

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const getAllRecruitmentData = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/recruitments`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
            if (data?.success) {
                const sortedRecruitments = data.recruitements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecruitments(sortedRecruitments);
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

    useEffect(() => {
        getAllRecruitmentData();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteRecruitment = async (recruitmentId) => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/payment/jobpost-delete/${recruitmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );
            if (data.success) {
                toast.success("Data Deleted Successfully");
                getAllRecruitmentData();
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

    const openEditModal = (recruitment) => {
        setCurrentRecruitment(recruitment);
        setEditFormData({
            title: recruitment.title,
            description: recruitment.description,
            salary: recruitment.salary,
            location: recruitment.location,
            startDate: recruitment.startDate, // Directly use the date string
            endDate: recruitment.endDate, // Directly use the date string
            status: recruitment.status
        });
        setIsEditModalVisible(true);
    };

    const handleUpdateRecruitment = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/payment/edit-recruitment/${currentRecruitment._id}`,
                {
                    ...editFormData,
                    startDate: editFormData.startDate, // No need to format, already in YYYY-MM-DD
                    endDate: editFormData.endDate // No need to format, already in YYYY-MM-DD
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAllRecruitmentData();
                setIsEditModalVisible(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error updating recruitment');
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error (e.g., redirect to login)
                Cookies.remove('token'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
        } finally {
            setLoading(false);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRecruitments = recruitments.slice(startIndex, endIndex);

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
                        <h3 className="mb-5">All Recruitments</h3>

                        <div className="listing-sub">
                            {currentRecruitments && currentRecruitments.length > 0 ? (
                                currentRecruitments.map((recruitment) => (
                                    <div className="listing-card" key={recruitment._id}>
                                        <h6 className="listing-card-title">{recruitment?.userId?.name}</h6>
                                        <div className="listing-card-padd">
                                            <h6>Title : {recruitment?.title}</h6>
                                            <h6>Salary : {recruitment?.salary}</h6>
                                            <h6>Location : {recruitment?.location}</h6>
                                            <h6>Start Date : {recruitment?.startDate}</h6>
                                            <h6>End Date : {recruitment?.endDate}</h6>
                                            <h6>Description : {recruitment?.description}</h6>
                                            <h6>Total Price : €{recruitment?.price}</h6>

                                            {
                                                recruitment.status === "pending" ? <>
                                                    <p className="status-text">
                                                        Status :   {recruitment.status === "pending" ? (
                                                            <span className=" text-danger">Pending</span>
                                                        ) : (
                                                            <span className="text-success">Approved</span>
                                                        )}
                                                    </p>
                                                    <div className="card-actions">
                                                        <button className='btn btn-primary me-3' onClick={() => openEditModal(recruitment)}>Edit</button>
                                                        <button className='btn btn-danger' danger onClick={() => handleDeleteRecruitment(recruitment._id)}>Delete</button>
                                                    </div>
                                                </> : <p className="status-text">
                                                    {recruitment.status === "pending" ? (
                                                        <span className=" text-danger">Pending</span>
                                                    ) : (
                                                        <span className="text-success">Approved</span>
                                                    )}
                                                </p>
                                            }

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data-message mt-4">
                                    <h2>No Recruitments available</h2>
                                </div>
                            )}
                        </div>

                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={recruitments.length}
                            onChange={handlePageChange}
                            className="mt-4"
                        />
                    </div>
                </div>

                <Modal
                    open={isEditModalVisible}
                    onOk={handleUpdateRecruitment}
                    onCancel={() => setIsEditModalVisible(false)}
                    okText="Update"
                    cancelText="Cancel"
                >
                    <h3 className='mb-3'>Edit Recruitment</h3>
                    <Input
                        placeholder="Title"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        className="mb-3"
                    />
                    <TextArea
                        placeholder="Description"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        className="mb-3"
                    />
                    <Input
                        placeholder="Salary"
                        value={editFormData.salary}
                        onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                        className="mb-3"
                    />

                    {/* Replace DatePicker with HTML date input */}
                    <input
                        type="date"
                        value={editFormData.startDate}
                        onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                        className="mb-3 form-control"
                    />
                    <input
                        type="date"
                        value={editFormData.endDate}
                        onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                        className="mb-3 form-control"
                    />
                    <Select
                        value={editFormData.status}
                        onChange={(value) => setEditFormData({ ...editFormData, status: value })}
                        style={{ width: '100%' }}
                    >
                        <Option value={"pending"}>Pending</Option>
                        <Option value={"approved"}>Approved</Option>
                    </Select>
                </Modal>
            </div>
        </>
    );
};

export default Recruitments;