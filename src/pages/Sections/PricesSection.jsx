import { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaBox, FaTimes, FaUser, FaPhoneAlt, FaEnvelopeOpenText, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { apiUrl } from "../../config";


function RenewPopup({ isOpen, onClose, pkg, userData, clientInfo, onConfirm }) {
  const [newSenderName, setNewSenderName] = useState("");
  
  if (!isOpen || !pkg) return null;

  const totalPrice = (pkg.packageQty * pkg.packagePrice).toFixed(2);
  const data = JSON.parse(sessionStorage.getItem("userData"));
  
  // Expiry Logic
  const isExpired = data?.senderExpire ? new Date(data.senderExpire) < new Date() : false;

  const formatDate = (value) => {
    if (!value) return "-";
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
        <Motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="bg-white rounded-[16px] w-full max-w-lg overflow-hidden text-right max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-brand-primary p-3 px-5 text-white flex justify-between items-center">
            <h3 className="text-xl font-bold">تأكيد تجديد الاشتراك</h3>
            <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 text-white/80 hover:text-white">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Client Info Grid */}
            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs flex items-center gap-1 justify-start"> <FaUser size={10}/> اسم العميل</p>
                <p className="font-bold text-brand-dark">{clientInfo.username || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 text-xs flex items-center gap-1 justify-start"> <FaPhoneAlt size={10}/> رقم الهاتف</p>
                <p className="font-bold text-brand-dark">{clientInfo.phoneNo || "—"}</p>
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-gray-50 p-3 rounded-2xl space-y-3 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-l">اسم الباقة</span>
                <span className="font-bold text-brand-primary">{pkg.packageArname}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-gray-500 text-l">الكمية</span>
                <span className="font-bold text-brand-dark">{pkg.packageQty.toLocaleString()} رسالة</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-gray-500 text-xl font-bold">السعر الإجمالي:</span>
                <span className="font-bold text-brand-primary text-xl">{totalPrice} د.ل</span>
              </div>
            </div>

            {/* Sender ID Section */}
            <div className={`p-4 rounded-2xl border ${isExpired ? 'bg-red-50 border-red-200' : 'bg-brand-accent/10 border-brand-accent/20'}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-brand-dark font-bold text-sm flex items-center gap-2">
                  <FaEnvelopeOpenText className={isExpired ? "text-red-500" : "text-brand-accent"}/> معلومات هوية الإرسال
                </p>
                {isExpired && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FaExclamationTriangle size={8}/> منتهية الصلاحية
                  </span>
                )}
              </div>

              <div className="flex justify-between text-sm">
                 <span className="text-gray-600">هوية الإرسال الحالية:</span>
                 <span className={`font-semibold ${isExpired ? 'text-red-600 line-through' : 'text-brand-dark'}`}>
                   {data?.senderID || "13201"}
                 </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                 <span className="text-gray-600">تاريخ الانتهاء:</span>
                 <span className={`font-semibold ${isExpired ? 'text-red-600' : 'text-brand-dark'}`}>
                   {formatDate(data?.senderExpire) || "غير محدد"}
                 </span>
              </div>

              {/* Expired Notification & New Input */}
              {isExpired && (
                <div className="mt-4 pt-3 border-t border-red-200 space-y-3">
                  <p className="text-xs text-red-700 font-medium">
                    انتهت صلاحية هوية الإرسال الخاصة بك. تكلفة تجديد الهوية هي <span className="font-bold">500 د.ل / سنة</span>.
                  </p>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">طلب هوية إرسال جديدة:</label>
                    <input 
                      type="text" 
                      placeholder="أدخل اسم الهوية المطلوب..."
                      value={newSenderName}
                      onChange={(e) => setNewSenderName(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onConfirm(newSenderName)}
                className="w-full py-3 bg-brand-primary text-white rounded-2xl font-bold text-lg hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
              >
                تأكيد التجديد {isExpired && newSenderName && "+ طلب هوية"}
              </button>
            </div>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
}

function PricesSection({
  packages = [],
  loadingPackages,
  errorPackages,
  testPackage,
  businessQty,
  setBusinessQty,
  getValidity,
  adsBusinessQty,
  setAdsBusinessQty
}) {
  const cardRefs = useRef([]);
  const [visibleCards, setVisibleCards] = useState(() => new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [currentUser, setCurrentUser] = useState({ info: {}, data: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrder = (pkg, isTest = false) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const rawUserData = sessionStorage.getItem("userData");
      setCurrentUser({
        info: {
          username: sessionStorage.getItem("username"),
          phoneNo: sessionStorage.getItem("phoneNo"),
        },
        data: rawUserData ? JSON.parse(rawUserData) : {}
      });
      setSelectedPkg(pkg);
      setModalOpen(true);
    } else {
      const type = (pkg.packageTypeFlag === 0 || isTest) ? 'A2P' : 'ADS';
      const id = pkg.packageID;
      window.location.href = `/register?packageType=${type}&packageId=${id}`;
    }
  };

  const confirmRenewal = async (requestedSenderID) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const isA2P = selectedPkg.packageTypeFlag === 0;
    const totalPrice = (selectedPkg.packageQty * selectedPkg.packagePrice);

    const body = {
      ClientName: currentUser.info.username,
      PhoneNo: currentUser.info.phoneNo,
      [isA2P ? "A2PPackageName" : "ADSPackageName"]: selectedPkg.packageArname,
      [isA2P ? "A2PMessageCount" : "ADSMessageCount"]: Number(selectedPkg.packageQty),
      [isA2P ? "A2PPackagePrice" : "ADSPackagePrice"]: Number(totalPrice),
      [isA2P ? "A2PSenderId" : "ADSSenderId"]: requestedSenderID || currentUser.data?.senderID,
      RequestType: "renew",
      ClientId: Number(sessionStorage.getItem("clientId")),

    };

    try {
      const response = await fetch(`${apiUrl}api/User/SendClientRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("تم إرسال طلب التجديد بنجاح، سيتم التواصل معكم قريباً");
        setModalOpen(false);
      } else {
        alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("تعذر الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const item = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const imageSlideUp = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  const otpPackages = packages.filter((p) => p.packageTypeFlag === 0);
  const adsPackages = packages.filter((p) => p.packageTypeFlag === 1);

  useEffect(() => {
    const totalCards = otpPackages.length + adsPackages.length + 2;
    cardRefs.current = cardRefs.current.slice(0, totalCards);

    if (typeof IntersectionObserver === "undefined") {
      setVisibleCards(new Set(Array.from({ length: totalCards }, (_, i) => i)));
      return;
    }

    setVisibleCards(new Set());

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.cardIndex);
            setVisibleCards((prev) => {
              if (prev.has(index)) return prev;
              const updated = new Set(prev);
              updated.add(index);
              return updated;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [otpPackages.length, adsPackages.length]);

  const getWrapperClasses = (index) =>
    `pricing-card h-full ${visibleCards.has(index) ? "card-visible" : ""}`;

  return (
    <>
      <RenewPopup 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        pkg={selectedPkg}
        clientInfo={currentUser.info}
        userData={currentUser.data}
        onConfirm={confirmRenewal}
      />

      <section id="otp-prices-section" className="prices-section relative py-20 bg-grid-pattern bg-no-repeat bg-cover bg-center">
        <div className="relative mx-auto max-w-6xl space-y-8 px-4 text-right ">
          <div className="relative mb-20 ">
            <div className="relative z-10">
              <Motion.div
                variants={item}
                className="rounded-[40px] bg-[#3E4E6B] py-10 px-6 md:px-12 flex flex-col md:items-end md:justify-center"
              >
                <div className="text-right space-y-4 max-w-xl ml-auto">
                  <h1 className="flex justify-start gap-3 text-3xl md:text-4xl font-bold text-white">
                    <FaBox className="text-3xl md:text-4xl" />
                    <span>باقات رسائل التنبيه OTP</span>
                  </h1>
                  <p className="text-brand-accent text-lg">
                    هوية الارسال الاعتيادية هي 13201 ويمكن طلب هوية ليبيانا ومدار خاصة عند الحاجة ويكون سعرها 500 د.ل لمدة سنة. 
                  </p>
                </div>
                <div className="mt-8 flex justify-center md:hidden">
                  <Motion.div
                    variants={imageSlideUp}
                    className="w-56 h-56 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <img src="/images/programming-hero.png" alt="منصة رسائل" className="w-3/4 h-3/4 object-contain" />
                  </Motion.div>
                </div>
              </Motion.div>

              <Motion.div
                variants={imageSlideUp}
                className="hidden md:flex items-center justify-center absolute -bottom-12 left-8"
              >
                <div className="w-[280px] h-[280px] rounded-full bg-[#F3D27A] flex items-center justify-center shadow-lg">
                  <img src="/images/PackagesLogo.png" alt="منصة رسائل" className="w-3/4 h-3/4 object-contain" />
                </div>
              </Motion.div>
            </div>
          </div>

          {loadingPackages ? (
            <p className="text-center text-gray-600">جاري تحميل الباقات...</p>
          ) : errorPackages ? (
            <p className="text-center text-red-600">{errorPackages}</p>
          ) : (
            <>
              <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div
                  ref={(el) => (cardRefs.current[0] = el)}
                  data-card-index={0}
                  className={getWrapperClasses(0)}
                >
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl p-6 text-right shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-elevated featured-package-card text-brand-dark">
                    <div className="card-title-chip rounded-2xl px-4 py-2 text-lg font-bold flex items-center justify-start featured-card-header text-brand-dark">
                      <span>{testPackage?.packageArname}</span>
                    </div>
                    <div className="mt-4 flex-1 space-y-3 text-brand-dark/80">
                      <p className="text-lg font-bold text-brand-primary">
                        {testPackage?.packageQty} رسالة<br />مجانية
                      </p>
                      <p>مدة الصلاحية: أسبوعين.</p>
                      <p>اطلع على تفاصيل الباقة داخل لوحة التحكم أو اطلب مساعدة فريق المبيعات.</p>
                    </div>
                    <button onClick={() => handleOrder(testPackage, true)} className="pricing-cta mt-6 pricing-cta--featured">اطلب الآن</button>
                  </div>
                </div>

                {otpPackages.map((pkg, idx) => {
                  const cardIndex = idx + 1;
                  const isBusinessPackage = pkg.packagePrice === 0 && pkg.packageQty === 0;
                  const totalPrice = !isBusinessPackage ? (pkg.packageQty * pkg.packagePrice).toFixed(2) : 0;
                  const validity = getValidity(cardIndex, pkg);

                  return (
                    <div
                      key={pkg.packageID}
                      ref={(el) => (cardRefs.current[cardIndex] = el)}
                      data-card-index={cardIndex}
                      className={getWrapperClasses(cardIndex)}
                    >
                      <div className="flex h-full flex-col rounded-3xl standard-package-card p-6 text-right text-brand-dark shadow-card hover:-translate-y-1 hover:shadow-elevated">
                        <div className="card-title-chip rounded-2xl standard-card-header px-4 py-4 text-lg font-bold">
                          {pkg.packageArname}
                        </div>
                        <div className="mt-4 flex-1 space-y-3 text-brand-dark/80">
                          {isBusinessPackage ? (
                            <>
                              <label className="text-sm font-semibold">باقات مخصصة (أكثر من 100,000 رسالة)</label>
                              <input
                                type="number"
                                min={100001}
                                value={businessQty}
                                onChange={(e) => setBusinessQty(e.target.value)}
                                className="h-12 w-full rounded-2xl border px-4 text-right"
                              />
                              <p className="text-base font-semibold">سيتواصل معك فريق المبيعات قريباً.</p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-brand-primary">
                              {pkg.packageQty.toLocaleString()} رسالة<br />{totalPrice} د.ل
                            </p>
                          )}
                          <p>مدة الصلاحية: {validity}</p>
                          <p className="text-brand-dark/70">كل الباقات تشمل تقارير فورية ودعم فني مخصص.</p>
                        </div>
                        <button onClick={() => handleOrder(pkg)} className="pricing-cta pricing-cta--standard mt-6">اطلب الآن</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <section id="ads-prices-section" className="prices-section relative py-10">
        <div className="relative mx-auto max-w-6xl space-y-8 px-4 text-right">
          <div className="relative mb-20">
            <div className="relative z-10">
              <Motion.div
                variants={item}
                className="rounded-[40px] bg-[#3E4E6B] py-10 px-6 md:px-12 flex flex-col md:items-end md:justify-center"
              >
                <div className="text-right space-y-4 max-w-xl ml-auto">
                  <h1 className="flex justify-start gap-3 text-3xl md:text-4xl font-bold text-white">
                    <FaBox className="text-3xl md:text-4xl" />
                    <span>باقات رسائل الدعائية ADS</span>
                  </h1>
                  <p className="text-brand-accent text-lg">تتضمن الباقات رسائل لكل من ليبيانا والمدار كما يمكن إضافة قائمة ارقام خاصة بكم.</p>
                </div>
              </Motion.div>
              <Motion.div variants={imageSlideUp} className="hidden md:flex items-center justify-center absolute -bottom-12 left-8">
                <div className="w-[280px] h-[280px] rounded-full bg-[#F3D27A] flex items-center justify-center shadow-lg">
                  <img src="/images/AdsLogo.png" alt="منصة رسائل" className="w-3/4 h-3/4 object-contain" />
                </div>
              </Motion.div>
            </div>
          </div>

          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
            {adsPackages.map((pkg, idx) => {
              const cardIndex = otpPackages.length + 1 + idx;
              const isBusinessPackage = pkg.packagePrice === 0 && pkg.packageQty === 0;
              const totalPrice = !isBusinessPackage ? (pkg.packageQty * pkg.packagePrice).toFixed(2) : 0;
              const validity = getValidity(cardIndex, pkg);

              return (
                <div
                  key={pkg.packageID}
                  ref={(el) => (cardRefs.current[cardIndex] = el)}
                  data-card-index={cardIndex}
                  className={getWrapperClasses(cardIndex)}
                >
                  <div className="flex h-full flex-col rounded-3xl standard-package-card p-6 text-right text-brand-dark shadow-card hover:-translate-y-1 hover:shadow-elevated">
                    <div className="card-title-chip rounded-2xl standard-card-header px-4 py-4 text-lg font-bold">
                      {pkg.packageArname}
                    </div>
                    <div className="mt-4 flex-1 space-y-3 text-brand-dark/80">
                      {isBusinessPackage ? (
                        <>
                          <label className="text-sm font-semibold">باقات مخصصة (أكثر من 1,100,000 رسالة)</label>
                          <input
                            type="number"
                            min={1100000}
                            value={adsBusinessQty}
                            onChange={(e) => setAdsBusinessQty(e.target.value)}
                            className="h-12 w-full rounded-2xl border px-4 text-right"
                          />
                          <p className="text-base font-semibold">سيتواصل معك فريق المبيعات قريباً.</p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-brand-primary">
                          {pkg.packageQty.toLocaleString()} رسالة<br />{totalPrice} د.ل
                        </p>
                      )}
                      <p>مدة الصلاحية: {validity}</p>
                      <p>باقات الإرسال الدعائي عبر الشبكات.</p>
                    </div>
                    <button onClick={() => handleOrder(pkg)} className="pricing-cta pricing-cta--standard mt-6">اطلب الآن</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default PricesSection;