import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* --------- SMS bubble icon --------- */
function SMSIcon({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* bubble outline */}
      <path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6l-4 3v-3H7a3 3 0 0 1-3-3Z" />
      {/* text lines */}
      <path d="M9 8.5h6" />
      <path d="M9 11h4" />
    </svg>
  );
}

/* --------- Generate floating SMS icons --------- */
const generateIcons = (count) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 95, // random horizontal position (0% - 95%)
    bottom: Math.random() * 220, // start below the viewport
    duration: 10 + Math.random() * 15, // duration between 10s and 25s
    rotate: Math.random() * 20 - 10, // small rotation variation
    scale: 0.8 + Math.random() * 0.8, // varied size to add depth
  }));

/* --------- Hero Section --------- */
function HeroSection({ heroTexts, currentText }) {
  const smsIcons = generateIcons(100);
  const scrollToContact = () => {
    const section = document.getElementById("contact-section");
    if (!section) return;
    const navHeight = document.querySelector(".navbar")?.offsetHeight || 0;
    const offset = 10;
    const top =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      navHeight -
      offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section id="home-section" className="relative min-h-[50vh] overflow-hidden">
      {/* gradient background and glow accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B4E64] via-[#3B4E6F] to-[#4A5D82] -z-20">
        <div className="absolute -top-20 right-10 h-40 w-40 rounded-full bg-[#F4B740]/20 blur-3xl" />
        <div className="absolute bottom-0 left-20 h-48 w-48 rounded-full bg-[#F4B740]/10 blur-3xl" />
      </div>

      {/* floating SMS icons */}
      <div className="absolute inset-0 sms-layer">
        {smsIcons.map((icon) => (
          <div
            key={icon.id}
            className="sms-item"
            style={{
              left: `${icon.left}%`,
              bottom: `${icon.bottom}px`,
              animationDelay: `${icon.delay}s`,
              animationDuration: `${icon.duration}s`,
              transform: `scale(${icon.scale}) rotate(${icon.rotate}deg)`,
            }}
          >
            <SMSIcon />
          </div>
        ))}
      </div>

      {/* main hero content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center md:py-20">
        {/* hero card */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 flex justify-center md:justify-start"
        >
          <div className="hero-message-card w-full max-w-sm rounded-3xl p-6 md:p-8 text-right text-gray-800">
            <div className="flex justify-end mb-4">
              <img
                src="/images/rasael-logo.png"
                className="h-14 w-auto"
                alt="Rasael Logo"
              />
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-2">
              حلول رسائل موثوقة لقطاعات الأعمال في ليبيا من ليبيانا ومدار
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              نوفر بوابة رسائل احترافية لإرسال OTP والتنبيهات التسويقية مع ضمان أعلى معايير
              الاعتمادية والأمان وخيارات تكامل مرنة تناسب الأنظمة المختلفة.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs shadow">
              <span className="text-[#F4B740] font-semibold">عبر المسافة لتطوير حلول التقنية</span>
              <span>خبرة تتجاوز 10 سنوات</span>
            </div>
          </div>
        </motion.div>

        {/* hero text */}
        <div className="w-full md:w-1/2 text-right flex flex-col justify-center space-y-4">
          <motion.h1
            key={heroTexts[currentText]?.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold leading-tight text-white"
          >
            {heroTexts[currentText]?.title}
          </motion.h1>

          <motion.p
            key={heroTexts[currentText]?.desc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-gray-200 max-w-md leading-relaxed"
          >
            {heroTexts[currentText]?.desc}
          </motion.p>
          <div className="flex flex-wrap justify-end gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              تسجيل الدخول
            </Link>
            <button
              type="button"
              onClick={() => window.location.href = "/register"}
              className="inline-flex items-center justify-center rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-gray-900 shadow transition hover:bg-[#ffd272]"
            >
              اشترك بالمنصة
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
