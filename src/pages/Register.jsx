import { useState, useEffect, useMemo } from "react";
import Popup from "../Popup.jsx";
import { apiUrl, turnstileSiteKey } from "../config";
import Turnstile from "react-turnstile";
import { FaChevronDown } from "react-icons/fa";

/* ------------------------------------------------------
   FIXED COMPONENT — MUST BE OUTSIDE THE REGISTER COMPONENT
   ------------------------------------------------------ */
function ServiceSection({
  serviceType,
  useService,
  setUseService,
  packages,
  selectedPackage,
  setSelectedPackage,
  messageCount,
  setMessageCount,
  price,
  sender,
  setSender,
  isCustomSelected,
  customMin,
  senderCost,
  isTestPackage,
}) {
  const isA2P = serviceType === "A2P";

  const bgColor = isA2P ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200";
  const headerColor = isA2P ? "text-blue-800" : "text-yellow-800";
  const serviceName = isA2P ? "التنبيه (A2P)" : "الرسائل الدعائية (Bulk SMS)";

  let senderNote = isA2P
    ? `(تكلفة الهوية المرسلة: ${senderCost.toLocaleString()} دينار سنوياً)`
    : "(الهوية المرسلة مجانية)";

  if (isTestPackage) {
      senderNote = "(الهوية المرسلة مجانية)";
  }

  return (
    <div className={`border rounded-lg px-5 py-2 space-y-4 ${bgColor}`}>
      {/* Header */}
      <div
        onClick={() => setUseService(!useService)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <label className="flex items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            checked={useService}
            onChange={() => setUseService(!useService)}
            className={`h-5 w-5 ${isA2P ? "accent-blue-600" : "accent-yellow-600"}`}
          />
          <h3 className={`text-lg font-semibold ${headerColor}`}>خدمات {serviceName}</h3>
        </label>

        <FaChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${headerColor} ${
            useService ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Animated dropdown */}
      <div
        className={`
          overflow-hidden transition-all duration-300 
          ${useService ? "max-h-[1200px] opacity-100 pt-4" : "max-h-0 opacity-0"}
        `}
      >
        {useService && (
          <div className="space-y-4">

            {/* Package selection */}
            <div>
              <label className="block mb-1 text-gray-700">اختر الباقة</label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="">-- اختر الباقة --</option>
                {packages.map((pkg) => (
                  <option key={pkg.packageID} value={pkg.packageID}>
                    {pkg.packageArname}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom package / Fixed package details */}
            {isCustomSelected ? (
              <div>
                <label className="block mb-1 text-gray-700">
                  عدد الرسائل (الحد الأدنى: {customMin.toLocaleString()})
                </label>
                <input
                  type="number"
                  value={messageCount}
                  onChange={(e) => setMessageCount(e.target.value)}
                  min={customMin}
                  className="w-full p-3 border rounded-md"
                />
                <p className="text-sm text-red-500 mt-1">
                  * سعر هذه الباقة يتم تحديده بعد إرسال الطلب.
                </p>
              </div>
            ) : (
              selectedPackage && (
                <>
                  <div>
                    <label className="block mb-1 text-gray-700">عدد الرسائل</label>
                    <input
                      readOnly
                      value={messageCount ? Number(messageCount).toLocaleString() : ""}
                      className="w-full p-3 border rounded-md bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-700">السعر الإجمالي</label>
                    <input
                      readOnly
                      value={price ? Number(price).toLocaleString() : ""}
                      className="w-full p-3 border rounded-md bg-gray-100"
                    />
                    {isTestPackage && (
                        <p className="text-sm text-green-600 mt-1">
                            * هذه الباقة مجانية بالكامل.
                        </p>
                    )}
                  </div>
                </>
              )
            )}

            {/* Sender ID */}
            <div>
              <label className="block mb-1 text-gray-700">
                الهوية المرسلة <span className="text-sm text-gray-500">{senderNote}</span>
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                readOnly={isTestPackage} // Prevent editing for the test package
                className={`w-full p-3 border rounded-md ${isTestPackage ? 'bg-gray-100' : ''}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------
   MAIN REGISTER COMPONENT
   ------------------------------------------------------ */
export default function Register() {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [activity, setActivity] = useState("");

    const [useA2P, setUseA2P] = useState(false);
    const [useAds, setUseAds] = useState(false);

    const [packagesData, setPackagesData] = useState([]);

    const [a2pPackage, setA2pPackage] = useState("");
    const [a2pMessageCount, setA2pMessageCount] = useState("");
    const [a2pPrice, setA2pPrice] = useState("");
    const [a2pSender, setA2pSender] = useState("");

    const [adsPackage, setAdsPackage] = useState("");
    const [adsMessageCount, setAdsMessageCount] = useState("");
    const [adsPrice, setAdsPrice] = useState("");
    const [adsSender, setAdsSender] = useState("");

    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({ show: false, title: "", message: "" });
const [captchaToken, setCaptchaToken] = useState("");


    // Constants
    const A2P_CUSTOM_MIN = 250000;
    const ADS_CUSTOM_MIN = 1100000;
    const A2P_SENDER_ID_COST = 500;
    
    // Fixed Test Package Details
    const A2P_TEST_PACKAGE = {
        packageID: "test", // Use a unique string ID for the test package
        packageArname: "الباقة تجريبية",
        packageTypeFlag: 0,
        packageQty: 50,
        packagePrice: 0,
        isTest: true,
    };
    const A2P_TEST_SENDER = "13201";

    const showPopup = (message, title = "تنبيه") => {
        setPopup({ show: true, title, message });
    };
    const handleClosePopup = () => setPopup({ show: false, title: "", message: "" });

    /* Load Packages */
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(`${apiUrl}api/RasaelCP/GetPackages`);
                if (!res.ok) throw new Error("فشل تحميل الباقات من الخادم");
                let data = await res.json();

                // 1. Separate A2P and ADS
                let a2pFromApi = data.filter(p => p.packageTypeFlag === 0);
                let adsFromApi = data.filter(p => p.packageTypeFlag === 1);

                // 2. Inject the fixed free test package at the beginning of the A2P list
                let finalA2P = [A2P_TEST_PACKAGE, ...a2pFromApi];
                
                // 3. Remove duplicates just in case and combine
                const uniqueData = [...new Map([...finalA2P, ...adsFromApi].map(item => [item.packageID, item])).values()];
                setPackagesData(uniqueData);

            } catch (error) {
                showPopup(`فشل تحميل الباقات: ${error.message}`);
            }
        };
        fetchPackages();
    }, []);

    /* Filter Packages */
    const a2pPackages = useMemo(() => packagesData.filter((p) => p.packageTypeFlag === 0), [packagesData]);
    const adsPackages = useMemo(() => packagesData.filter((p) => p.packageTypeFlag === 1), [packagesData]);

    const a2pCustomPackageId = a2pPackages.length > 0 ? a2pPackages[a2pPackages.length - 1]?.packageID.toString() : null;
    const adsCustomPackageId = adsPackages.length > 0 ? adsPackages[adsPackages.length - 1]?.packageID.toString() : null;

    const isA2pCustomSelected = a2pPackage === a2pCustomPackageId;
    const isAdsCustomSelected = adsPackage === adsCustomPackageId;
    const isA2pTestSelected = a2pPackage === A2P_TEST_PACKAGE.packageID;

    /* Get selected package details for submit */
    const selectedA2pPackage = useMemo(() => 
        a2pPackages.find((p) => p.packageID.toString() === a2pPackage)
    , [a2pPackage, a2pPackages]);

    const selectedAdsPackage = useMemo(() => 
        adsPackages.find((p) => p.packageID.toString() === adsPackage)
    , [adsPackage, adsPackages]);
    
    /* Auto-fill A2P price & sender on package change */
    useEffect(() => {
        const pkg = a2pPackages.find((p) => p.packageID.toString() === a2pPackage);
        if (!pkg) return setA2pMessageCount(""), setA2pPrice(""), setA2pSender("");

        if (pkg.packageID === A2P_TEST_PACKAGE.packageID) {
            setA2pMessageCount(A2P_TEST_PACKAGE.packageQty.toString());
            setA2pPrice(A2P_TEST_PACKAGE.packagePrice.toString());
            setA2pSender(A2P_TEST_SENDER);
        }
        else if (pkg.packageID.toString() === a2pCustomPackageId) {
            setA2pMessageCount("");
            setA2pPrice("");
            setA2pSender(""); // Clear sender for custom, user must enter it
        } else {
            setA2pMessageCount(pkg.packageQty.toString());
            setA2pPrice((pkg.packageQty * pkg.packagePrice).toString());
            setA2pSender(""); // Clear sender, user must enter it
        }
    }, [a2pPackage, a2pPackages, a2pCustomPackageId]);

    /* Auto-fill ADS price on package change */
    useEffect(() => {
        const pkg = adsPackages.find((p) => p.packageID.toString() === adsPackage);
        if (!pkg) return setAdsMessageCount(""), setAdsPrice(""), setAdsSender("");

        if (pkg.packageID.toString() === adsCustomPackageId) {
            setAdsMessageCount("");
            setAdsPrice("");
        } else {
            setAdsMessageCount(pkg.packageQty.toString());
            setAdsPrice((pkg.packageQty * pkg.packagePrice).toString());
        }
        setAdsSender(""); // Clear sender, user must enter it
    }, [adsPackage, adsPackages, adsCustomPackageId]);

    /* Total Price calculation */
    const totalPrice = useMemo(() => {
        let total = 0;
        if (useA2P) {
            // A2P Package Price
            if (a2pPrice && !isA2pCustomSelected) {
                 total += Number(a2pPrice);
            }
            // A2P Sender ID Cost (Apply only if not the free test package)
            if (!isA2pTestSelected) {
                total += A2P_SENDER_ID_COST;
            }
        }
        
        if (useAds && adsPrice && !isAdsCustomSelected) {
             total += Number(adsPrice);
        }
        return total;
    }, [useA2P, useAds, a2pPrice, adsPrice, isA2pCustomSelected, isAdsCustomSelected, isA2pTestSelected]);

    /* ------------------------------------------------------
       NEW: Read URL parameters for package pre-selection
       ------------------------------------------------------ */
    useEffect(() => {
        // Read the URL search string
        const params = new URLSearchParams(window.location.search);
        const type = params.get('packageType');
        const id = params.get('packageId');

        if (id) {
            if (type === 'A2P') {
                setUseA2P(true);
                setA2pPackage(id);
                // Clear ADS state just in case
                setUseAds(false);
                setAdsPackage("");
            } else if (type === 'ADS') {
                setUseAds(true);
                setAdsPackage(id);
                // Clear A2P state just in case
                setUseA2P(false);
                setA2pPackage("");
            }
        }
    }, []); // Empty dependency array means this runs only once on mount

    /* Submit Handler */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            showPopup("يرجى التحقق من أنك لست روبوتًا.");
            return;
        }

        if (!useA2P && !useAds) {
            showPopup("يرجى اختيار خدمة واحدة على الأقل.");
            return;
        }

        if (useA2P) {
            if (!a2pPackage) return showPopup("يرجى اختيار باقة A2P.");
            
            if (isA2pCustomSelected && (Number(a2pMessageCount) < A2P_CUSTOM_MIN || !a2pMessageCount))
                return showPopup(`الحد الأدنى لعدد رسائل A2P هو ${A2P_CUSTOM_MIN.toLocaleString()}.`);
            
            if (!a2pSender) return showPopup("يرجى إدخال الهوية المرسلة لخدمات A2P.");
        }

        if (useAds) {
            if (!adsPackage) return showPopup("يرجى اختيار باقة الإعلانات.");
            
            if (isAdsCustomSelected && (Number(adsMessageCount) < ADS_CUSTOM_MIN || !adsMessageCount))
                return showPopup(`الحد الأدنى لعدد رسائل الإعلانات هو ${ADS_CUSTOM_MIN.toLocaleString()}.`);
            
            if (!adsSender) return showPopup("يرجى إدخال الهوية المرسلة لخدمات الإعلانات.");
        }

        setLoading(true);

        try {
            // Determine package names and final prices for DB insert
            const finalA2pPackageName = useA2P ? (isA2pTestSelected ? A2P_TEST_PACKAGE.packageArname : selectedA2pPackage?.packageArname) : null;
            const finalA2pPackagePrice = useA2P && !isA2pCustomSelected ? (isA2pTestSelected ? 0 : Number(a2pPrice)) : null;

            const finalAdsPackageName = useAds ? selectedAdsPackage?.packageArname : null;
            const finalAdsPackagePrice = useAds && !isAdsCustomSelected ? Number(adsPrice) : null;

            const body = {
                ClientName: fullName,
                PhoneNo: phone,
                Email: email,
                CompanyName: companyName,
                Activity: activity,
                
                A2PPackageName: finalA2pPackageName,
                A2PMessageCount: useA2P ? Number(a2pMessageCount) : null,
                A2PPackagePrice: finalA2pPackagePrice,
                A2PSenderId: useA2P ? a2pSender : null,

                ADSPackageName: finalAdsPackageName, 
                ADSMessageCount: useAds ? Number(adsMessageCount) : null,
                ADSPackagePrice: finalAdsPackagePrice,
                ADSSenderId: useAds ? adsSender : null,
            };

            console.log(body);
            const response = await fetch(`${apiUrl}api/User/SendClientRequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error(await response.text());
            showPopup("تم إرسال طلب التسجيل بنجاح!", "نجاح");

            // Clear form
            setFullName(""); setPhone(""); setEmail(""); setCompanyName(""); setActivity("");
            setUseA2P(false); setUseAds(false);
            setA2pPackage(""); setA2pMessageCount(""); setA2pPrice(""); setA2pSender("");
            setAdsPackage(""); setAdsMessageCount(""); setAdsPrice(""); setAdsSender("");

        } catch (error) {
            showPopup("حدث خطأ: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
      <section 
        className="min-h-screen flex justify-center items-center p-2 font-[Tajawal] direction-rtl"
        // Pattern Background Style
        style={{
            backgroundColor: '#F3F4F6',
            backgroundImage: `
                repeating-linear-gradient(45deg, #E0F2FE 25%, transparent 25%, transparent 75%, #E0F2FE 75%, #E0F2FE),
                repeating-linear-gradient(-45deg, #E0F2FE 25%, transparent 25%, transparent 75%, #E0F2FE 75%, #E0F2FE)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
        }}
      >
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 relative z-10">

          <h1 className="text-3xl font-bold text-right text-[#455785] mb-1">
            التسجيل في منصة رسائل
          </h1>
          <sub>
            يرجى تعبئة البيانات المطلوبة للأشتراك في منصة رسائل.
          </sub>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">بيانات التواصل والشركة</h2>

                <div>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md" placeholder="الأسم بالكامل..."/>
                </div>

                <div>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md" placeholder="رقم الهاتف..."/>
                </div>

                <div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md" placeholder="البريد الإلكتروني..."/>
                </div>

                <div>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md" placeholder="اسم الشركة..."/>
                </div>

                <div>
                  <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md" placeholder="نوع النشاط..."/>
                </div>
                                          <Turnstile
                            sitekey={turnstileSiteKey}
                            onVerify={(token) => setCaptchaToken(token)}
                            theme="light"
                          />    
              </div>
              

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">اختر الخدمات والباقات</h2>

                <ServiceSection
                  serviceType="A2P"
                  useService={useA2P}
                  setUseService={setUseA2P}
                  packages={a2pPackages}
                  selectedPackage={a2pPackage}
                  setSelectedPackage={setA2pPackage}
                  messageCount={a2pMessageCount}
                  setMessageCount={setA2pMessageCount}
                  price={a2pPrice}
                  sender={a2pSender}
                  setSender={setA2pSender}
                  isCustomSelected={isA2pCustomSelected}
                  customMin={A2P_CUSTOM_MIN}
                  senderCost={A2P_SENDER_ID_COST}
                  isTestPackage={isA2pTestSelected}
                />

                <ServiceSection
                  serviceType="ADS"
                  useService={useAds}
                  setUseService={setUseAds}
                  packages={adsPackages}
                  selectedPackage={adsPackage}
                  setSelectedPackage={setAdsPackage}
                  messageCount={adsMessageCount}
                  setMessageCount={setAdsMessageCount}
                  price={adsPrice}
                  sender={adsSender}
                  setSender={setAdsSender}
                  isCustomSelected={isAdsCustomSelected}
                  customMin={ADS_CUSTOM_MIN}
                  senderCost={0}
                  isTestPackage={false}
                />
              </div>
            </div>

            {/* Total */}
            <div className="mt-8 pt-4 border-t border-gray-300 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-[#455785] flex justify-between items-center">
                <span>إجمالي السعر المبدئي </span>
                <span className="text-3xl">{totalPrice.toLocaleString()} د.ل</span>
              </h3>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-md text-lg text-white transition mt-8 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#455785] hover:bg-yellow-400 hover:text-black"
              }`}
            >
              {loading ? "جارٍ إرسال الطلب..." : "إرسال طلب التسجيل"}
            </button>
          </form>
        </div>

        <Popup {...popup} onClose={handleClosePopup} />
      </section>
    );
}