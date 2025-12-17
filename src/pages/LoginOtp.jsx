import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";
import Popup from "../Popup"; // ← your custom popup

export default function LoginOTP() {
  const navigate = useNavigate();
  const phoneNo = sessionStorage.getItem("phoneNo");
  const clientId = sessionStorage.getItem("clientId");
  const username = sessionStorage.getItem("username");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // ⏳ resend timer
  const [timer, setTimer] = useState(180);
  const [isResending, setIsResending] = useState(false);

  // popup state
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
  });

  const openPopup = (title, message) => {
    setPopup({ show: true, title, message });
  };

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "" });
  };

  const inputRefs = [
    useRef(), useRef(), useRef(),
    useRef(), useRef(), useRef()
  ];

  // ---------------- TIMER ----------------
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ---------------- HANDLERS ----------------
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) inputRefs[index + 1].current.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // ---------------- VERIFY OTP ----------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpValue = otp.join("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${apiUrl}api/User/VerifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ClientID: clientId, OTP: otpValue }),
      });

      if (!response.ok) throw new Error(await response.text());

      const verifyData = await response.json();
      if (verifyData.response !== 1) {
        openPopup("خطأ", "الرمز غير صحيح.");
        return;
      }

      const userInfoResponse = await fetch(`${apiUrl}api/User/GetClientInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ClientID: clientId, UserName: username }),
      });

      if (!userInfoResponse.ok) throw new Error(await userInfoResponse.text());

      const userData = await userInfoResponse.json();

      sessionStorage.setItem("userData", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage"));

      navigate("/Dashboard/A2P/Statistics");

    } catch (error) {
      openPopup("الرمز غير صحيح.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESEND OTP ----------------
  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const token = sessionStorage.getItem("token");

      const otpResponse = await fetch(`${apiUrl}api/User/RequestOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Username: username,
          ClientID: clientId,
          PhoneNo: phoneNo,
        }),
      });

      if (!otpResponse.ok) throw new Error(await otpResponse.text());

      openPopup("تم الإرسال", "تم إرسال رمز جديد إلى هاتفك.");

      setTimer(180);
      setOtp(["", "", "", "", "", ""]);
      inputRefs[0].current.focus();

    } catch (error) {
      openPopup("خطأ", "فشل إرسال رمز جديد: " + error.message);
    }

    setIsResending(false);
  };

  return (
    <section className="otp">
      <div className="container">
        <h1>التحقق برمز OTP</h1>

        <p>تم إرسال الرمز إلى: <strong>{phoneNo}</strong></p>

        <form onSubmit={handleVerifyOtp} className="otp-form">
          <label>أدخل رمز التحقق</label>

          <div className="otp-inputs">
            {otp.map((val, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                required
              />
            ))}
          </div>

          {/* SUBMIT BUTTON FIXED STYLE */}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "جارٍ التحقق..." : "تحقق"}
          </button>
        </form>

        {/* RESEND OTP SECTION */}
        <div className="resend">
          {timer > 0 ? (
            <p>يمكنك طلب رمز جديد بعد:
              <strong> {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")} </strong>
            </p>
          ) : (
            <button onClick={handleResendOtp} disabled={isResending} className="resend-btn">
              {isResending ? "جارٍ الإرسال..." : "إعادة إرسال الرمز"}
            </button>
          )}
        </div>
      </div>

      <Popup
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
      />

      <style>{`
        .otp {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          background-color: #f9fbff;
          padding: 20px;
        }
        .otp .container {
          max-width: 400px;
          width: 100%;
          background-color: #fff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .otp h1 {
          text-align: center;
          font-size: 28px;
          color: #455785;
          margin-bottom: 15px;
        }
        .otp-inputs {
          display: flex;
          gap: 10px;
          justify-content: center;
          direction: ltr;
          margin-bottom: 20px;
        }
        .otp-inputs input {
          width: 50px;
          height: 55px;
          text-align: center;
          font-size: 24px;
          border: 1px solid #ddd;
          border-radius: 6px;
          transition: 0.2s;
        }
        .otp-inputs input:focus {
          border-color: #455785;
          box-shadow: 0 0 5px rgba(69,87,133,0.3);
        }

        /* NEW SUBMIT BUTTON */
        .submit-btn {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-radius: 8px;
          background-color: #455785;
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: 0.2s;
        }
        .submit-btn:hover {
          background-color: #2f3d64;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .resend {
          margin-top: 20px;
          text-align: center;
          font-size: 16px;
        }
        .resend-btn {
          background: none;
          border: none;
          color: #455785;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          padding-top: 5px;
        }
      `}</style>
    </section>
  );
}
