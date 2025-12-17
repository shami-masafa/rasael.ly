import { useEffect, useState } from "react";
import { apiUrl } from "../../config";

// --- Utility Functions ---

/**
 * Formats a date string to DD/MM/YYYY using English digits.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date or "-" if invalid/missing.
 */
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  // Use "en-GB" for DD/MM/YYYY format and English digits (default for JS)
  return date.toLocaleDateString("en-GB");
}

/**
 * Formats a number to a string with two decimal places.
 * @param {string | number} value - The numerical value to format.
 * @returns {string} The formatted number or "-".
 */
function formatCurrency(value) {
  const num = Number(value);
  if (isNaN(num)) return "-";
  // Use 'en-US' or similar locale for standard decimal formatting
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// --- Component ---

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientId, setClientId] = useState("");

  useEffect(() => {
  const clientId = sessionStorage.getItem("clientId");
  if (clientId) {
    setClientId(clientId);
  }
    else {
      setError("معرف العميل مفقود."); // Client ID missing
      return;
    }

    const fetchInvoices = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${apiUrl}api/RasaelCP/GetInvoices?clientId=${clientId}&flag=2`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          // Attempt to read error message from body if available
          const errorBody = await res.text();
          console.error("Fetch error response body:", errorBody);
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("حدث خطأ أثناء جلب الفواتير"); // Error occurred while fetching invoices
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [clientId]); // Depend on clientId to refetch if it changes

  // --- Rendering Logic ---

  if (loading)
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        جاري التحميل...
      </div>
    ); // Loading...

  if (error)
    return (
      <div className="text-center bg-red-100 text-red-700 p-4 rounded-lg my-10 border border-red-300">
        {error}
      </div>
    );

  return (
    <div className="p-5 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-brand-primary">
        قائمة الفواتير
      </h1>

      {invoices.length === 0 ? (
        <p className="text-gray-500 text-center py-10 text-xl bg-gray-50 rounded-lg border">
          لا توجد فواتير.
        </p> 
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-brand-primary/10 text-right">
              <tr>
                <TableHeader label="رقم الفاتورة" />
                <TableHeader label="الباقة" />
                <TableHeader label="الكمية" />
                <TableHeader label="سعر الوحدة" />
                <TableHeader label="إجمالي الفاتورة" />
                <TableHeader label="تاريخ الإنشاء" />
                <TableHeader label="الحالة" />
                <TableHeader label="تاريخ الدفع" />
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((inv, i) => {
                const invoiceTotal =
                  Number(inv.packageQty) * Number(inv.packagePrice);

                // Determine the status (paid/unpaid) based on paymentDate or paymentType
                // Assuming a paymentDate indicates payment has been made, or check for 'paymentType'
                const isPaid = inv.paymentDate && inv.paymentDate !== "0001-01-01T00:00:00";
                const status = isPaid ? "مدفوعة" : "غير مدفوعة";
                const statusColor = isPaid
                  ? "text-brand-primary"
                  : "text-red-600";

                return (
                  <tr key={i} className="hover:bg-gray-50 transition duration-150">
                    <TableData text={inv.invoiceNo} />
                    <TableData text={inv.packageArname} />
                    <TableData text={inv.packageQty} />
                    <TableData text={`${formatCurrency(inv.packagePrice)} د.ل`} />
                    <TableData
                      text={`${formatCurrency(invoiceTotal)} د.ل`}
                      className="font-bold text-gray-800"
                    />
                    <TableData text={formatDate(inv.invoiceDate)} />
                    <TableData
                      text={status}
                      className={`text-sm font-semibold p-1 rounded-full text-center whitespace-nowrap ${statusColor}`}
                    />
                    <TableData text={formatDate(inv.paymentDate)} />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- Sub-Components for Readability ---

const TableHeader = ({ label }) => (
  <th className="py-4 px-6 font-bold text-gray-700 uppercase tracking-wider text-sm border-b-2 border-brand-primary/50">
    {label}
  </th>
);

const TableData = ({ text, className = "" }) => (
  <td className={`py-4 px-6 border-b border-gray-100 text-sm text-gray-700 whitespace-nowrap ${className}`}>
    {text || "-"}
  </td>
);  