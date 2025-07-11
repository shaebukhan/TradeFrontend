import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LocationAutocomplete = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [noResults, setNoResults] = useState(false); // New state for handling no results

    // Fetch location suggestions from OpenStreetMap (Nominatim)
    const fetchLocations = async (searchText) => {
        if (!searchText) {
            setSuggestions([]);
            setNoResults(false);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: searchText,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5,
                }
            });

            if (response.data.length === 0) {
                setNoResults(true);
                setSuggestions([]);
            } else {
                setNoResults(false);
                setSuggestions(response.data);
            }
            setShowDropdown(true);
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
            toast.error("Failed to fetch location suggestions");
        } finally {
            setLoading(false);
        }
    };

    // Handle user input (with debounce)
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            setTimeout(() => fetchLocations(value), 300); // Debounce API calls
        } else {
            setSuggestions([]);
            setShowDropdown(false);
            setNoResults(false);
        }
    };

    // Handle location selection
    const handleSelect = (location) => {
        setQuery(location.display_name);
        setSuggestions([]);
        setShowDropdown(false);
        setNoResults(false);
        onSelect({
            label: location.display_name,
            latitude: location.lat,
            longitude: location.lon
        });
    };

    return (
        <div className="autocomplete-container">
            <input
                type="text"
                className="autocomplete-input"
                placeholder="Enter location"
                value={query}
                onChange={handleChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {loading && <p className="loading-text">Loading...</p>}
            {showDropdown && (
                <ul className="suggestions-list">
                    {noResults ? (
                        <li className="no-results">Location not found</li>
                    ) : (
                        suggestions.map((location) => (
                            <li key={location.place_id} onClick={() => handleSelect(location)}>
                                {location.display_name}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default LocationAutocomplete;
