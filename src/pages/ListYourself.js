import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, Select, Checkbox, Form, message, Modal } from 'antd';
import Loader from "../components/Loader";
import Terms from '../components/Terms';

const ListYourself = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [city, setCity] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [ipAddress, setIpAddress] = useState('');
    const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const inputRef = useRef(null);

    const handleTermsChange = (e) => {
        if (e.target.checked) {
            setIsTermsModalVisible(true);
        }
    };

    const getCityFromGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude);
                    setLongitude(longitude);
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        const location =
                            data.address.city ||
                            data.address.town ||
                            data.address.village ||
                            data.address.hamlet ||
                            data.address.road ||
                            data.address.street ||
                            "Location not found";
                        setCity(location);
                        setSearchTerm(location); // Keep input field filled
                    } catch (error) {
                        message.error("Failed to fetch location name");
                    }
                },
                () => {
                    message.error("Failed to fetch location");
                }
            );
        } else {
            message.error("Geolocation is not supported by this browser.");
        }
    };

    const fetchLocationSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]); // Clear suggestions if input is too short
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1`
            );
            const data = await response.json();

            // Always keep the user's input, even if no matches are found
            if (data.length === 0) {
                setSuggestions([{ display_name: "No results found", lat: null, lon: null }]);
            } else {
                setSuggestions(data.map((place) => ({
                    display_name: place.display_name,
                    lat: place.lat,
                    lon: place.lon
                })));
            }
        } catch (error) {
            message.error("Failed to fetch location suggestions");
        }
    };

    useEffect(() => {
        const fetchIP = async () => {
            try {
                const response = await fetch("https://api64.ipify.org?format=json");
                const data = await response.json();
                setIpAddress(data.ip);
            } catch (error) {
                console.error("Failed to fetch IP address", error);
            }
        };
        fetchIP();
    }, []);

    const handleSelectLocation = (location) => {
        if (location.display_name !== "No results found") {
            setSearchTerm(location.display_name);
            setCity(location.display_name);
            setLatitude(location.lat); // Set latitude
            setLongitude(location.lon); // Set longitude
        }
        setSuggestions([]); // Clear suggestions after selection
        inputRef.current.focus(); // Retain focus on the input field
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart; // Store cursor position
        setSearchTerm(value);
        fetchLocationSuggestions(value);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(cursorPosition, cursorPosition); // Restore cursor position
            }
        }, 0);
    };

    const handleTermsAccept = () => {
        setIsTermsModalVisible(false);
    };

    const handleAddSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/sub-trade/add-workers`, {
                id,
                ipAddress,
                latitude,
                longitude,
                companyName: values.companyName,
                location: city, // Use the city fetched from geolocation
                experience: values.experience,
                email: values.email,
                phone: values.phone,
                services: [values.service1, values.service2, values.service3, values.service4, values.service5, values.service6],
                reviews: values.reviews,
                terms: values.terms,
                notifications: values.notifications
            });

            if (response.data.success) {
                message.success(response.data.message);
                form.resetFields();
            } else {
                message.error(response.data.message);
            }

        } catch (error) {
            console.error(error);
            message.error("An error occurred while listing the trade");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && <Loader />}

            <div className="d-flex align-items-center justify-content-between">
                <Navbar />
            </div>
            <div className="container">
                <div className="list-form-main">
                    <Form form={form} onFinish={handleAddSubmit} layout="vertical">
                        <h2 className='text-center'>List Yourself</h2>

                        <Form.Item
                            label="Name or Company name"
                            name="companyName"
                            rules={[{ required: true, message: 'Please enter company name' }]}
                        >
                            <Input placeholder="Enter company name" />
                        </Form.Item>

                        <Form.Item label="Location">
                            <button
                                className='list-youself'
                                type="button"
                                onClick={getCityFromGeoLocation}
                            >
                                Get Current Location
                            </button>
                            {city && <h5 className='mt-2'>Nearest City: {city}</h5>}
                        </Form.Item>
                        <Form.Item
                            label="Enter Location"
                            name="Location"
                        >
                            <Input
                                placeholder="Enter location"
                                value={searchTerm}
                                onChange={handleInputChange}
                                ref={inputRef}
                            />
                            {/* Display suggestions */}
                            {suggestions.length > 0 && (
                                <ul style={{ border: "1px solid #ddd", padding: "5px", listStyle: "none", margin: 0 }}>
                                    {suggestions.map((location, index) => (
                                        <li
                                            key={index}
                                            style={{ padding: "5px", cursor: "pointer", background: "#f9f9f9" }}
                                            onClick={() => handleSelectLocation(location)} // Pass the entire location object
                                        >
                                            {location.display_name} {/* Display the display_name property */}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="Level of Experience"
                            name="experience"
                            rules={[{ required: true }]}
                        >
                            <Select placeholder="Select experience level">
                                <Select.Option value="qualified">Qualified</Select.Option>
                                <Select.Option value="experienced">Experienced</Select.Option>
                                <Select.Option value="new">New</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Contact Detail (Email)"
                            name="email"
                            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Contact Detail (Phone)"
                            name="phone"
                            rules={[{ required: true, message: 'Please enter your phone number' }]}
                        >
                            <Input placeholder="Enter your phone number" />
                        </Form.Item>

                        <Form.Item label="List Six Services You Provide">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Form.Item
                                    key={i}
                                    name={`service${i}`}
                                    rules={[{ required: true, message: `Please enter service ${i}` }]}
                                >
                                    <Input placeholder={`Service ${i}`} />
                                </Form.Item>
                            ))}
                        </Form.Item>

                        <Form.Item
                            label="Agree to Customer Reviews"
                            name="reviews"
                            rules={[{ required: true }]}
                        >
                            <Select placeholder="Select">
                                <Select.Option value="yes">Yes</Select.Option>
                                <Select.Option value="no">No</Select.Option>
                            </Select>
                        </Form.Item>



                        <Form.Item
                            label="Allow Push Notifications"
                            name="notifications"
                            rules={[{ required: true }]}
                        >
                            <Select placeholder="Select">
                                <Select.Option value="yes">Yes</Select.Option>
                                <Select.Option value="no">No</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="terms"
                            valuePropName="checked"
                            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('You must accept the terms and conditions') }]}
                        >
                            <Checkbox onChange={handleTermsChange}>
                                I have read and accepted the terms and conditions
                            </Checkbox>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            List Yourself
                        </Button>
                    </Form>
                </div>
            </div>
            {/* Modal for Terms and Conditions */}
            <Modal
                open={isTermsModalVisible}
                closable={false}
                footer={[
                    <Button key="accept" type="primary" onClick={handleTermsAccept}>
                        Accept
                    </Button>,
                ]}
                width={800}
            >
                <Terms />
            </Modal>
        </div>
    );
};

export default ListYourself;