import React, { useState, useEffect } from "react";
import { apiUrl } from "../../config";
import Popup from "../../Popup";

/* ---------------------- API CALLS ---------------------- */

async function getTickets(clientId) {
  try {
    const res = await fetch(`${apiUrl}api/RasaelCP/GetTickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ clientId }),
    });
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    return [];
  }
}

async function sendTicket(clientId, title, description) {
  try {
    const res = await fetch(`${apiUrl}api/RasaelCP/SubmitTicket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ clientId, title, description }),
    });
    if (!res.ok) throw new Error("Failed to submit ticket");
    return await res.json();
  } catch (err) {
    console.error("Error submitting ticket:", err);
    return { success: false };
  }
}

/* ---------------------- MAIN COMPONENT ---------------------- */

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "" });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [clientId, setClientId] = useState("");


  useEffect(() => {
  const clientId = sessionStorage.getItem("clientId");
  if (clientId) {
    setClientId(clientId);
  }
    if (!clientId) return;

    async function load() {
      setLoading(true);
      let data = await getTickets(clientId);
      if (data?.length) {
        data.sort((a, b) => new Date(b.created) - new Date(a.created));
      }
      setTickets(data || []);
      setLoading(false);
    }

    load();
  }, [clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId || submitting) return;

    setSubmitting(true);
    try {
      const result = await sendTicket(clientId, form.subject, form.description);
      if (result.success || result.response === 1) {
        setForm({ subject: "", description: "" });
        setShowModal(false);
        setShowPopup(true);

        let refreshed = await getTickets(clientId);
        if (refreshed?.length) {
          refreshed.sort((a, b) => new Date(b.created) - new Date(a.created));
        }
        setTickets(refreshed || []);
      } else {
        alert("حدث خطأ أثناء إرسال التذكرة");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const isOpen = status === "open";
    return (
      <span
        className={`px-3 py-1 rounded text-sm ${
          isOpen
            ? "text-brand-primary bg-brand-accent"
            : "bg-brand-primary text-white"
        }`}
      >
        {isOpen ? "جاري التحقق" : "مغلقة"}
      </span>
    );
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("ar-LY", {
          dateStyle: "short",
          timeStyle: "short",
        })
      : "-";

  const toggleDetails = (ticket) => {
    setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket);
  };

const InfoIcon = (props) => (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-5" style={{ direction: "rtl" }}>
      {/* ---------- Table + FAQ Layout ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* ---------- Ticket Table (2/3) ---------- */}
        <div className="lg:col-span-2">
          {/* Create Ticket Button ABOVE TABLE */}
          <div className="flex justify-between mb-3">
                  <h1 className="text-xl font-bold text-brand-primary mb-4">
        الدعم الفني 24/7
      </h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-brand-primary text-white px-5 py-2 rounded hover:bg-brand-accent hover:text-brand-primary transition-none"
            >
              + إنشاء تذكرة جديدة
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {loading ? (
              <div className="text-center py-10">جاري تحميل الطلبات...</div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                لا توجد طلبات دعم حالياً
              </div>
            ) : (
              <table className="w-full text-right table-fixed">
                <thead>
                  <tr className="bg-brand-primary text-white">
                    <th className="px-2 py-2 w-1/3">الموضوع</th>
                    <th className="p-2 w-24">الحالة</th>
                    <th className="p-2 w-28">الإنشاء</th>
                    <th className="p-2 w-28">آخر تحديث</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <React.Fragment key={t.id}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium truncate">
                          {t.title}
                        </td>
                        <td className="p-2">{statusBadge(t.status)}</td>
                        <td className="p-2 text-sm text-gray-600">
                          {formatDate(t.created)}
                        </td>
                        <td className="p-2 text-sm text-gray-600">
                          {formatDate(t.updated)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => toggleDetails(t)}
                            className="text-brand-primary hover:text-brand-accent"
                          >
                            <InfoIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>

                      {selectedTicket?.id === t.id && (
                        <tr className="bg-gray-100">
                          <td colSpan="5" className="p-3 text-gray-700">
                            <p className="font-semibold mb-1">
                              وصف التذكرة:
                            </p>
                            <p className="whitespace-pre-wrap">
                              {t.description || "لا يوجد وصف لهذه التذكرة."}
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ---------- FAQ (1/3) ---------- */}
        <div className="bg-white p-3 rounded shadow-lg">
          <h2 className="font-semibold mb-4 text-brand-primary">
            الأسئلة الشائعة
          </h2>
          <div className="space-y-5 text-gray-700">
            <div>
              <h3 className="font-bold">لماذا تتأخر الرسائل في الإرسال؟</h3>
              <p className="text-sm">
                قد يحدث التأخير بسبب ضغط على الشبكة أو مشاكل في شركة الاتصالات.
              </p>
            </div>
            <div>
              <h3 className="font-bold">كيف يمكنني شحن رصيد الرسائل؟</h3>
              <p className="text-sm">
                يمكنك شراء باقات الرسائل من صفحة الباقات داخل لوحة التحكم.
              </p>
            </div>
            <div>
              <h3 className="font-bold">كيف أتواصل مع الدعم؟</h3>
              <p className="text-sm">
                help@masafa.ly <br />
                218-91-401-1188 <br />
                218-92-401-1188
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Modal ---------- */}

{showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-2xl"> {/* Added shadow-2xl */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-brand-primary">إنشاء تذكرة دعم</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 text-xl hover:bg-brand-accent hover:text-brand-primary transition-none rounded px-2"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="الموضوع"
                  maxLength={40}
                  className="border p-5 rounded w-full focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
                <div className="absolute bottom-1 right-3 text-gray-400 text-sm">
                  {form.subject.length}/40
                </div>
              </div>
              <div className="relative">
                <textarea
                  placeholder="وصف المشكلة"
                  rows={4}
                  maxLength={500}
                  className="border p-3 rounded w-full focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                ></textarea>
                <div className="absolute bottom-1 right-3 text-gray-400 text-sm">
                  {form.description.length}/500
                </div>
              </div>
              <button
                type="submit"
                className={`bg-brand-primary text-white p-3 rounded hover:bg-brand-accent hover:text-brand-primary transition-none ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={submitting}
              >
                {submitting ? "جاري الإرسال..." : "إرسال التذكرة"}
              </button>
            </form>
          </div>
        </div>
      )}

<Popup
        show={showPopup}
        title="تم إرسال التذكرة"
        message={`شكراً لتواصلك معنا، سيقوم فريق الدعم بالتواصل معك علي رقم هاتفك في اقرب وقت.`}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}
