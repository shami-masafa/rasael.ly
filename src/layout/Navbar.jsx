import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { isLoggedIn } from "../config";
import { FaUser, FaSignOutAlt, FaCog, FaAngleDown } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem("userData")) || null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(isLoggedIn());
      const data = sessionStorage.getItem("userData");
      setUserData(data ? JSON.parse(data) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    setUserData(data ? JSON.parse(data) : null);
    setLoggedIn(isLoggedIn());
    setIsDropdownOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    const section = document.getElementById(id);
    if (!section) return;

    const navHeight = 60;
    const offset = 10;
    const top =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      navHeight -
      offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const isDashboardActive = location.pathname.startsWith("/Dashboard");

  return (
    <nav
      className="
        navbar flex justify-between items-center 
        py-1 px-20 md:px-20 lg:px-20 xl:px-20 
        bg-gray-50 border-b border-gray-200 
        sticky top-0 z-50 
        rtl font-['Tajawal',sans-serif]
        flex-col md:flex-row
      "
      dir="rtl"
    >
      {/* Right side */}
      <div className="flex items-center gap-6 cursor-pointer flex-col md:flex-row">
        <a onClick={() => scrollToSection("home-section")}>
          <img
            src="/images/rasaelLogo.png"
            alt="Rasael logo"
            className="h-12 w-auto md:h-14"
          />
        </a>

        <div className="flex items-center gap-5 text-sm md:text-base">
          <a
            onClick={() => scrollToSection("about-section")}
            className="text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer"
          >
            الرئيسية
          </a>
          <a
            onClick={() => scrollToSection("otp-prices-section")}
            className="text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer"
          >
            باقات التنبيه
          </a>
          <a
            onClick={() => scrollToSection("ads-prices-section")}
            className="text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer"
          >
            باقات الدعائية
          </a>
          <a
            onClick={() => scrollToSection("contact-section")}
            className="text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer"
          >
            تواصل معنا
          </a>
        </div>
      </div>

      {/* Left side */}
      <div className="flex items-center gap-3 md:gap-5 my-2 md:my-0">
        {loggedIn && userData ? (
          <>
            {/* Dashboard Button */}
            <button
              className={`
                flex items-center justify-center 
                py-1 px-4 text-base font-medium 
                border border-brand-primary 
                rounded-md transition-colors
                ${
                  isDashboardActive
                    ? "bg-brand-primary text-white"
                    : "text-brand-primary hover:bg-brand-primary/10"
                }
              `}
              onClick={() => navigate("/Dashboard/A2P/Statistics")}
              title="لوحة التحكم"
            >
              لوحة التحكم
            </button>

            {/* ============ DROPDOWN ============ */}
            <div ref={dropdownRef} className="relative">
              {/* Profile Button */}
              <button
                className="
                  flex items-center gap-2 text-gray-700 
                  cursor-pointer bg-transparent border-none 
                  py-1 px-2 rounded-md hover:bg-gray-200 transition-colors
                "
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <FaUser size={20} className="text-brand-primary" />
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium whitespace-nowrap">
                    {userData.mainUser}
                  </span>
                  <small className="text-xs text-gray-500 flex items-center justify-end">
                    <FaAngleDown size={10} className="mr-1 transition-transform duration-200"
                      style={{
                        transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)"
                      }}
                    />
                  </small>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`
                  absolute top-full right-0 mt-2 min-w-[180px] 
                  bg-white border border-gray-200 rounded-lg 
                  shadow-lg z-50 overflow-hidden
                  transform transition-all duration-300 ease-out
                  origin-top-right
                  ${isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                `}
              >
                <Link
                  to="/Dashboard/Settings"
                  className="
                    flex items-center gap-3 p-3 text-sm 
                    text-gray-700 hover:bg-gray-100 hover:text-brand-primary 
                    transition-colors w-full text-right
                  "
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaCog size={16} className="text-current" />
                  <span>الإعدادات</span>
                </Link>

                <button
                  className="
                    flex items-center gap-3 p-3 text-sm 
                    text-red-600 hover:bg-red-50 hover:text-red-700 
                    transition-colors w-full text-right border-t border-gray-100
                  "
                  onClick={handleLogout}
                >
                  <FaSignOutAlt size={16} className="text-current" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
            {/* ============ END DROPDOWN ============ */}
          </>
        ) : (
          <Link
            to="/login"
            className="
              bg-brand-primary text-white 
              py-2 px-4 rounded-md font-medium 
              hover:bg-yellow-500 transition-colors
            "
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </nav>
  );
}
