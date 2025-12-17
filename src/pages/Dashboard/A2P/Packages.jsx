import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../config";

export default function PackagesPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const tableHeaderBg = 'gray-100'; 

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    setUserData(JSON.parse(data));
  }, [navigate]);

  const fetchPackageHistory = async () => {
    if (!userData) return;
    setLoadingPackages(true);
    try {
      const res = await fetch(`${apiUrl}api/RasaelCP/GetPackageHistory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ clientID: userData.userID }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error(err);
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    if (userData) fetchPackageHistory();
  }, [userData]); // Re-run when userData is set/updated

  // Loading state when initial user data is being checked
  if (!userData) return <p className="p-5 rtl font-['Tajawal',_sans-serif]">جارٍ تحميل البيانات...</p>;

  return (
    <section className="p-5 max-w-5xl mx-auto rtl font-['Tajawal',_sans-serif]">
      <div className="package-history">
        <h4 className="text-2xl font-bold mb-4">سجل الباقات</h4>
        
        {loadingPackages ? (
          <p className="text-gray-600">جارٍ تحميل البيانات...</p>
        ) : packages.length === 0 ? (
          <p className="text-gray-600">لا توجد بيانات متاحة</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead className={`text-sm text-gray-700 uppercase bg-${tableHeaderBg}`}>
                <tr>
                  <th scope="col" className="px-6 py-3 border border-gray-300 text-center font-semibold">اسم الباقة</th>
                  <th scope="col" className="px-6 py-3 border border-gray-300 text-center font-semibold">حجم الباقة</th>
                  <th scope="col" className="px-6 py-3 border border-gray-300 text-center font-semibold">تاريخ بداية العقد</th>
                  <th scope="col" className="px-6 py-3 border border-gray-300 text-center font-semibold">تاريخ نهاية العقد</th>
                </tr>
              </thead>
              <tbody>
                {packages
                  .slice()
                  .sort((a, b) => {
                    // Sort by createdContract date descending
                    const dateA = a.createdContract ? new Date(a.createdContract) : new Date(0);
                    const dateB = b.createdContract ? new Date(b.createdContract) : new Date(0);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map((p) => (
                    <tr key={p.idSeq} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 border border-gray-300 text-center font-medium text-gray-900">{p.packageArname}</td>
                      <td className="px-6 py-4 border border-gray-300 text-center">{p.packageSize}</td>
                      <td className="px-6 py-4 border border-gray-300 text-center">
                        {p.createdContract ? new Date(p.createdContract).toLocaleDateString("en-GB") : "-"}
                      </td>
                      <td className="px-6 py-4 border border-gray-300 text-center">
                        {p.finsihContract ? new Date(p.finsihContract).toLocaleDateString("en-GB") : "-"}
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