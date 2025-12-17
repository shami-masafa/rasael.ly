import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaHeadset,
} from "react-icons/fa";
import bgPattern from "/images/bg_abstract.jpeg";

function ContactSection() {
  const contactItems = [
    {
      title: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
      value: "\u0637\u0631\u0627\u0628\u0644\u0633\u060c \u0644\u064a\u0628\u064a\u0627 - \u0627\u0644\u0633\u064a\u0627\u062d\u064a\u0629",
      icon: <FaMapMarkerAlt />,
    },
    {
      title: "\u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a",
      value: "218-92-401-1188",
      icon: <FaPhoneAlt />,
      href: "tel:+218924011188",
    },
    {
      title: "رقم هاتف",
      value: "218-91-401-1188",
      icon: <FaHeadset />,
      href: "tel:+218914011188",
    },
    {
      title: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      value: "info@masafa.ly",
      icon: <FaEnvelope />,
      href: "mailto:info@masafa.ly",
    },
  ];

  return (
    <section
      id="contact-section"
      className="relative py-16"
      style={{
        backgroundImage: `url(${bgPattern})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 " aria-hidden />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 lg:flex-row">
        <div className="w-full rounded-3xl bg-white/95 p-8 shadow-card backdrop-blur lg:w-5/12">
          <h2 className="mb-6 text-right text-2xl font-extrabold text-brand-primary">
           تواصل معنا مباشرة
          </h2>

          <div className="space-y-6">
            {contactItems.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col text-right">
                  <span className="text-lg font-bold text-brand-primary">
                    {item.title}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-semibold text-gray-700 hover:text-brand-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">
                      {item.value}
                    </span>
                  )}
                </div>
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[#f7e5b7] text-xl text-[#d9a000]">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-3xl bg-white p-8 shadow-card lg:w-7/12">
          <h2 className="mb-4 text-right text-2xl font-extrabold text-brand-primary">
          أرسل لنا رسالة

          </h2>
          <div className="mb-6 h-0.5 w-full rounded-full bg-[#f4b740]" />

          <form
            className="space-y-5"
            onSubmit={(e) => e.preventDefault()}
            aria-label="\u0646\u0645\u0648\u0630\u062c \u0627\u0644\u062a\u0648\u0627\u0635\u0644"
          >
            <div>
              <input
                type="text"
                required
                placeholder="رقم هاتف"
                className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-right text-base text-gray-700 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
              />
            </div>
            <div>
              <input
                type="email"
                required
                placeholder="بريد الكتروني"
                className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-right text-base text-gray-700 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
              />
            </div>
            <div>
              <textarea
                rows="6"
                required
                placeholder="رسالة"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-right text-base text-gray-700 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-primary px-4 py-3 text-lg font-semibold text-white transition hover:bg-brand-dark"
            >
             ارسال
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
