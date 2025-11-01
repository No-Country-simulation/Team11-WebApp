import Navbar from "../components/ui/navbar";
import Footer from "../components/ui/footer";
import { Outlet } from "react-router-dom";

const PymeLayout = () => {
  const mockUser = { companyName: "Nombrepyme" };
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="pyme" user={mockUser} />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PymeLayout;

