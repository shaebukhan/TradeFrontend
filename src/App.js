

import Home from "./pages/home/Home";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Recruitment from "./pages/Recruitment";
import Job from "./pages/Job";
import Workers from "./pages/home/Workers";
import Details from "./pages/Details";
import { AdminRoute, PrivateRoute, PublicRoute } from "./routes/AuthRoute";
import Admin from "./pages/admin/Admin";
import SubTrades from "./pages/admin/SubTrades";
import Listings from "./pages/admin/Listings";
import Trades from "./pages/admin/Trades";
import Contact from "./pages/Contact";
import Complaints from "./pages/admin/Complaints";
import ListYourself from "./pages/ListYourself";
import Login from "./auth/Login";
import Register from "./auth/Register";
import UserDash from "./pages/user/UserDash";
import Recruitments from "./pages/admin/Recruitments";
import JobSeekers from "./pages/admin/JobSeekers";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/recruitment/:id" element={<Recruitment />} />
        <Route path="/job" element={<Job />} />
        <Route path="/workers/:id" element={<Workers />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/list-me/:id" element={<ListYourself />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
        {/* public route  */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* user route  */}
        <Route path="/dashboard/user" element={<PrivateRoute><UserDash /></PrivateRoute>} />
        {/* admin route  */}
        <Route path="/dashboard/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/dashboard/admin/trade/:id" element={<AdminRoute><SubTrades /></AdminRoute>} />
        <Route path="/dashboard/admin/listings" element={<AdminRoute><Listings /></AdminRoute>} />
        <Route path="/dashboard/admin/trades" element={<AdminRoute><Trades /></AdminRoute>} />
        <Route path="/dashboard/admin/complaints" element={<AdminRoute><Complaints /></AdminRoute>} />
        <Route path="/dashboard/admin/recruitements" element={<AdminRoute><Recruitments /></AdminRoute>} />
        <Route path="/dashboard/admin/jobseekers" element={<AdminRoute><JobSeekers /></AdminRoute>} />


      </Routes>

    </>
  );
};

export default App;