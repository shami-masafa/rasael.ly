import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginOTP from "./pages/LoginOtp";
import Register from "./pages/Register";

import A2PStatistics from "./pages/Dashboard/A2P/Statistics";
import A2PSend from "./pages/Dashboard/A2P/Send";
import A2PHistory from "./pages/Dashboard/A2P/Messages";
import A2PPackages from "./pages/Dashboard/A2P/Packages";

import ADSStatistics from './pages/Dashboard/ADS/Statistics';
import ADSSend from './pages/Dashboard/ADS/Send';
import ADSHistory from "./pages/Dashboard/ADS/Messages";

import Developers from "./pages/Dashboard/A2P/Developers";
import Invoices from "./pages/Dashboard/Invoices";
import Support from "./pages/Dashboard/Support";
import Settings from "./pages/Dashboard/Settings";

function App() {
  const location = useLocation();

  // Show sidebar only for /dashboard routes
  const showSidebar = location.pathname.startsWith("/Dashboard");

  return (
    <div className="app">
      <Navbar />
      <div className="main-wrapper" style={{ display: "flex", direction: "rtl", width: "100%" }}>
        {showSidebar && <Sidebar />}

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loginotp" element={<LoginOTP />} />
            <Route path="/register" element={<Register />} />
            

            <Route path="/Dashboard/A2P/statistics" element={<A2PStatistics />} />
            <Route path="/Dashboard/A2P/send" element={<A2PSend />} />
            <Route path="/Dashboard/A2P/messages" element={<A2PHistory />} />
            <Route path="/Dashboard/A2P/packages" element={<A2PPackages />} />
            <Route path="/Dashboard/A2P/developers" element={<Developers />} />



            <Route path="/Dashboard/ADS/statistics" element={<ADSStatistics />} />
            <Route path="/Dashboard/ADS/send" element={<ADSSend />} />
            <Route path="/Dashboard/ADS/messages" element={<ADSHistory />} />


            <Route path="/Dashboard/invoices" element={<Invoices />} />
            <Route path="/Dashboard/Support" element={<Support />} />
            <Route path="/Dashboard/settings" element={<Settings />} />
            
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;