  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Line } from "react-chartjs-2";
  import {
    FaWallet,
    FaClock,
    FaMoneyBillWave,
    FaCalendarDay,
  } from "react-icons/fa";
  import { apiUrl } from "../../../config";

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

  export default function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState([]);
    const [balanceInfo, setBalanceInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [monthChartData, setMonthChartData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [loadingMonth, setLoadingMonth] = useState(false);

    const monthNames = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
    ];

    // helper for formatting numbers safely
    const formatNumber = (num) => {
      if (num === null || num === undefined || num === "" || isNaN(num)) return "-";
      const numericValue = Number(num);
    
      return numericValue.toLocaleString("en-US");
    };

    const formatDate = (value) => {
      if (!value) return "-";

      // If already formatted like dd-MM-yyyy
      if (typeof value === "string" && value.includes("-")) {
        return value.replaceAll("-", "/");
      }

      const date = new Date(value);
      if (isNaN(date.getTime())) return value;

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };


    useEffect(() => {
      const data = sessionStorage.getItem("userData");
  
      if (!data) {
        navigate("/login");
        return;
      }
      setUserData(JSON.parse(data));
    }, [navigate]);

    useEffect(() => {
      if (userData) {
        if (!balanceInfo) fetchBalanceInfo(); // only fetch once
        fetchStats();
      }
    }, [userData, year]);

    const fetchBalanceInfo = async () => {
      try {
        const res = await fetch(`${apiUrl}api/User/GetClientInfo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ clientID: userData.userID, userName: userData.mainUser }),
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setBalanceInfo(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchStats = async () => {
      if (!userData) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${apiUrl}api/RasaelCP/GetSmsStats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ClientId: userData.userID, Year: year }),
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        const completeStats = Array.from({ length: 12 }, (_, i) => {
          const monthData = data.find((x) => x.label === i + 1);
          return { label: i + 1, value: monthData ? monthData.totalCount : 0 };
        });

        setStats(completeStats);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب الإحصائيات");
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    const handleYearChange = (e) => setYear(Number(e.target.value));

    const handleMonthClick = async (month) => {
      setSelectedMonth(month);
      setLoadingMonth(true);
      setMonthChartData(null);

      try {
        const res = await fetch(`${apiUrl}api/RasaelCP/GetSmsStats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ClientId: userData.userID, Year: year, Month: month }),
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
        const libyanaData = daysInMonth.map(d => {
          const dayData = data.find(x => x.label === d);
          return dayData ? dayData.libyanaCount : 0;
        });
        const madarData = daysInMonth.map(d => {
          const dayData = data.find(x => x.label === d);
          return dayData ? dayData.madarCount : 0;
        });

        setMonthChartData({
          labels: daysInMonth,
          datasets: [
            {
              label: "Libyana",
              data: libyanaData,
              borderColor: "#D63384",
              backgroundColor: "rgba(214, 51, 132, 0.3)",
              fill: false,
              tension: 0.3,
            },
            {
              label: "Madar",
              data: madarData,
              borderColor: "green",
              backgroundColor: "rgba(0,255,0,0.2)",
              fill: false,
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMonth(false);
      }
    };

    const handleBackToYearly = () => {
      setSelectedMonth(null);
      setMonthChartData(null);
    };

    const chartLabels = monthNames;
    const chartValues = stats.map((x) => x.value || 0);
    const totalMessages = chartValues.reduce((sum, val) => sum + val, 0);

    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: "عدد الرسائل الشهرية",
          data: chartValues,
          borderColor: "#455785",
          backgroundColor: "rgba(69, 87, 133, 0.3)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false, onClick: null } },
      scales: {
        x: { title: { display: true, text: selectedMonth ? "" : "" } },
        y: { beginAtZero: true, title: { display: true, text: "عدد الرسائل" } },
      },
    };

    if (!userData) return <p>جارٍ تحميل البيانات...</p>;


    return (
      <section className="p-5" dir="rtl">
        {/*  */}
        <div className="flex flex-wrap gap-5">
          {/* LEFT: Chart + General Info */}
          <div className="flex flex-col gap-5 flex-grow min-w-[350px]">
            {/* Info Boxes (Wallets/Balance) */}
            <div className="flex flex-wrap gap-2.5">
              {/* إجمالي الباقات - Total Balance + Spend */}
              <div className="flex flex-col items-center justify-center flex-1 min-w-[120px] bg-[#455785] text-white p-2 rounded-md">
                <FaWallet size={16} />
                <span className="text-sm text-gray-300">إجمالي الباقات</span>
                <strong className="text-base">{balanceInfo ? formatNumber((Number(balanceInfo?.balance) || 0) + (Number(balanceInfo?.spend) || 0)) : "..."}</strong>
              </div>
              {/* المصروف - Spent */}
              <div className="flex flex-col items-center justify-center flex-1 min-w-[120px] bg-[#455785] text-white p-2 rounded-md">
                <FaMoneyBillWave size={16} />
                <span className="text-sm text-gray-300">المصروف</span>
                <strong className="text-base">{balanceInfo ? formatNumber(balanceInfo?.spend) : "..."}</strong>
              </div>
              {/* الرصيد الحالي - Current Balance */}
              <div className="flex flex-col items-center justify-center flex-1 min-w-[120px] bg-[#455785] text-white p-2 rounded-md">
                <FaWallet size={16} />
                <span className="text-sm text-gray-300">الرصيد الحالي</span>
                <strong className="text-base">{balanceInfo ? formatNumber(balanceInfo?.balance) : "..."}</strong>
              </div>
              {/* تاريخ الانتهاء - Expiry Date */}
              <div className="flex flex-col items-center justify-center flex-1 min-w-[120px] bg-[#455785] text-white p-2 rounded-md">
                <FaClock size={16} />
                <span className="text-sm text-gray-300">تاريخ الانتهاء</span>
                <strong className="text-base">{userData ? formatDate(userData?.finishContract) : "-"}</strong>
              </div>
            </div>

            {/* Chart Wrapper */}
            <div className="bg-white rounded-lg shadow-md p-0 pb-7 max-h-[470px]">
              <div className="flex items-center justify-between mb-2.5 pt-2.5 px-4">
                {!selectedMonth && (
                  <select value={year} onChange={handleYearChange} className="p-1.5 rounded-md border border-gray-300 font-sans bg-gray-50 cursor-pointer text-sm">
                    {[2023, 2024, 2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                )}
                {selectedMonth && (
                  <button onClick={handleBackToYearly} className="py-1.5 px-3 rounded-md border-none bg-[#455785] text-white cursor-pointer ml-2.5 text-sm">
                    العودة للعرض السنوي
                  </button>
                )}

                {balanceInfo && (
                  <div className="flex items-center text-sm bg-gray-100 p-1.5 rounded-md text-gray-700">
                    <span className="text-gray-500 ml-1">اسم المرسل:</span>
                    <strong className="font-bold text-[#455785] ml-1">{balanceInfo?.senderID || "-"}</strong>
                    <span className="text-gray-500 ml-1.5">| انتهاء:</span>
                    <strong className="font-bold text-[#D63384]">
                    {balanceInfo?.senderExpire 
                      ? formatDate(balanceInfo.senderExpire) 
                      : formatDate(balanceInfo?.finishContract)}
                  </strong>
                  </div>
                )}
              </div>

              {/* Chart Area */}
              {loading ? (
                <div className="flex items-center justify-center gap-2 h-full py-10">
                  <div className="w-6 h-6 border-4 border-gray-200 border-t-[#455785] rounded-full animate-spin"></div>
                  <div className="text-sm text-gray-700">جارٍ تحميل بيانات السنة...</div>
                </div>
              ) : selectedMonth && loadingMonth ? (
                <div className="flex items-center justify-center gap-2 h-full py-10">
                  <div className="w-6 h-6 border-4 border-gray-200 border-t-[#455785] rounded-full animate-spin"></div>
                  <div className="text-sm text-gray-700">جارٍ تحميل بيانات الشهر...</div>
                </div>
              ) : (
                <>
                  <div className="h-[400px] w-full px-4">
                    <Line
                      data={selectedMonth && monthChartData ? monthChartData : chartData}
                      options={chartOptions}
                      height={400}
                    />
                  </div>
                  {selectedMonth && monthChartData && (
                    <div className="flex justify-start gap-5 mt-5 px-4 text-sm">
                      <span className="text-[#D63384] font-semibold">
                        <strong>Libyana:</strong> {formatNumber(monthChartData.datasets[0].data.reduce((a, b) => a + b, 0))}
                      </span>
                      <span className="text-green-600 font-semibold">
                        <strong>Madar:</strong> {formatNumber(monthChartData.datasets[1].data.reduce((a, b) => a + b, 0))}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Daily Info + Table */}
          <div className="flex flex-col gap-4 flex-1 min-w-[250px]">
            {/* Daily Info Boxes */}
            <div className="flex gap-2.5 flex-wrap">
              {/* رسائل اليوم - Messages Today */}
              <div className="flex flex-col items-center justify-center flex-1 bg-[#455785] text-white p-2 rounded-md">
                <FaCalendarDay size={16} />
                <span className="text-sm text-gray-300">رسائل اليوم</span>
                <strong className="text-base">{balanceInfo ? formatNumber(balanceInfo.spendToday) : "..."}</strong>
              </div>
              {/* رسائل أمس - Messages Yesterday */}
              <div className="flex flex-col items-center justify-center flex-1 bg-[#455785] text-white p-2 rounded-md">
                <FaCalendarDay size={16} />
                <span className="text-sm text-gray-300">رسائل أمس</span>
                <strong className="text-base">{balanceInfo ? formatNumber(balanceInfo.spendYesterday) : "..."}</strong>
              </div>
            </div>

            {/* Stats Table */}
            <div className="bg-white rounded-lg shadow-md overflow-y-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {stats.map((s, i) => (
                    <tr
                      key={i}
                      className={`border-t border-gray-200 ${s.value > 0 ? "cursor-pointer" : "cursor-default"} hover:bg-gray-100 transition-colors duration-150 ${selectedMonth === i + 1 ? "bg-gray-200" : ""}`}
                      onClick={() => s.value > 0 && handleMonthClick(i + 1)}
                    >
                      <td className="p-1.5 text-center border border-gray-300">{monthNames[i]}</td>
                      <td className="p-1.5 text-center border border-gray-300">{formatNumber(s.value)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200 font-bold">
                    <td className="p-1.5 text-center border border-gray-300"><strong>المجموع</strong></td>
                    <td className="p-1.5 text-center border border-gray-300"><strong>{formatNumber(totalMessages)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }