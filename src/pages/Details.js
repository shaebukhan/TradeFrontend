import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaStar } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Pagination } from 'antd';
import Loader from "../components/Loader";

const Details = () => {
    const { id } = useParams();
    const [subTrade, setSubTrade] = useState("");
    const [loading, setLoading] = useState(false);
    const [workersData, setWorkersData] = useState([]);
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Fetch single trade data
    const getSingleSubTradesData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/sub-trade/sub-trade/${id}`);
            if (data?.success) {
                setSubTrade(data.subTrade);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch workers data
    const getAllWorkersData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/sub-trade/get-workers/${id}`);
            if (data?.success) {
                // Try to get user's live location
                try {
                    const { latitude: userLat, longitude: userLon } = await getLiveLocation();
                    // Filter workers within 10km if live location is available
                    const filteredWorkers = filterWorkersWithinRange(data.workerSpecial, userLat, userLon, 10);
                    setWorkersData(filteredWorkers);
                    setFilteredWorkers(filteredWorkers);
                } catch (error) {
                    // If live location is denied/unavailable, show all workers
                    setWorkersData(data.workerSpecial);
                    setFilteredWorkers(data.workerSpecial);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Get live location
    const getLiveLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    };

    // Calculate distance between two coordinates
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (degrees) => degrees * (Math.PI / 180);
        const R = 6371; // Radius of the Earth in km
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    // Filter workers within a specific range
    const filterWorkersWithinRange = (workers, userLat, userLon, rangeKm) => {
        return workers.filter((worker) => {
            const workerLat = parseFloat(worker.latitude);
            const workerLon = parseFloat(worker.longitude);
            const distance = calculateDistance(userLat, userLon, workerLat, workerLon);
            return distance <= rangeKm;
        }).sort((a, b) => {
            // Sort workers by proximity
            const distanceA = calculateDistance(userLat, userLon, parseFloat(a.latitude), parseFloat(a.longitude));
            const distanceB = calculateDistance(userLat, userLon, parseFloat(b.latitude), parseFloat(b.longitude));
            return distanceA - distanceB;
        });
    };

    // Filter workers by services
    const filterWorkersByServices = (workers, searchTerm) => {
        if (!searchTerm) return workers;
        return workers.filter((worker) =>
            worker.services.some((service) =>
                service.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    // Handle search term change
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = filterWorkersByServices(workersData, e.target.value);
        setFilteredWorkers(filtered);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Fetch data when component mounts
    useEffect(() => {
        getSingleSubTradesData();
        getAllWorkersData();
    }, [id]);

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentWorkers = filteredWorkers.slice(startIndex, endIndex);

    return (
        <>
            {loading && <Loader />}
            <div className="d-flex align-items-center justify-content-between">
                <Navbar />
                <Link to={`/list-me/${id}`} className='list-youself'>List Yourself</Link>
            </div>

            <div className="details-sub-main">
                <div className="d-flex justify-content-between">
                    <h3 className='mb-5'>{subTrade.profession}</h3>
                    <div className="search-main">
                        <input
                            type="text"
                            className='search-inp'
                            placeholder='Search by services...'
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div className="details-sub">
                    {currentWorkers.length > 0 ? (
                        currentWorkers.map((work) => (
                            <div className="details-card" key={work._id}>
                                <h6 className='details-card-title'>{work.companyName}</h6>
                                <ul className='d-card-ul'>
                                    {work.services.map((service, index) => (
                                        <li key={index}>{service}</li>
                                    ))}
                                </ul>
                                {work.reviews === 'yes' && (
                                    <div className="stars-main">
                                        <FaStar className='details-star' />
                                        <FaStar className='details-star' />
                                        <FaStar className='details-star' />
                                        <FaStar className='details-star' />
                                        <FaStar className='details-star' />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-data-message mt-4">
                            <h2>No professionals available</h2>
                        </div>
                    )}
                </div>

                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredWorkers.length}
                    onChange={handlePageChange}
                    className="mt-4"
                />
            </div>
        </>
    );
};

export default Details;