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
import { apiUrl } from "../../../config";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ADSStatistics() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState([]);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);

  const monthNames = [
    "�?�?�?�?�?", "�?�?�?�?�?�?", "�?�?�?�?", "��?�?�?�?", "�?�?�?�?", "�?�?�?�?�?",
    "�?�?�?�?�?", "��?�?���?", "�?�?�?�?�?�?", "��?�?�?�?�?", "�?�?�?�?�?�?", "�?�?�?�?�?�?",
  ];

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      navigate("/login");
      return;
    }
    setUserData(JSON.parse(data));
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      fetchBalanceInfo();
      fetchPackageHistory();
    }
  }, [userData]);

  useEffect(() => {
    if (userData) fetchStats();
  }, [userData, year, month]);

  const fetchBalanceInfo = async () => {
    try {
      const res = await fetch(`${apiUrl}api/User/GetClientInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}api/RasaelCP/GetSmsStats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ClientId: userData.userID,
          Year: year,
          Month: month,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setStats([]);
      setError("�?�?� �?��� ���?�?�? �?�?�? �?�?�?�?���?�?�?�?�?");
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageHistory = async () => {
    setLoadingPackages(true);
    try {
      const res = await fetch(`${apiUrl}api/RasaelCP/GetPackageHistory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ clientID: userData.userID }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  if (!userData) {
    return <p className="p-6 text-center text-gray-600">�?�?�?�? �?�?�?�?�? �?�?�?�?�?�?�?�?...</p>;
  }

  const chartLabels =
    month === 0
      ? monthNames
      : Array.from({ length: stats.length || 30 }, (_, i) => `${i + 1}`);
  const chartValues = stats.map((x) => Number(x.totalCount ?? x.value ?? 0));
  const totalMessages = chartValues.reduce((sum, val) => sum + val, 0);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "�?�?�? �?�?�?�?�?�?�? �?�?�?�?�?�?�?",
        data: chartValues,
        borderColor: "#455785",
        backgroundColor: "rgba(69,87,133,0.25)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: month === 0 ? "�?�?�?�?�?" : "�?�?�?�?�?",
        },
      },
      y: {
        title: { display: true, text: "�?�?�? �?�?�?�?�?�?�?" },
        beginAtZero: true,
      },
    },
  };

  const sortedPackages = packages
    .slice()
    .sort((a, b) => {
      const dateA = a.createdContract ? new Date(a.createdContract) : new Date(0);
      const dateB = b.createdContract ? new Date(b.createdContract) : new Date(0);
      return dateB - dateA;
    });

  return (
    <section className="space-y-6 p-4 text-right">
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="�?�?�?���?�? �?�?�?�?�?�?" value={balanceInfo?.balance ?? "-"} />
            <StatCard label="�?�?�?���?�?�?" value={balanceInfo?.spend ?? "-"} />
            <StatCard label="�?�?�?�?�? �?�?�?�?�?�?�?�?" value={balanceInfo?.finishContract ?? userData?.finishContract ?? "-"} />
            <StatCard
              label={month === 0 ? "�?�?�?�?�? �?���? �?�?�?�?�?" : "�?�?�?�?�? �?���? �?�?�?�?�?"}
              value={totalMessages}
            />
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-brand-primary focus:outline-none"
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-brand-primary focus:outline-none"
            >
              <option value={0}>�?�? �?�?��?�?�?</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="h-[360px]">
          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-center text-sm text-red-600">{error}</p>
          ) : chartValues.length === 0 ? (
            <p className="text-center text-sm text-gray-500">�?�? �?�?�?�? �?�?�?�?�?�? �?�?�?�?�?</p>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h4 className="mb-4 text-2xl font-bold text-brand-primary">�?�?�? �?�?�?�?�?�?�?</h4>
        {loadingPackages ? (
          <p>�?�?�?�? �?�?�?�?�? �?�?�?�?�?�?�?�?...</p>
        ) : sortedPackages.length === 0 ? (
          <p>�?�? �?�?�?�? �?�?�?�?�?�? �?�?�?�?�?</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full table-fixed border-collapse text-sm text-gray-700">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                <tr>
                  <th className="px-3 py-2">�?�?�? �?�?�?�?�?�?</th>
                  <th className="px-3 py-2">�?�?�? �?�?�?�?�?�?</th>
                  <th className="px-3 py-2">�?�?�?�?�? �?�?�?�?�? �?�?�?�?�?</th>
                  <th className="px-3 py-2">�?�?�?�?�? �?�?�?�?�? �?�?�?�?�?</th>
                </tr>
              </thead>
              <tbody>
                {sortedPackages.map((p) => (
                  <tr key={p.idSeq} className="border-b border-gray-100 last:border-none">
                    <td className="px-3 py-2">{p.packageArname}</td>
                    <td className="px-3 py-2">{p.packageSize}</td>
                    <td className="px-3 py-2">
                      {p.createdContract
                        ? new Date(p.createdContract).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td className="px-3 py-2">
                      {p.finsihContract
                        ? new Date(p.finsihContract).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-brand-primary px-4 py-3 text-white shadow-card">
      <span className="text-xs text-brand-muted/80">{label}</span>
      <strong className="text-lg">{value}</strong>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex h-full items-center justify-center gap-3 text-sm text-gray-500">
      <span className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-l-brand-primary" />
      �?�?�?�? �?�?�?�?�? �?�?�?�?�?�?�?�?...
    </div>
  );
}
