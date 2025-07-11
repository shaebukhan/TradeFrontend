
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.jpg";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
const Navbar = () => {
    const navigate = useNavigate();
    const authDataString = Cookies.get('auth');
    const auth = authDataString ? JSON.parse(authDataString) : null;
    const handleLogout = async () => {
        try {
            // Send POST request to the server to log out
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/logout`);

            if (res.data.success) {


                Cookies.remove("token"); // Removes the 'token' cookie
                Cookies.remove("auth");  // Removes the 'auth' cookie

                // Show a logout notification
                toast.info("Logged out successfully");

                // Redirect to the login page
                navigate('/login');
            } else {
                toast.error("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);

        }
    };

    return (
        <>
            <div className="navbarr">
                <Link to="/">
                    <img className="nav-logo" src={Logo} alt="Logo" />
                </Link>
                {
                    auth?.user ? (<>  <button className="btn btn-primary" onClick={() => {
                        handleLogout();
                    }}>Logout</button>  </>) : (<>


                    </>)
                }
            </div>
        </>
    );
};

export default Navbar;



