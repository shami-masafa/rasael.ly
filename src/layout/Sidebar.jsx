import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaEnvelope,
  FaCog,
  FaBoxOpen,
  FaCode,
  FaChevronDown,
  FaBullhorn,
  FaRegCommentDots,
  FaChevronLeft,
  FaChartBar,
  FaHistory,
  FaFileInvoice,
} from "react-icons/fa";
import { FaHeadset } from "react-icons/fa6";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openMenu, setOpenMenu] = useState("A2P"); // Initialize A2P menu open

  // Custom colors derived from original CSS
  const primaryColor = '#455785';
  const hoverBg = '#f0f4ff';

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path) => currentPath === path;

  // Custom function to handle dynamic Tailwind class construction
  const getLinkClasses = (path) => 
    `flex items-center gap-2 text-sm py-2 px-3 rounded-md transition-all duration-200 
    ${isActive(path) 
      ? `text-white bg-[${primaryColor}]` // Active state
      : `text-gray-700 hover:text-[${primaryColor}] hover:bg-[${hoverBg}]` // Inactive state
    }`;

  const getButtonClasses = (menu) => 
    `w-full text-base flex justify-between items-center p-3 rounded-md cursor-pointer font-['Tajawal',_sans-serif] 
    transition-all duration-200 
    ${openMenu === menu ? `text-[${primaryColor}] bg-[${hoverBg}]` : 'text-gray-700 hover:bg-gray-200 hover:text-gray-800'}
    `;

  const getSubmenuClasses = (menu) => 
    `overflow-hidden transition-all duration-300 ease-in-out 
    ${openMenu === menu ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
    `;

  // Icon for expansion/collapse, rotates based on open state
  const ChevronIcon = ({ menu }) => (
    openMenu === menu 
      ? <FaChevronDown className="w-4 h-4 text-gray-700 transition-transform duration-300" />
      : <FaChevronLeft className="w-4 h-4 text-gray-700 transition-transform duration-300" />
  );

  return (
    <aside 
      className="sticky top-0 h-screen w-60 bg-gray-50 border-l border-gray-200 p-3 
                 flex flex-col font-['Tajawal',_sans-serif] rtl right-0 shadow-lg 
                 lg:block hidden" // Hide on small screens (original behavior)
    >
      <nav className="flex flex-col gap-2">
        
        {/* --- A2P Section --- */}
        <div className="menu-group">
          <button
            className={getButtonClasses("A2P")}
            onClick={() => toggleMenu("A2P")}
          >
            <div className="flex items-center gap-2">
              <FaRegCommentDots className="w-5 h-5" /> <span>رسائل التنبيه (A2P)</span>
            </div>
            <ChevronIcon menu="A2P" />
          </button>

          <div className={getSubmenuClasses("A2P")}>
            <div className="flex flex-col gap-1 pr-4 border-r-2 border-gray-300">
              <Link to="/Dashboard/A2P/Statistics" className={getLinkClasses("/Dashboard/A2P/Statistics")}>
                <FaChartBar className="w-4 h-4" /> الاحصائيات
              </Link>
              <Link to="/Dashboard/A2P/Send" className={getLinkClasses("/Dashboard/A2P/Send")}>
                <FaEnvelope className="w-4 h-4" /> ارسال رسالة
              </Link>
              <Link to="/Dashboard/A2P/Messages" className={getLinkClasses("/Dashboard/A2P/Messages")}>
                <FaHistory className="w-4 h-4" /> سجل الرسائل
              </Link>
              <Link to="/Dashboard/A2P/Packages" className={getLinkClasses("/Dashboard/A2P/Packages")}>
                <FaBoxOpen className="w-4 h-4" /> سجل الباقات
              </Link>
              <Link to="/Dashboard/A2P/Developers" className={getLinkClasses("/Dashboard/A2P/Developers")}>
                <FaCode className="w-4 h-4" /> المطورين 
              </Link>
            </div>
          </div>
        </div>

        {/* --- ADS Section --- */}
        <div className="menu-group">
          <button
            disabled={true} // Keep disabled property
            className={`${getButtonClasses("ADS")} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent`}
            onClick={() => toggleMenu("ADS")}
          >
            <div className="flex items-center gap-2">
              <FaBullhorn className="w-5 h-5" /> <span>رسائل الدعائية (ADS)</span>
            </div>
            <ChevronIcon menu="ADS" />
          </button>

          <div className={getSubmenuClasses("ADS")}>
            <div className="flex flex-col gap-1 pr-4 border-r-2 border-gray-300">
              <Link to="/Dashboard/ADS/Statistics" className={getLinkClasses("/Dashboard/ADS/Statistics")}>
                <FaChartBar className="w-4 h-4" /> الاحصائيات
              </Link>
              <Link to="/Dashboard/ADS/Send" className={getLinkClasses("/Dashboard/ADS/Send")}>
                <FaEnvelope className="w-4 h-4" /> ارسال رسائل
              </Link>
              <Link to="/Dashboard/ADS/Messages" className={getLinkClasses("/Dashboard/ADS/Messages")}>
                <FaHistory className="w-4 h-4" /> سجل الرسائل
              </Link>
            </div>
          </div>
        </div>

        {/* --- Other Main Links --- */}
        <Link to="/Dashboard/Invoices" className={getLinkClasses("/Dashboard/Invoices")}>
          <FaFileInvoice className="w-5 h-5" /> الفواتير
        </Link>

        <Link to="/Dashboard/Support" className={getLinkClasses("/Dashboard/Support")}>
          <FaHeadset className="w-5 h-5" /> الدعم الفني
        </Link>

        <Link to="/Dashboard/Settings" className={getLinkClasses("/Dashboard/Settings")}>
          <FaCog className="w-5 h-5" /> الاعدادات
        </Link>
      </nav>
    </aside>
  );
}