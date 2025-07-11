import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Loader from './Loader';

// Shows loader and handles redirection logic
const RedirectWithLoader = ({ countdown, redirectTo }) => {
    const [timer, setTimer] = useState(countdown);

    useEffect(() => {
        if (timer > 0) {
            const timerId = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timer]);

    return (
        <div style={{ height: '100vh' }} className="d-flex flex-column align-items-center justify-content-center">
            <Loader />
            <h2>Access Restricted!</h2>
            <h2>Redirecting in {timer} seconds...</h2>
            {timer === 0 && <Navigate to={redirectTo} replace />}
        </div>
    );
};

const PrivateRoute = ({ children }) => {
    const token = Cookies.get('token'); // Check if token exists

    if (!token) {
        return <RedirectWithLoader countdown={5} redirectTo="/login" />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const token = Cookies.get('token'); // Check if token exists
    const authData = Cookies.get('auth');            // Get authentication details
    if (token && authData) {
        // Parse the auth data to get user role
        const parsedAuthData = JSON.parse(authData);
        const role = parsedAuthData?.user?.role;


        if (role === 1) {
            return <RedirectWithLoader countdown={5} redirectTo="/dashboard/admin" />; // Admin user, redirect to  
        }

        if (role === 0) {
            return <RedirectWithLoader countdown={5} redirectTo="/dashboard/user" />; // Regular user, redirect to  
        }
    }

    return children;
};
const AdminRoute = ({ children }) => {
    const token = Cookies.get('token');
    const authData = Cookies.get('auth');

    if (!token || !authData) {
        return <RedirectWithLoader countdown={5} redirectTo="/login" />;
    }

    const parsedAuthData = JSON.parse(authData);
    const role = parsedAuthData?.user?.role;

    if (role !== 1) {
        return <RedirectWithLoader countdown={5} redirectTo="/dashboard/user" />;
    }

    return children;
};


export { PrivateRoute, PublicRoute, AdminRoute };
