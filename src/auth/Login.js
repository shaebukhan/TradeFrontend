import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from 'js-cookie';
import "../pages/admin/common.css";
import Loader from '../components/Loader';
const Login = () => {

    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false);
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

        if (email.trim() === "") {
            toast.error("Email is Required !!");
            return;
        }
        if (password.trim() === "") {
            toast.error("Password is Required !!");
            return;
        }

        setLoading(true); // Show loader

        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {
                email,
                password,
            });

            // Handle different response statuses
            if (res.status === 200 && res.data.success) {
                Cookies.set("token", res.data.token, { expires: 1, sameSite: 'Lax', secure: true });
                Cookies.set("auth", JSON.stringify({ user: res.data.user }), { expires: 1, sameSite: 'Lax', secure: true });

                toast.success("Login Successful!");

                // Redirect based on user role
                if (res.data.user.role === 1) {
                    navigate("/dashboard/admin");
                } else {
                    navigate("/dashboard/user");
                }
            } else {
                toast.error(res.data.message || "Login failed! Please try again.");
            }
        } catch (error) {
            if (error.response) {
                // Handle known error responses
                if (error.response.status === 400) {
                    toast.error("Invalid credentials! Please check your email and password.");
                } else if (error.response.status === 401) {
                    toast.error("Unauthorized! Please check your login details.");
                } else if (error.response.status === 500) {
                    toast.error("Server Error! Please try again later.");
                } else {
                    toast.error(error.response.data.message || "An error occurred! Please try again.");
                }
            } else {
                // Handle network errors
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
                            <h2 className='text-center'>Login</h2>
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
                                <button className='login-sub login-sub-c'>Login</button>
                            </div>
                            <p className="text-center mb-0">Don't Have an Account ? <Link to={"/register"}>Register</Link></p>

                        </form>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Login;
