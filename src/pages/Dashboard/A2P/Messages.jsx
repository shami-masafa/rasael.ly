import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "../../../config";
import { FaSearch } from "react-icons/fa";

export default function Messages() {
  const [history, setHistory] = useState([]);
  const [filterPhone, setFilterPhone] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Define colors based on original CSS for consistency
  const primaryColor = '455785'; // Custom Blue/Indigo
  const secondaryColor = 'fcc749'; // Custom Yellow/Amber

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");

    // Default dates (Yesterday to Tomorrow) for the API call if filters are empty
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
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          clientId: userData.userID,
          phoneNo: filterPhone,
          fdate: fromDate,
          tdate: toDate,
        }),
      });

            console.log(sessionStorage.getItem("token"));
      console.log("token:")
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        console.error("Failed to fetch history:", res.status, await res.text());
        setHistory([]);
      }
    } catch (err) {
      console.error("API call error:", err);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterPhone, filterFromDate, filterToDate]);

  useEffect(() => {
    // Initialize default date filters on mount if not set
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (!filterFromDate)
      setFilterFromDate(yesterday.toISOString().split("T")[0]);
    if (!filterToDate)
      setFilterToDate(tomorrow.toISOString().split("T")[0]);

    // Initial fetch
    fetchHistory();
  }, [fetchHistory]);


  const filteredHistory = history.filter((h) => {
    if (filterPhone && !h.phoneNo?.includes(filterPhone)) return false;
 

    return true;
  });

  const totalPageCount = filteredHistory.reduce(
    (sum, h) => sum + (h.pageCount || 0),
    0
  );

  const maskMessage = (msg) => {
    if (!msg) return "";
    // Show first 10 characters followed by asterisks
    const visible = msg.substring(0, 10);
    return (
      visible +
      " *************************************************************************************"
    );
  };

  return (
    <div className="p-2 max-w-5xl mx-auto rtl font-['Tajawal',_sans-serif]">
      <h4 className="text-2xl font-bold mb-6 text-brand-primary">سجل الرسائل المرسلة</h4>

      {/* Filter Row - Improved Responsive Layout */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        
        {/* Phone Filter */}
        <div className="flex flex-col flex-1 min-w-[150px] sm:max-w-xs">
          <label className="text-sm font-semibold text-gray-700 mb-1">رقم الهاتف:</label>
          <input
            type="text"
            placeholder="بحث برقم الهاتف"
            value={filterPhone}
            onChange={(e) => setFilterPhone(e.target.value)}
            className={`p-2 border border-[#${primaryColor}] rounded-md focus:ring-1 focus:ring-offset-2 focus:ring-[#${primaryColor}]`}
          />
        </div>

        {/* From Date Filter */}
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm font-semibold text-gray-700 mb-1">من تاريخ:</label>
          <input
            type="date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
            className={`p-2 border border-[#${primaryColor}] rounded-md focus:ring-1 focus:ring-offset-2 focus:ring-[#${primaryColor}]`}
          />
        </div>

        {/* To Date Filter */}
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm font-semibold text-gray-700 mb-1">إلى تاريخ:</label>
          <input
            type="date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
            className={`p-2 border border-[#${primaryColor}] rounded-md focus:ring-1 focus:ring-offset-2 focus:ring-[#${primaryColor}]`}
          />
        </div>

        {/* Search Button */}
        <button 
          type="button" 
          onClick={fetchHistory} 
          disabled={isLoading}
          className={`px-4 py-2 bg-[#${primaryColor}] text-white rounded-md cursor-pointer transition-all h-10 flex items-center justify-center 
            hover:bg-[#${secondaryColor}] hover:text-black disabled:bg-gray-400`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-2 border-t-[#fcc749] rounded-full animate-spin"></div>
          ) : (
            <FaSearch className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-6 mb-4 font-medium text-lg">
        <p>
          عدد الرسائل: <strong className="text-[#455785]">{filteredHistory.length}</strong>
        </p>
        <p>
          مجموع عدد الصفحات: <strong className="text-[#455785]">{totalPageCount}</strong>
        </p>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-right text-gray-500 history-table">
          <thead className=" text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300">رقم الهاتف</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300 w-3/5">الرسالة</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300">عدد الصفحات</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 border border-gray-300">
                  {isLoading ? 'جاري التحميل...' : 'لا توجد رسائل'}
                </td>
              </tr>
            )}
            {filteredHistory.map((h, i) => (
              <tr 
                key={i} 
                className="bg-white border-b border-gray-300 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-center border border-gray-300 font-medium text-gray-900">{h.phoneNo}</td>
                <td className="px-6 py-4 text-center border border-gray-300">{maskMessage(h.msg)}</td>
                <td className="px-6 py-4 text-center border border-gray-300">{h.pageCount}</td>
                <td className="px-6 py-4 text-center border border-gray-300">
                  {new Date(h.createdAt).toLocaleString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}