import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import { FaBarsStaggered } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Modal, Pagination, Select, Input, DatePicker } from 'antd';
import axios from 'axios';
import Loader from '../../components/Loader';

const { Option } = Select;
const { TextArea } = Input;

const JobSeekers = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [jobSeekers, setJobSeekers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [loading, setLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentJobSeek, setCurrentJobSeek] = useState(null);
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
    const getAllJobSeekersData = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/payment/jobseekers`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
            if (data?.success) {
                const sortedJobSeekers = data.jobseekers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setJobSeekers(sortedJobSeekers);
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
        getAllJobSeekersData();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const openEditModal = (jobSeek) => {
        setCurrentJobSeek(jobSeek);
        setEditFormData({
            title: jobSeek.title,
            description: jobSeek.description,
            salary: jobSeek.salary,
            startDate: jobSeek.startDate,
            endDate: jobSeek.endDate,
            status: jobSeek.status
        });
        setIsEditModalVisible(true);
    };

    const handleUpdateRecruitment = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/payment/edit-jobseek/${currentJobSeek._id}`,
                {
                    ...editFormData,
                    startDate: editFormData.startDate.format('YYYY-MM-DD'),
                    endDate: editFormData.endDate.format('YYYY-MM-DD')
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAllJobSeekersData();
                setIsEditModalVisible(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error updating recruitment');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJobSeek = async (recruitmentId) => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/payment/jobseek-delete/${recruitmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );

            if (data.success) {
                toast.success("Data Deleted Successfully");
                getAllJobSeekersData();
            }
        } catch (error) {
            console.log(error);
            toast.error('Error deleting listing');
        } finally {
            setLoading(false);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentJobSeekers = jobSeekers.slice(startIndex, endIndex);

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
                        <h3 className="mb-5">All JobSeekers</h3>

                        <div className="listing-sub">
                            {currentJobSeekers && currentJobSeekers.length > 0 ? (
                                currentJobSeekers.map((jobSeek) => (
                                    <div className="listing-card" key={jobSeek._id}>
                                        <h6 className="listing-card-title">{jobSeek?.userId?.name}</h6>
                                        <div className="listing-card-padd">
                                            <h6>Title : {jobSeek?.title}</h6>
                                            <h6>Salary : {jobSeek?.salary}</h6>
                                            <h6>Location : {jobSeek?.location}</h6>
                                            <h6>Start Date : {jobSeek?.startDate}</h6>
                                            <h6>End Date : {jobSeek?.endDate}</h6>
                                            <h6>Description : {jobSeek?.description}</h6>
                                            <h6>Total Price : €{jobSeek?.price}</h6>

                                            {
                                                jobSeek.status === "pending" ? <>
                                                    <p className="status-text">
                                                        Status :   {jobSeek.status === "pending" ? (
                                                            <span className=" text-danger">Pending</span>
                                                        ) : (
                                                            <span className="text-success">Approved</span>
                                                        )}
                                                    </p>
                                                    <div className="card-actions">
                                                        <button className='btn btn-primary me-3' onClick={() => openEditModal(jobSeek)}>Edit</button>
                                                        <button className='btn btn-danger' danger onClick={() => handleDeleteJobSeek(jobSeek._id)}>Delete</button>
                                                    </div>
                                                </> : <p className="status-text">
                                                    {jobSeek.status === "pending" ? (
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
                                    <h2>No Job Seekers available</h2>
                                </div>
                            )}
                        </div>

                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={jobSeekers.length}
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

                    <DatePicker
                        placeholder="Start Date"
                        value={editFormData.startDate}
                        onChange={(date) => setEditFormData({ ...editFormData, startDate: date })}
                        className="mb-3"
                        style={{ width: '100%' }}
                    />
                    <DatePicker
                        placeholder="End Date"
                        value={editFormData.endDate}
                        onChange={(date) => setEditFormData({ ...editFormData, endDate: date })}
                        className="mb-3"
                        style={{ width: '100%' }}
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

export default JobSeekers;