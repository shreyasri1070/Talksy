import Hero from "../components/Dashboard/Hero";
import { useAuth } from "../context/AuthContext";
import LandingNav from "../components/Dashboard/Navbar";
import Footer from "../components/Dashboard/Footer";
import Features from "../pages/Features";
import Payments from "../pages/Payment";
import CustomerLogos from "../pages/CustomerLogos";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-black">
      <LandingNav />
      <Hero />
      <Features />
      <Payments />
      <CustomerLogos />
      <Footer />
    </div>
  );
};

export default Home;