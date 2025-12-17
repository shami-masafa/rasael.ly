import { motion as Motion } from "framer-motion";
import {
  FaSms,
  FaBullhorn,
  FaInfoCircle,
  FaCode,
  FaDesktop, // Added for the new section
} from "react-icons/fa";

/* --------- Animations --------- */
const container = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.15, ease: "easeOut" },
  },
};

const item = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/* ---- Image Slide-up Animation ---- */
const imageSlideUp = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function AboutSection() {
  return (
    <Motion.section
      id="about-section"
      className="bg-brand-muted/60 py-12"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl px-4 space-y-24">

        {/* 0) HERO مثل masafa.ly/programing */}
        <div className="relative mb-18">
          {/* الكرت الأزرق */}
          <Motion.div
            variants={item}
            className="relative rounded-[40px] bg-[#3E4E6B] py-10 px-6 md:px-12 flex flex-col md:items-end md:justify-center"
          >
            {/* العنوان + وصف قصير */}
            <div className="text-right space-y-4 max-w-xl ml-auto">
              <h1 className="flex justify-start gap-3 text-3xl md:text-4xl font-bold text-white">
                <FaInfoCircle className="text-3xl md:text-4xl" />
                <span>منصة رسائل</span>
              </h1>
              <p className="text-brand-accent text-lg">
                نساعد البنوك وشركات التوصيل والمتاجر الإلكترونية على إرسال التنبيهات
                الحساسة وإدارة الحملات التسويقية مع تقارير فورية ودعم فني متواصل.
              </p>
            </div>
            {/* Mobile Image */}
            <div className="mt-8 flex justify-center md:hidden">
              <Motion.div
                variants={imageSlideUp}
                className="w-56 h-56 rounded-full flex items-center justify-center shadow-lg"
              >
                <img
                  src="/images/programming-hero.png" // غيّرها لأيقونة/صورة تناسبك
                  alt="منصة رسائل"
                  className="w-3/4 h-3/4 object-contain"
                />
              </Motion.div>
            </div>
          </Motion.div>

          {/* صورة الدائرة طالعة من تحت الكرت - مثل مسافة */}
          <Motion.div
            variants={imageSlideUp}
            className="hidden md:flex items-center justify-center absolute -bottom-12 left-8"
          >
            <div className="w-[280px] h-[280px] rounded-full bg-[#F3D27A] flex items-center justify-center shadow-lg">
              <img
                src="/images/A2PLogo.png" // نفس الصورة أو غيرها
                alt="منصة رسائل"
                className="w-3/4 h-3/4 object-contain"
              />
            </div>
          </Motion.div>
        </div>


        {/* 2) نصوص الخدمات (1 و 2) و (3) في نفس الصف أو أكثر */}
        <div className="grid gap-12 lg:gap-20 lg:grid-cols-3 text-right">
          
          {/* العمود الأيمن: (1) رسائل تنبيهية ومعاملات */}
          <div className="space-y-4">
            <Motion.h3
              variants={item}
              className="text-2xl font-semibold text-[#4A5D82] flex justify-start items-center gap-3"
            >
              <FaSms className="text-3xl text-brand-accent" />
              <span>رسائل تنبيهية (A2P)</span>
            </Motion.h3>

            <Motion.p variants={item} className="text-gray-700 leading-relaxed">
              مثالية لرموز التحقق والإشعارات الحساسة عبر مسارات مخصصة عالية
              الاعتمادية:
            </Motion.p>

            <Motion.ul
              variants={item}
              className="list-disc pr-6 space-y-1 text-gray-600"
            >
              <li>رموز التحقق OTP</li>
              <li>تنبيهات المصارف</li>
              <li>إشعارات الأنظمة الداخلية</li>
              <li>تتبع الشحنات</li>
              <li> الارسال التلقائي</li>

            </Motion.ul>
          </div>

          {/* العمود الأوسط: (2) حملات تسويقية وإعلانية موجهة */}
          <div className="space-y-4">
            <Motion.h3
              variants={item}
              className="text-2xl font-semibold text-[#4A5D82] flex justify-start items-center gap-3"
            >
              <FaBullhorn className="text-3xl text-brand-accent" />
              <span>حملات إعلانية (ADS)</span>
            </Motion.h3>

            <Motion.p variants={item} className="text-gray-700 leading-relaxed">
              اقترب من جمهورك عبر حملات مجزأة مع تقارير
              دقيقة ولوحة تحكم بسيطة:
            </Motion.p>

            <Motion.ul
              variants={item}
              className="list-disc pr-6 space-y-1 text-gray-600"
            >
              <li>إطلاق العروض</li>
              <li>التذكير بالاشتراكات</li>
              <li>التفاعل مع العملاء</li>
              <li>إشعارات المتاجر الإلكترونية</li>
              <li>تسويق عبر قواعد بيانات</li>
            </Motion.ul>
          </div>
          
          {/* العمود الأيسر (الجديد): (3) تكامل للمطورين (API) */}
          <div className="space-y-4">
            <Motion.h3
              variants={item}
              className="text-2xl font-semibold text-[#4A5D82] flex justify-start items-center gap-3"
            >
              <FaCode className="text-3xl text-brand-accent" />
              <span>تكامل للمطورين (API)</span>
            </Motion.h3>

            <Motion.p variants={item} className="text-gray-700 leading-relaxed">
              تكامل سلس وآمن مع أنظمتك الخاصة لضمان أقصى درجات المرونة والتحكم:
            </Motion.p>

            <Motion.ul
              variants={item}
              className="list-disc pr-6 space-y-1 text-gray-600"
            >
              <li>API موثق وواضح</li>
              <li>مفاتيح آمنة وسهلة الإدارة</li>
              <li>دعم فني مخصص للمطورين</li>
              <li>تكامل سريع مع أي نظام</li>
              <li>مرونة في لغات البرمجة</li>
            </Motion.ul>
          </div>
        </div>


        {/* 4) SERVICES GRID SECTION - REMOVED */}
        {/* The services grid section has been removed as requested. */}
        
      </div>
    </Motion.section>
  );
}