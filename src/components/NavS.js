import { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import Logo from "../assets/images/logo.jpg";

const NavS = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Call onSearch to pass the search query up to the parent
        onSearch(value);
    };

    return (
        <>
            <div className="navbarr">
                <Link to="/">
                    <img className="nav-logo" src={Logo} alt="Logo" />
                </Link>
                <div className="search-main">
                    <input
                        type="text"
                        className="search-inp"
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={handleSearch}  // Update the search term on input change
                    />
                    <span className="search-icon">
                        <IoSearchSharp />
                    </span>
                </div>
            </div>
        </>
    );
};

export default NavS;



