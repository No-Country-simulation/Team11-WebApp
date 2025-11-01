import Navbar from "../components/ui/navbar";
import Footer from "../components/ui/footer";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;


