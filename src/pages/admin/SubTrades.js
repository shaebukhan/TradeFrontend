import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBarsStaggered } from "react-icons/fa6";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { Modal } from 'antd';
import axios from 'axios';
import Loader from '../../components/Loader';

const SubTrades = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSubTrades, setFilteredSubTrades] = useState([]);  // Filtered trades after search
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [trade, setTrade] = useState("");
    const [subTradeUpdated, setSubTradeUpdated] = useState("");
    const [subTrades, setSubTrades] = useState([]);
    const [subTrade, setSubTrade] = useState("");
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [image, setImage] = useState(null);  // For file upload
    const [imagePreview, setImagePreview] = useState(""); // For image preview
    const [loading, setLoading] = useState(false);

    const id = params.id;

    // Refs for file inputs
    const addFileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Check user authentication and role
    useEffect(() => {
        const token = Cookies.get('token');
        const authData = Cookies.get('auth');

        if (!token || !authData) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    // Fetch all trades data from the server
    const getAllSubTradesData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/sub-trade/sub-trades/${id}`);
            if (data?.success) {
                setSubTrades(data?.subTrades);
                setFilteredSubTrades(data?.subTrades);  // Initialize filtered trades with all trades
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch sub-trades');
        }
    };

    // Fetch trades when component mounts
    useEffect(() => {
        getAllSubTradesData();
    }, []);

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

    // Fetch single trade when component mounts
    useEffect(() => {
        getSingleTradesData();
    }, []);

    const handleAddSubTrade = () => {
        setIsAddModalVisible(true);
        setSubTrade("");
        setImage(null);
        setImagePreview("");
        if (addFileInputRef.current) {
            addFileInputRef.current.value = null; // Reset file input
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        if (subTrade.trim() === "") {
            toast.error("Sub Trade is required!");
            return;
        } else {
            setLoading(true);
        }

        const formData = new FormData();
        formData.append('profession', subTrade);
        formData.append('image', image);  // Append the file
        formData.append('tradeId', id);  // Append the tradeId

        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/sub-trade/add-sub-trade`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );
            if (data?.success) {
                toast.success('Sub Trade added successfully');
                setIsAddModalVisible(false);
                getAllSubTradesData(); // Refresh the data
                // Reset form fields
                setSubTrade("");
                setImage(null);
                setImagePreview("");
                // Reset file input
                if (addFileInputRef.current) {
                    addFileInputRef.current.value = null;
                }
            } else {
                toast.error(data.message || 'Failed to add Sub Trade');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error adding Sub Trade');
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error (e.g., redirect to login)
                Cookies.remove('token'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
        } finally {
            setLoading(false); // Hide loader
        }
    };

    // Handle Edit Trade
    const handleEditSubTrade = (subtrade) => {
        setSelectedTrade(subtrade);
        setIsEditModalVisible(true);
        setSubTradeUpdated(subtrade.profession);  // Ensure this matches the backend field
        setImagePreview(subtrade.image);  // Set existing image for preview
        setImage(null); // Reset image state
        if (editFileInputRef.current) {
            editFileInputRef.current.value = null; // Reset file input
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (subTradeUpdated === "") {
            toast.error("Profession is required!");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('profession', subTradeUpdated);
        if (image) formData.append('image', image);  // Only append if a new image is uploaded

        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/sub-trade/edit/${selectedTrade._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );
            if (data.success) {
                toast.success('Sub Trade updated successfully');
                setIsEditModalVisible(false);
                getAllSubTradesData(); // Refresh the data
                // Reset form fields
                setSubTradeUpdated("");
                setImage(null);
                setImagePreview("");
                // Reset file input
                if (editFileInputRef.current) {
                    editFileInputRef.current.value = null;
                }
            } else {
                toast.error(data.message || 'Failed to update Sub Trade');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating Sub Trade');
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error (e.g., redirect to login)
                Cookies.remove('token'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
        } finally {
            setLoading(false); // Hide loader
        }
    };


    // Handle Delete Trade
    const handleDeleteSubTrade = async (subtrade) => {
        if (!window.confirm("Are you sure you want to delete this Sub Trade?")) return;

        setLoading(true);

        try {
            const token = Cookies.get('token'); // Retrieve the token from cookies
            const { data } = await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/sub-trade/delete/${subtrade._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );
            if (data.success) {
                toast.success('Sub Trade deleted successfully');
                getAllSubTradesData(); // Refresh the data
            } else {
                toast.error(data.message || 'Failed to delete Sub Trade');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error deleting Sub Trade');
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error (e.g., redirect to login)
                Cookies.remove('token'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
        } finally {
            setLoading(false); // Hide loader
        }
    };

    // Handle Image Preview for file upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            // Validate file type and size (optional)
            if (!file.type.startsWith('image/')) {
                toast.error("Only image files are allowed!");
                setImage(null);
                setImagePreview("");
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB!");
                setImage(null);
                setImagePreview("");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview("");
        }
    };

    // Filter sub-trades based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredSubTrades(subTrades);
        } else {
            const filtered = subTrades.filter((trade) =>
                trade.profession.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSubTrades(filtered);
        }
    }, [searchTerm, subTrades]);

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

                    <div className="search-add-main">
                        <div className="search-main">
                            <input
                                type="text"
                                className='search-inp'
                                placeholder='Search Sub Trades...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                            />
                        </div>
                        <div className="add-trade">
                            <button className='add-trade-btn' onClick={handleAddSubTrade}>+ Add Sub Trade</button>
                        </div>
                    </div>

                    <h3 className='mt-3'>{trade.trade}</h3>
                    <div className="tbl-main">
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>Sub Trade</th>
                                    <th>Image</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubTrades.length > 0 ? (
                                    filteredSubTrades.map((subtrade) => (
                                        <tr key={subtrade._id}>
                                            <td className='trade-name'>{subtrade.profession}</td>
                                            <td className='trade-image'>
                                                <img src={subtrade.image} alt="Trade" style={{ width: '50px', height: '50px' }} />
                                            </td>
                                            <td>
                                                <button className='btn btn-dark' onClick={() => handleEditSubTrade(subtrade)}>Edit</button>
                                            </td>
                                            <td>
                                                <button className='btn btn-danger' onClick={() => handleDeleteSubTrade(subtrade)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No Sub Trades found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Add Sub Trade Modal */}
                        <Modal
                            title="Add New Sub Trade"
                            open={isAddModalVisible}
                            onCancel={() => setIsAddModalVisible(false)}
                            footer={null}
                        >
                            <form onSubmit={handleAddSubmit}>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Sub Trade"
                                    name="subTrade"
                                    value={subTrade}
                                    onChange={(e) => setSubTrade(e.target.value)}
                                    required
                                />
                                <input
                                    type="file"
                                    className="form-control mb-3"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    ref={addFileInputRef} // Assigning the ref
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />
                                )}
                                <br />
                                <button type="submit" className="btn btn-primary mt-3">
                                    Add Sub Trade
                                </button>
                            </form>
                        </Modal>

                        {/* Edit Sub Trade Modal */}
                        <Modal
                            title="Edit Sub Trade"
                            open={isEditModalVisible}
                            onCancel={() => setIsEditModalVisible(false)}
                            footer={null}
                        >
                            <form onSubmit={handleEditSubmit}>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Sub Trade"
                                    name="subTradeUpdated"
                                    value={subTradeUpdated}
                                    onChange={(e) => setSubTradeUpdated(e.target.value)}
                                    required
                                />
                                <input
                                    type="file"
                                    className="form-control mb-3"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    ref={editFileInputRef} // Assigning the ref
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />
                                )}
                                <br />
                                <button type="submit" className="btn btn-primary mt-3">
                                    Update Sub Trade
                                </button>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );

};

export default SubTrades;
