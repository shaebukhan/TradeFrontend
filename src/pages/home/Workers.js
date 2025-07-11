import React, { useEffect, useState } from 'react';
import ProfessionCard from '../../components/ProfessionCard';
import { Link, useParams } from 'react-router-dom';
import Chat from '../../components/Chat';
import NavS from '../../components/NavS';
import axios from 'axios';
import { toast } from 'react-toastify';

const Workers = () => {
    const { id } = useParams();
    const [subTrades, setSubTrades] = useState([]);
    const [filteredSubTrades, setFilteredSubTrades] = useState([]);  // Filtered trades after search
    const [trade, setTrade] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Fetch all sub-trades data from the server
    const getAllSubTradesData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/sub-trade/sub-trades/${id}`);
            if (data?.success) {
                setSubTrades(data.subTrades);
                setFilteredSubTrades(data.subTrades);  // Initialize filtered trades with all trades
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch sub-trades');
        }
    };

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

    // Fetch trades when component mounts
    useEffect(() => {
        getAllSubTradesData();
        getSingleTradesData();
    }, [id]);


    // Handle search functionality
    const handleSearch = (searchTerm) => {
        if (searchTerm) {
            const results = subTrades.filter(subTrade =>
                subTrade.profession && subTrade.image &&
                subTrade.profession.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);  // Reset search results if no term
        }
    };




    return (
        <>
            <NavS onSearch={handleSearch} />
            <div className="workers-main">

                {searchResults.length > 0 ? (<>
                    <h2 className="mb-4">{trade.trade}</h2>
                    <div className="profession-grid">
                        {searchResults.map((profession) => (
                            <Link to={`/details/${profession.id}`} key={profession._id}>
                                <ProfessionCard image={profession.image} profession={profession.profession} />
                            </Link>
                        ))}
                    </div>
                </>
                ) : (

                    <>
                        <h2 className="mb-4">{trade.trade}</h2>
                        <div className="profession-grid">
                            {filteredSubTrades.map(profession => (
                                <Link to={`/details/${profession._id}`} key={profession._id}>
                                    <ProfessionCard image={profession.image} profession={profession.profession} />
                                </Link>
                            ))}
                        </div>
                    </>

                )}
            </div>
            <Chat />
        </>
    );
};

export default Workers;
