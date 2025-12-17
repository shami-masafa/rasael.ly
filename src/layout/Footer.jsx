import {
  FaFacebookF,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function RasaelFooter() {
  // Get the current year dynamically
  const currentYear = new Date().getFullYear();
    const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    const section = document.getElementById(id);
    if (!section) return;
    const navEl = document.querySelector(".navbar");
    const navHeight = navEl ? navEl.offsetHeight : 0;
    const offset = 10;
    const top =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      navHeight -
      offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <footer dir="rtl" className="relative mt-32">
      {/* ===== Curved Top ===== */}
      <div className="relative">
        {/* Image placed ABOVE the curve */}
        <div className="absolute w-full top-[-70px] flex justify-center z-20">
          <img
            src="/images/RasaelClients.png"
            alt="Rasael Clients"
            className="w-full max-w-4xl rounded-xl border border-gray-200 bg-white/80 p-4 shadow-lg"
          />
        </div>

        {/* Curved SVG */}
        <svg
          viewBox="0 0 1440 180"
          className="block w-full h-[160px]"
          preserveAspectRatio="none"
        >
          <path
            d="
              M0,120
              C360,10 1080,10 1440,120
              L1440,180
              L0,180
              Z
            "
            fill="#3E4E6B"
          />
        </svg>
      </div>

      {/* ===== Footer Body ===== */}
      <div className="bg-[#3E4E6B] text-white pt-28 pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Main Grid: **Change `text-right` to `text-center`** */}
          <div className="grid gap-10 md:grid-cols-4 text-center">

            {/* 1) Platform description */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold">منصة رسائل</h3>
              {/* Force text back to RTL start/right align for readability of long paragraphs */}
              <p className="text-sm leading-relaxed text-right md:text-center">
                منصة اتصالات رقمية ليبية متخصصة في حلول الرسائل القصيرة 
                وواجهات البرمجة التي تمكّن المؤسسات من بناء تجربة تواصل 
                موثوقة مع عملائها عبر قنوات اتصال عالية الاعتمادية.
              </p>

              {/* **FIX: Social icons alignment.** Change `justify-end` to `justify-center` */}
              <div className="flex justify-center gap-3 mt-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#4A5D82] flex items-center justify-center hover:scale-110 transition"
                >
                  <FaLinkedinIn size={15} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#4A5D82] flex items-center justify-center hover:scale-110 transition"
                >
                  <FaFacebookF size={15} />
                </a>
              </div>
            </div>

            {/* 2) Sections - **Alignment is correct (text-center inherited)** */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">أقسام الموقع</h3>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-[#FBE68B] transition cursor-pointer"><a onClick={() => scrollToSection("about-section")}>الرئيسية</a></li>
                <li className="hover:text-[#FBE68B] transition cursor-pointer"><a onClick={() => scrollToSection("otp-prices-section")}>باقات التنبيه</a></li>
                <li className="hover:text-[#FBE68B] transition cursor-pointer"><a onClick={() => scrollToSection("ads-prices-section")}>باقات الدعائية</a></li>
                <li className="hover:text-[#FBE68B] transition cursor-pointer"><a onClick={() => scrollToSection("contact-section")}>تواصل معنا</a></li>
              </ul>
            </div>

            {/* 3) Services - **Alignment is correct (text-center inherited)** */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">خدمات الشركة</h3>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-[#FBE68B] transition cursor-pointer">رسائل المعاملات A2P</li>
                <li className="hover:text-[#FBE68B] transition cursor-pointer">الحملات التسويقية</li>
                <li className="hover:text-[#FBE68B] transition cursor-pointer">تكامل API</li>
                <li className="hover:text-[#FBE68B] transition cursor-pointer">إدارة المستخدمين والتقارير</li>
              </ul>
            </div>

            {/* 4) Contact - **FIX: List item alignment.** Change `justify-end` to `justify-center` */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">تواصل معنا مباشرة</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center justify-center gap-3">
                  <span>طرابلس، ليبيا – السياحية</span>
                  <FaMapMarkerAlt className="text-[#FBE68B]" />
                </li>
                <li className="flex items-center justify-center gap-3">
                  <span>218-92-401-1188</span>
                  <FaPhoneAlt className="text-[#FBE68B]" />
                </li>
                <li className="flex items-center justify-center gap-3">
                  <span>218-91-401-1188</span>
                  <FaPhoneAlt className="text-[#FBE68B]" />
                </li>
                <li className="flex items-center justify-center gap-3">
                  <span>info@masafa.ly</span>
                  <FaEnvelope className="text-[#FBE68B]" />
                </li>
              </ul>
            </div>

          </div>

          {/* Divider */}
<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <span className="font-extrabold text-white flex items-center gap-2">
             Powered by Masafa IT Development
             <span className="text-base text-white">
               &copy; {new Date().getFullYear()}
             </span>
           </span>
           <img
             src="/images/masafa_logo.png"
             alt="Masafa IT Development logo"
             className="h-6 w-auto transition hover:opacity-90"
           />
         </div>
        </div>
      </div>
    </footer>
  );
}