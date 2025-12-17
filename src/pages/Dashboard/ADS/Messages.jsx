import { useState, useEffect } from "react";
import { apiUrl } from "../../../config";
import { FaSearch } from "react-icons/fa";

export default function ADSHistory() {
  const [history, setHistory] = useState([]);
  const [filterPhone, setFilterPhone] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const fetchHistory = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const fromDate = filterFromDate || yesterday.toISOString().split("T")[0];
    const toDate = filterToDate || tomorrow.toISOString().split("T")[0];

    try {
      const res = await fetch(`${apiUrl}api/RasaelCP/GetRasaelHistorySelect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          clientId: userData.userID,
          phoneNo: filterPhone,
          fdate: fromDate,
          tdate: toDate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (!filterFromDate) setFilterFromDate(yesterday.toISOString().split("T")[0]);
    if (!filterToDate) setFilterToDate(tomorrow.toISOString().split("T")[0]);

    fetchHistory();
  }, []);

  const filteredHistory = history.filter((h) => {
    let pass = true;
    if (filterPhone && !h.phoneNo?.includes(filterPhone)) pass = false;
    if (filterFromDate && new Date(h.createdAt) < new Date(filterFromDate)) pass = false;
    if (filterToDate && new Date(h.createdAt) > new Date(filterToDate)) pass = false;
    return pass;
  });

  return (
    <div className="space-y-6 p-4 text-right lg:mx-auto lg:max-w-5xl">
      <h4 className="text-2xl font-bold text-brand-primary">�?�?�? �?�?�?�?�?�?�? ADS</h4>

      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        <FilterField
          label="�?�?�? �?�?�?�?�?�?:"
          value={filterPhone}
          type="text"
          placeholder="�?�?� �?�?�?�? �?�?�?�?�?�?"
          onChange={setFilterPhone}
        />
        <FilterField
          label="�?�? �?�?�?�?�?:"
          value={filterFromDate}
          type="date"
          onChange={setFilterFromDate}
        />
        <FilterField
          label="�?�?�? �?�?�?�?�?:"
          value={filterToDate}
          type="date"
          onChange={setFilterToDate}
        />
        <button
          type="button"
          onClick={fetchHistory}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-3 text-white transition hover:bg-brand-dark"
        >
          <FaSearch />
          �?�?�?�?
        </button>
      </div>

      <p className="text-sm text-gray-600">
        �?�?�? �?�?�?�?�?�?�?: <strong>{filteredHistory.length}</strong>
      </p>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card">
        <table className="w-full table-fixed border-collapse text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
            <tr>
              <th className="px-3 py-2">�?�?�? �?�?�?�?�?�?</th>
              <th className="px-3 py-2">�?�?�?�?�?�?�?</th>
              <th className="px-3 py-2">�?�?�?�?�?�?�?</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((h, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-none">
                <td className="px-3 py-2">{h.phoneNo}</td>
                <td className="px-3 py-2 break-words">{h.msg}</td>
                <td className="px-3 py-2">{new Date(h.createdAt).toLocaleString("en-GB")}</td>
              </tr>
            ))}
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-gray-500">
                  �?�? �?�?�?�? �?�?�?�?�?
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterField({ label, value, onChange, type, placeholder }) {
  return (
    <div className="flex flex-1 flex-col gap-2 min-w-[160px]">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-gray-200 px-4 py-2 text-base text-gray-700 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      />
    </div>
  );
}
