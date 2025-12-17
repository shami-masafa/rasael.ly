import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../config";
import HeroSection from "./Sections/HeroSection";
import AboutSection from "./Sections/AboutSection";
import PricesSection from "./Sections/PricesSection";
import ContactSection from "./Sections/ContactSection";

/* --------- Home Page --------- */
function Home() {
  const location = useLocation();

  const [currentText, setCurrentText] = useState(0);
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [errorPackages, setErrorPackages] = useState("");
  const [businessQty, setBusinessQty] = useState("");

  const heroTexts = [
    {
      title: "بوابة رسائل ذكية تلبي كل احتياجاتك",
      desc: "منصة رسايل تقدم خدمة رسائل OTP والتنبيهات التسويقية عبر واجهات برمجية سهلة الربط ومؤمنة بالكامل.",
    },
    {
      title: "إرسال سريع ومستقر داخل الشبكات الليبية",
      desc: "نتعامل مع أشهر مزودي الاتصالات لضمان وصول الرسائل في ثوانٍ مع تقارير دقيقة لحالة كل رسالة.",
    },
    {
      title: "خيارات أسعار مرنة تنمو مع مشروعك",
      desc: "اختر من بين باقات جاهزة أو اطلب عرضاً خاصاً للأعداد الكبيرة مع فريق مبيعات متخصص.",
    },
  ];

  // Rotate hero texts automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  // Scroll to a section when state.scrollTo is provided
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const id = location.state.scrollTo;
        const section = document.getElementById(id);
        if (!section) return;
        const navHeight = document.querySelector(".navbar")?.offsetHeight || 0;
        const offset = 10;
        const top =
          section.getBoundingClientRect().top +
          window.pageYOffset -
          navHeight -
          offset;
        window.scrollTo({ top, behavior: "smooth" });
      }, 70);
    }
  }, [location]);

  // Fetch pricing packages from the API
  useEffect(() => {
    const fetchPackages = async () => {
      setLoadingPackages(true);
      setErrorPackages("");
      try {
        const res = await fetch(`${apiUrl}api/RasaelCP/GetPackages`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setPackages(data);
      } catch {
        setErrorPackages(
          "حدث خطأ أثناء جلب الباقات، يرجى المحاولة لاحقاً."
        );
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  // Default showcased package for demo purposes
  const testPackage = {
    packageID: "test",
    packageArname: "الباقة التجريبية",
    packageQty: "50",
    packagePrice: 0,
    validity: "صلاحية مفتوحة",
    customerService: true,
  };

  // Helper to determine a validity label based on the package order/name
  const getValidity = (index, pkg) => {
    if (index === 0) return "صلاحية مفتوحة";
    const digitsOnly = (pkg.packageArname || "").replace(/[^\d]/g, "");
    if (digitsOnly.includes("6")) return "6 أشهر";
    if (digitsOnly.includes("12")) return "12 شهراً";
    return "سنة او حتى النفاد.";
  };

  return (
    <div className="pb-0">
      <HeroSection heroTexts={heroTexts} currentText={currentText} />
      <AboutSection />
      <PricesSection
        packages={packages}
        loadingPackages={loadingPackages}
        errorPackages={errorPackages}
        testPackage={testPackage}
        businessQty={businessQty}
        setBusinessQty={setBusinessQty}
        getValidity={getValidity}
      />
      <ContactSection />
    </div>
  );
}

export default Home;
