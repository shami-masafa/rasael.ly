import React from "react";

export default function Popup({ show, title, message, onClose }) {
  if (!show) return null;

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-container" onClick={(e) => e.stopPropagation()}>
          <h3 className="popup-title">{title || "تنبيه"}</h3>
          <p className="popup-message">{message}</p>
          <button className="popup-btn" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>

      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .popup-container {
          background: #fff;
          border-radius: 12px;
          padding: 25px 30px;
          text-align: center;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          animation: popup-appear 0.25s ease-out;
        }

        .popup-title {
          margin-bottom: 10px;
          color: #455785;
          font-size: 20px;
        }

        .popup-message {
          margin-bottom: 20px;
          color: #333;
          font-size: 16px;
          line-height: 1.5;
        }

        .popup-btn {
          background-color: #455785;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
        }

        .popup-btn:hover {
          background-color: #2f3d64;
        }

        @keyframes popup-appear {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
