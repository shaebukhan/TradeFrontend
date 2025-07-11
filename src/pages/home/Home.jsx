import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HomeSec from "../../components/HomeSec";
import './HomeSec.css'; // Import the external CSS


const Home = (props) => {
    return (
        <>
            <Navbar />
            <HomeSec />
            {/* <Footer /> */}
        </>
    );
};

export default Home;