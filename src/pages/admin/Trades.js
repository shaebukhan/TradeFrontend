import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import { FaBarsStaggered } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Modal, Table } from 'antd';
import axios from 'axios';

const Trades = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [trades, setTrades] = useState([]);  // List of trades from the server
    const [searchTerm, setSearchTerm] = useState("");  // Search term state
    const [filteredTrades, setFilteredTrades] = useState([]);  // Filtered trades after search
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [selectedTrade, setSelectedTrade] = useState(null);
    const [trade, setTrade] = useState("");
    const [tradeUpdated, setTradeUpdated] = useState("");
    // Toggle sidebar
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
    const getAllTradesData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/trade/m-trades`);
            if (data?.success) {
                setTrades(data?.trades);
                setFilteredTrades(data?.trades);  // Initialize filtered trades with all trades
                setTrade("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch trades when component mounts
    useEffect(() => {
        getAllTradesData();
    }, []);

    // Filter trades based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredTrades(trades);
        } else {
            const filteredData = trades.filter(trade =>
                trade.trade.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTrades(filteredData);
        }
    }, [searchTerm, trades]);

    // Handle Add Trade
    const handleAddTrade = () => {
        setIsAddModalVisible(true);
    };

    const handleAddSubmit = async (e) => {

        e.preventDefault();

        if (trade === "") {
            toast.error("Trade is Required !!");
            return;
        }

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/trade/add-trade`, { trade });
            if (data?.success) {
                toast.success('Trade added successfully');
                setIsAddModalVisible(false);
                getAllTradesData(); // Ref the data
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);

        }
    };

    // Handle Edit Trade
    const handleEditTrade = (trade) => {
        setSelectedTrade(trade);
        setIsEditModalVisible(true);
        setTradeUpdated(trade.trade);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();


        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/trade/${selectedTrade._id}`, { trade: tradeUpdated });
            if (data.success) {
                toast.success('Trade updated successfully');
                setIsEditModalVisible(false);
                getAllTradesData(); // Ref the data
            }
        } catch (error) {
            console.log(error);

        }
    };

    // Handle Delete Trade
    const handleDeleteTrade = async (tradeId) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/trade/${tradeId}`);
            if (data.success) {
                toast.success('Trade deleted successfully');
                getAllTradesData(); // Ref the data
            }
        } catch (error) {
            console.log(error);

        }
    };

    return (
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
                            placeholder='Search trades...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                        />
                    </div>
                    <div className="add-trade">
                        <button className='add-trade-btn' onClick={handleAddTrade}>+ Add Trade</button>
                    </div>
                </div>

                <div className="tbl-main">
                    <table className="simple-table">
                        <thead>
                            <tr>
                                <th>Trade</th>
                                <th>View</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrades.length > 0 ? (
                                filteredTrades.map((trade) => (
                                    <tr key={trade._id}>
                                        <td className='trade-name'>{trade.trade}</td>
                                        <td>
                                            <Link to={`trade/${trade._id}`} className='btn btn-primary'>View sub trades</Link>
                                        </td>
                                        <td>
                                            <button className='btn btn-dark' onClick={() => handleEditTrade(trade)}>Edit</button>
                                        </td>
                                        <td>
                                            <button className='btn btn-danger' onClick={() => handleDeleteTrade(trade._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No trades found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Add Trade Modal */}
                    <Modal
                        title="Add New Trade"
                        open={isAddModalVisible}
                        onCancel={() => setIsAddModalVisible(false)}
                        footer={null}
                    >
                        <form onSubmit={handleAddSubmit}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Trade"
                                name="trade"
                                value={trade}
                                onChange={(e) => setTrade(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary mt-3">
                                Add Trade
                            </button>
                        </form>
                    </Modal>

                    {/* Edit Trade Modal */}
                    <Modal
                        title="Edit Trade"
                        open={isEditModalVisible}
                        onCancel={() => setIsEditModalVisible(false)}
                        footer={null}
                    >
                        <form onSubmit={handleEditSubmit}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Trade"
                                name="trade"
                                value={tradeUpdated}
                                onChange={(e) => setTradeUpdated(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary mt-3">
                                Update Trade
                            </button>
                        </form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Trades;
