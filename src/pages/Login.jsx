// Tailwind version of the Login page with background image behind form
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Turnstile from "react-turnstile";
import { turnstileSiteKey, apiUrl } from "../config";
import Popup from "../Popup.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });

  const navigate = useNavigate();

  const showPopup = (message, title = "تنبيه") => {
    setPopup({ show: true, message, title });
  };

  const handleClosePopup = () => {
    setPopup({ show: false, message: "", title: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      showPopup("يرجى التحقق من أنك لست روبوتًا.");
      return;
    }

    setLoading(true);

    try {
      const loginResponse = await fetch(`${apiUrl}api/User/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username, password })
      });

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        throw new Error(errorText || "فشل تسجيل الدخول");
      }

      const loginData = await loginResponse.json();

      sessionStorage.setItem("token", loginData.token);
      sessionStorage.setItem("clientId", loginData.userId);
      sessionStorage.setItem("username", loginData.username);
      sessionStorage.setItem("phoneNo", loginData.phoneNo);
      sessionStorage.setItem("rasaelToken", loginData.rasaelToken);

      const otpResponse = await fetch(`${apiUrl}api/User/RequestOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          Username: loginData.username,
          ClientID: loginData.userId,
          PhoneNo: loginData.phoneNo
        })
      });

      if (!otpResponse.ok) {
        const errorText = await otpResponse.text();
        throw new Error(errorText || "فشل ارسال رمز التحقق");
      }

      navigate("/loginotp", {
        state: { phoneNo: loginData.PhoneNo, clientId: loginData.UserId }
      });

    } catch (error) {
      console.error("Login error:", error);
      showPopup(`خطأ في تسجيل الدخول: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50 p-4 font-[Tajawal] direction-rtl">

      {/* Background Image Container */}
      <div
        className="w-full max-w-5xl rounded-xl shadow-lg overflow-hidden relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/rasaelAdsBanner.jpg')" }}
      >

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Form Content */}
        <div className="relative z-10 py-10 px-12 flex flex-col justify-center bg-white bg-opacity-80 backdrop-blur-md max-w-md mx-auto my-10 rounded-xl">

          <h1 className="text-3xl font-bold text-center text-[#455785] mb-8">
            تسجيل الدخول
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="اسم المستخدم"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#455785]"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="كلمة المرور"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#455785]"
              />
            </div>

            <div className="flex justify-center">
              <Turnstile
                sitekey={turnstileSiteKey}
                onVerify={(token) => setCaptchaToken(token)}
                theme="light"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-md text-lg text-white transition ${
                loading
                  ? "bg-yellow-300 text-black cursor-not-allowed"
                  : "bg-[#455785] hover:bg-yellow-400 hover:text-black"
              }`}
            >
              {loading ? "جارٍ الدخول..." : "دخول"}
            </button>

            <Link
              to=" "
              className="text-center text-[#455785] underline hover:text-[#6277aa]"
            >
              نسيت كلمة المرور؟
            </Link>

            <hr className="my-5 border-gray-200" />

            <div className="text-center">
              <p>ليس لديك حساب؟</p>
              <Link
                to="/register"
                className="p-3 text-base font-semibold rounded-lg bg-gray-100 border border-brand-primary text-brand-primary 
                hover:bg-brand-primary hover:text-white transition duration-300 block w-full shadow-sm"
              >
                التسجيل في منصة رسائل
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Popup show={popup.show} title={popup.title} message={popup.message} onClose={handleClosePopup} />
    </section>
  );
}
