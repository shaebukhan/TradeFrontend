import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BsEmojiAstonished } from "react-icons/bs";
const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="page-not">
        <h1 className="common-title">
          <div className="page-not-found-logo   text-center ">
            <BsEmojiAstonished />
          </div>
          OPPS !! 404 Page Not Found
        </h1>
      </div>

    </>
  );
};

export default NotFound;