import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import "../pages/admin/common.css";
import Loader from '../components/Loader';
import { message } from 'antd';
const Register = () => {

    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);



    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };



    // Handle form submit with email validation
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name === "") {
            toast.error("Name is Required !!");
            return;
        }
        if (email === "") {
            toast.error("Email is Required !!");
            return;
        }
        if (password === "") {
            toast.error("Password is Required !!");
            return;
        }

        setLoading(true); // Show loader

        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name,
                email,
                password,
            });

            // Handle different status codes
            if (res.status === 201) {
                message.success(res.data.message); // Success: Account created
                navigate("/login");
            } else if (res.status === 400) {
                toast.error(res.data.message); // Bad Request (Validation errors)
            } else if (res.status === 409) {
                toast.warning(res.data.message); // Conflict (Email already registered)
            } else {
                toast.error("Unexpected response from the server.");
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status code outside of 2xx
                if (error.response.status === 500) {
                    toast.error("Server Error! Please try again later.");
                } else {
                    toast.error(error.response.data.message || "Something went wrong.");
                }
            } else {
                // Network or unexpected error
                toast.error("Network error! Please check your connection.");
            }
        } finally {
            setLoading(false); // Hide loader
        }
    };


    return (
        <>
            <Navbar />
            {loading && <Loader />}
            <div className="reg-main">
                <div className="reg-sub">
                    <div className="reg-right">

                        <form onSubmit={handleSubmit}>
                            <h2 className='text-center'> Register</h2>
                            <div className="auth-inp-main position-relative">
                                <label className='form-label'>Name*</label>
                                <input
                                    type="text"
                                    className='login-inp'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='John'
                                />

                            </div>
                            <div className="auth-inp-main position-relative">
                                <label className='form-label'>Email*</label>
                                <input
                                    type="email"  // Email input hidden by default
                                    className='login-inp'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='support@trade.com'
                                />

                            </div>
                            <div className="auth-inp-main position-relative">
                                <label className="form-label">Password*</label>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    className="login-inp"
                                    placeholder="trade12345"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="toggle-btn"
                                    id="togglePassword"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>

                            <div className="text-center login-btns-sub my-3">
                                <button className='login-sub login-sub-c'>Register</button>
                            </div>
                            <p className="text-center mb-0">Already Have an Account ? <Link to={"/login"}>Login</Link></p>
                        </form>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Register;
