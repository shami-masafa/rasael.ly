import { useState, useEffect } from "react";
import { apiUrl } from "../../../config";
import Popup from "../../../Popup";
import * as XLSX from "xlsx";

export default function Send() {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [file, setFile] = useState(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [previewNumbers, setPreviewNumbers] = useState([]);
  const [totalNumbers, setTotalNumbers] = useState(0);
  const maxLength = 600;

    const [token, setToken] = useState("");

useEffect(() => {
  const storedToken = sessionStorage.getItem("rasaelToken");
  if (storedToken) {
    setToken(storedToken);
  }
}, []);

  // Define primary and secondary colors for Tailwind (based on your CSS)
  const primaryColor = '455785'; // Custom blue/indigo

  const showPopup = (title, message) => setPopup({ show: true, title, message });

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(null);
    setPreviewNumbers([]);
    setTotalNumbers(0);

    if (!selectedFile) return;

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Extract phone numbers
      const numbers = json
        .map((row) => row[0]?.toString().trim())
        .filter(Boolean);

      // Check for invalid/missing numbers
      if (numbers.length !== json.length) {
        showPopup("خطأ", "ملف Excel يحتوي على صفوف فارغة أو غير صالحة. يرجى تصحيح الملف.");
        return;
      }

      setPreviewNumbers(numbers.slice(0, 5)); // show only first 5
      setTotalNumbers(numbers.length);
      setFile(selectedFile);
    } catch (err) {
      showPopup("خطأ", "فشل قراءة الملف. تأكد من أنه Excel صالح.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!policyAccepted) return showPopup("تنبيه", "يرجى قبول سياسة المنصة قبل الإرسال");
    if (!bulkMode && !phone.trim()) return showPopup("تنبيه", "يرجى إدخال رقم الهاتف");
    if (!message.trim()) return showPopup("تنبيه", "يرجى كتابة الرسالة");
    if (bulkMode && !file) return showPopup("تنبيه", "يرجى رفع ملف Excel يحتوي على أرقام الهواتف");

    try {
      setIsSending(true);

      if (bulkMode) {
        const messages = previewNumbers.map((phoneNumber) => ({
          phoneNumber,
          message,
          senderID: ""
        }));

        const res = await fetch(`${apiUrl}api/RasaelCP/SendBulkMessages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          },
          body: JSON.stringify({
            token: sessionStorage.getItem("rasaelToken"),
            messages
          })
        });

        if (!res.ok) throw new Error(await res.text() || "فشل ارسال الرسائل من الملف");

        const dataRes = await res.json();
        showPopup("نجاح", `تم إرسال الرسائل (${totalNumbers} رقم) بنجاح!`);
      } else {
        const res = await fetch(`${apiUrl}api/RasaelCP/SendSMSToPhoneNumber`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          },
          body: JSON.stringify({
            token: sessionStorage.getItem("rasaelToken"),
            phoneNumber: phone,
            message: message,
          }),
        });

        if (!res.ok) throw new Error(await res.text() || "فشل ارسال الرسالة");
        showPopup("نجاح", "تم إرسال الرسالة بنجاح!");
      }

      setMessage("");
      setPhone("");
      setFile(null);
      setPreviewNumbers([]);
      setTotalNumbers(0);
      setBulkMode(false);
    } catch (err) {
      showPopup("خطأ", err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-2 max-w-4xl mx-auto rtl font-['Tajawal',_sans-serif]">
      <h4 className="text-2xl font-bold mb-6 text-brand-primary">ارسال رسائل تنبيه</h4>

      <div className="flex flex-wrap gap-5">
        <form className="flex-1 min-w-[350px]" onSubmit={handleSubmit}>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-base font-normal">
                {bulkMode ? "قائمة أرقام هواتف من ملف: xls, xlsx" : "رقم الهاتف:"}
              </label>
              <label className="flex items-center text-sm font-medium select-none">
                <input
                  type="checkbox"
                  checked={bulkMode}
                  onChange={(e) => {
                    setBulkMode(e.target.checked);
                    // Clear phone/file when switching modes
                    setPhone("");
                    setFile(null);
                    setPreviewNumbers([]);
                    setTotalNumbers(0);
                  }}
                  className="ml-1 cursor-pointer"
                />
                إرسال إلى أرقام متعددة
              </label>
            </div>

            {!bulkMode && (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 218912345678"
                className="w-full p-2.5 rounded-lg border border-gray-300 text-base mt-1 rtl"
              />
            )}

            {bulkMode && (
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 text-base mt-1 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              />
            )}

            {previewNumbers.length > 0 && (
              <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                <h5 className="font-semibold text-sm mb-1">أول 5 أرقام مستخرجة:</h5>
                <ul className="list-disc pr-5 text-sm space-y-0.5">
                  {previewNumbers.map((num, i) => (
                    <li key={i}>{num}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm font-medium">إجمالي الأرقام: {totalNumbers}</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="text-base font-normal">نص الرسالة:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
              rows={6}
              className="w-full p-3 rounded-lg border border-gray-300 text-base resize-none mt-1"
              placeholder="اكتب رسالتك هنا..."
            />
            <div className="text-left text-sm text-gray-600 mt-1">
              {message.length} / {maxLength}
            </div>
          </div>

          <button
            type="submit"
            className={`mt-5 w-full py-3 text-white rounded-lg text-base cursor-pointer transition-colors
              bg-[#${primaryColor}] hover:bg-brand-accent hover:text-black
              disabled:bg-gray-400 disabled:cursor-not-allowed`}
            disabled={isSending}
          >
            {isSending ? (
              <div
                className="spinner w-[22px] h-[22px] border-3 border-white border-t-3 border-t-[#fcc749] rounded-full mx-auto animate-spin"
                role="status"
              >
               
              </div>
            ) : (
              "إرسال"
            )}
          </button>
        </form>

        {/* Policy container */}
        <div className="flex-1 min-w-[300px] border border-gray-300 mt-4 rounded-lg max-h-[385px] overflow-y-auto bg-gray-50 shadow-md flex flex-col justify-between">
          <h5 className="sticky top-0 py-1.5 px-3 bg-[#455785] text-white font-semibold text-base rounded-t-lg">
            الشروط والأحكام:
          </h5>
          <div className="text-sm mb-2 px-6 flex-grow">
            <ol className="list-decimal list-inside space-y-2">
              <li>اشتراكك في منصة شركة المسافة لإرسال الرسائل القصيرة هو إنك توافق على الشروط والاحكام الواردة في هذه الوثيقة وأنك تقر بمراجعتها بصفة دورية وعلى دراية تامة بكافة تعديلاتها وما يستجد بها وأنك قد قبلت كل ما تحتويه. </li>
              <li>موافقتك تعني استخدامها فقط لأغراض مشروعة، وإنك سوف تمتنع عن إرسال أو بث أي مادة من خلال هذه المنصة يكون من شأنها أن تخل أو تتعدى على حقوق الآخرين أو تحد من أو تمنع استخدام لهذه المنصة، أو تنطوي على أمر غير مشروع، أو على تهديد أو إساءة أو قذف، أو تعدي على خصوصية الآخرين، أو حقوق النشر الخاصة بالغير، أو على ألفاظ فاحشة، أو تسيء إلى الإسلام أو المقدسات أو تنتهك حرمتها، أو تكون لأي سبب آخر غير مقبولة، أو يكون من شأنها أن تشجع على ارتكاب جريمة أو تنطوي على مخالفة يترتب عليها مسؤولية مدنية أو تكون فيها مخالفة لأي قانون . </li>
              <li> لا تتحمل المنصة أو أحد موظفينا أي مسؤولية قضائية، أو قانونية، أو جزائية، أو أدبية أو معنوية أو تقديم أي تعويضات مالية تجاه المستخدمين الذين يستخدمون خدماتنا بشكل سيء و يحق لنا مطالبة المستخدمين بالتعويض المناسب لقاء الضرر المادي أو المعنوي الذي يصيب شركتنا من قبل أي طرف ثالث. </li>
              <li> عند استخدام خدمات الإرسال المباشر، فأنت مسؤول عن الالتزام بجميع المتطلبات القانونية المتعلقة بحقوق الارسال المباشر وحقوق المحتوى، توفر منصة رسائل فقط النظام الأساسي لإرسال الرسائل، ولكنك وحدك المسؤول عن محتوى رسائلك المرسلة باستخدام الخدمات المتاحة بالنظام. </li>
              <li> لا يسمح بأرسال الرسائل التي تحتوي على أي نوع من أنواع الفوز بالمسابقات او التي تحتوي على مشاركة استثماريه او غيرها من هذا القَبِيل. </li>
              <li>يجب معاملة اسم المستخدم وكلمة المرور وأية معلومات أمنية أخرى بالسرية التامة، وعدم الإفصاح عنها لأي طرف ثالث ويتحمل صاحب الحساب جميع التبعيات القانونية في حال سرقة حسابه واساءة استخدام الخدمة من قبل طرف ثالث. </li>
              <li>يجب على صاحب الحساب إبلاغ منصة رسائل عبر هذا البريد الإلكتروني support@masafa.ly في حال الشك أو الظن بأن شخص آخر يعرف باسم المستخدم أو كلمة المرور الخاصة به.</li>
              <li>مسؤولية صاحب الحساب من التأكد بأن جميع الأشخاص الذين يدخلون إلى الصفحة الخاصة به بمنصة رسائل على علم بهذه الشروط، وأنهم يلتزمون بها . </li>
              <li>منصة رسائل ليس مسئول عن تأخير الرسائل أو ضياعها في الحالات التالية : كتابة أرقام الهواتف بشكل خاطئ من قبل المستخدم. عدم توفر خدمة الرسائل النصية أو عدم التوافقية في الهواتف المستقبلة للرسائل. عدم توفر تغطية لشبكة الهاتف المحمول في الهاتف المستقبل أو كان خارج نطاق التغطية. </li>
              <li> لا تتحمل المنصة أي تعويض مادي أو معنوي نتيجة التوقف المفاجئ للخدمة لأي سبب كان خارج عن إرادة المنصة ويمكن للمنصة تقديم تعويض بعدد رسائل بديلة في حال تم التأكد ان الرسائل لم تُرسل نهائيا من خلال المنصة ولا تعتبر المنصة مسئولة بأي شكل من الأشكال في حال فشل تسليم الرسائل لمستقبليها طالما تم تسجل خروجها من نظامنا. </li>
              <li> صلاحية باقة الرسائل لكل مستخدم تبدأ من 6 أشهر للباقات الصغيرة وتنتهي ب 24 شهر للباقات الكبيرة التي تفوق الــ 100 ألف رسالة. </li>
              <li> تتكون الرسالة الواحدة من صفحة واحدة لا تتجاوز 70 حرف باللغة العربية و120 حرف للغة الإنجليزية وفي حال زاد عدد الحروف فإنها تحسب وكأنها رسالتين وهكذا. </li>
              <li>الأسعار قابلة للتغير من وقت إلى أخر على حسب سياسات المنصة والشركات المزودة لخدمات الهاتف المحمول </li>
              <li>يحق للمنصة في حال مخالفة بعض أو كل بنود الشروط والأحكام والسياسات المذكورة أعلاه إغلاق حساب أي شخص دون سبق اندار وسيتم ارجاع ما تبقى من رصيد رسائل مدفوع إن وجد. </li>
            </ol>
          </div>
          <div className="policy-checkbox-wrapper sticky bottom-0 bg-brand-primary p-1 text-white rounded-b-lg">
            <label className="policy-checkbox flex items-center font-bold select-none">
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className="ml-1 m-1 cursor-pointer"
              />
              أوافق على الشروط والأحكام
            </label>
          </div>
        </div>
      </div>

      <Popup
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
      />

      {/* Adding the style block back ONLY for the custom spinner animation 
          which is hard to achieve with default Tailwind classes without
          extending the theme configuration. */}
      <style>{`
        /* Custom spinner animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .border-3 { border-width: 3px !important; }
        .border-t-3 { border-top-width: 3px !important; }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}