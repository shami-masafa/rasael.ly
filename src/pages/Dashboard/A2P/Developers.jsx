import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
// Note: We need a style that works with Tailwind's light/dark modes if applied globally.
// 'atomOneLight' is fine for a light theme, but Tailwind often implies a utility-first approach.
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { FaCopy, FaExclamationCircle } from "react-icons/fa";
import { useState, useEffect } from "react";


export default function Developers() {
  const [activeTab, setActiveTab] = useState("python");

  const examples = {
    python: `import requests

# LOGIN TO GET TOKEN
login_res = requests.post(
    "https://rasael.almasafa.ly/api/MasafaRasaelLogin",
    json={"username": "USERNAME", "password": "PASSWORD"}
)
token = login_res.json().get("token")

# SEND SMS
sms_res = requests.post(
    "https://rasael.almasafa.ly/api/sms/Send",
    json={"phoneNumber": "2189########", "message": "Hello from Python!", "senderID": "13201"},
    headers={"Authorization": f"Bearer {token}"}
)
print(sms_res.json())`,
    javascript: `// LOGIN TO GET TOKEN
const loginRes = await fetch("https://rasael.almasafa.ly/api/MasafaRasaelLogin", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({username: "USERNAME", password: "PASSWORD"})
});
const loginData = await loginRes.json();
const token = loginData.token;

// SEND SMS
const smsRes = await fetch("https://rasael.almasafa.ly/api/sms/Send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({phoneNumber: "12345678", message: "Hello from JS!", senderID: "13201"})
});
const smsData = await smsRes.json();
console.log(smsData);`,
    "#C": `using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Text;

// LOGIN AND GET TOKEN
var payload = new { username = "USERNAME", password = "PASSWORD" };
var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
var loginRes = await httpClient.PostAsync("https://rasael.almasafa.ly/api/MasafaRasaelLogin", content);
var token = JsonConvert.DeserializeObject<dynamic>(await loginRes.Content.ReadAsStringAsync())?.token;

// SEND SMS
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
var messagePayload = new { phoneNumber = "12345678", message = "Hello from C#!", senderID = "13201" };
var smsRes = await httpClient.PostAsync(
    "https://rasael.almasafa.ly/api/sms/Send",
    new StringContent(JsonConvert.SerializeObject(messagePayload), Encoding.UTF8, "application/json")
);`,
    php: `<?php
// LOGIN TO GET TOKEN
$ch = curl_init("https://rasael.almasafa.ly/api/MasafaRasaelLogin");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["username"=>"USERNAME","password"=>"PASSWORD"]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
$loginRes = curl_exec($ch);
$token = json_decode($loginRes)->token;

// SEND SMS
$ch2 = curl_init("https://rasael.almasafa.ly/api/sms/Send");
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_POST, true);
curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode(["phoneNumber"=>"12345678","message"=>"Hello from PHP!","senderID"=>"13201"]));
curl_setopt($ch2, CURLOPT_HTTPHEADER, ["Content-Type: application/json","Authorization: Bearer $token"]);
$smsRes = curl_exec($ch2);
echo $smsRes;`,
    dart: `// LOGIN TO GET JWT TOKEN
final loginRes = await http.post(
  Uri.parse("https://rasael.almasafa.ly/api/MasafaRasaelLogin"),
  headers: {"Content-Type": "application/json"},
  body: json.encode({"username": "USERNAME", "password": "PASSWORD"}),
);

// PARSE RESPONSE AND EXTRACT TOKEN
final loginData = json.decode(loginRes.body);
final token = loginData["token"]?.toString();

// SEND SMS
final smsRes = await http.post(
  Uri.parse("https://rasael.almasafa.ly/api/sms/Send"),
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer $token",
  },
  body: json.encode({
    "phoneNumber": "2189########",
    "message": "Hello from Dart!",
    "senderID": "13201",
  }),
);`,
    java: `// LOGIN TO GET TOKEN
HttpClient client = HttpClient.newHttpClient();
HttpRequest loginRequest = HttpRequest.newBuilder()
    .uri(URI.create("https://rasael.almasafa.ly/api/MasafaRasaelLogin"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("{\\"username\\":\\"USERNAME\\",\\"password\\":\\"PASSWORD\\"}"))
    .build();
HttpResponse<String> loginResponse = client.send(loginRequest, HttpResponse.BodyHandlers.ofString());
String token = new JSONObject(loginResponse.body()).getString("token");

// SEND SMS
HttpRequest smsRequest = HttpRequest.newBuilder()
    .uri(URI.create("https://rasael.almasafa.ly/api/sms/Send"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + token)
    .POST(HttpRequest.BodyPublishers.ofString("{\\"phoneNumber\\":\\"12345678\\",\\"message\\":\\"Hello from Java!\\",\\"senderID\\":\\"13201\\"}"))
    .build();
HttpResponse<String> smsResponse = client.send(smsRequest, HttpResponse.BodyHandlers.ofString());
System.out.println(smsResponse.body());`,
  };

  const [token, setToken] = useState("");

useEffect(() => {
  const storedToken = sessionStorage.getItem("rasaelToken");
  if (storedToken) {
    setToken(storedToken);
  }
}, []);

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="p-5 font-['Tajawal'] rtl">
      <div className="flex flex-wrap gap-8">
        {/* Postman Section */}
        <div className="flex flex-col gap-4 flex-1 basis-[500px]">
          <p className="text-lg font-bold text-[#455785]">
            كيفية استخدام API لإرسال الرسائل واستلام التوكن في Postman:
          </p>

          {/* Step 1 */}
          <div className="flex flex-col gap-2">
            <p className="flex items-center">
              1. ضع رابط تسجيل الدخول
              <span className="relative mr-2 cursor-pointer text-[#455785] group">
                <FaExclamationCircle />
                <img
                  src="/images/PostmanLoginMasafa.png"
                  alt="Postman login"
                  className="absolute top-0 right-6 w-[550px] max-w-none rounded-md shadow-xl hidden group-hover:block z-50"
                />
              </span>
            </p>
          </div>

          {/* Step 2 */}
          <p>2. أدخل بيانات username و password في الـ Body.</p>
          {/* LTR container for code block */}
          <div className="ltr bg-gray-50 border border-gray-300 rounded-md overflow-hidden mt-2 p-3 w-full max-w-xl flex flex-col gap-2 relative">
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md overflow-x-auto text-sm font-mono">
              <strong className="text-base text-[#455785]">Login:</strong>
              <code className="flex-1 mx-2 text-gray-700 whitespace-nowrap">
                https://rasael.almasafa.ly/api/MasafaRasaelLogin
              </code>
              <button
                className="copy-btn flex items-center gap-1 border-none bg-transparent text-[#455785] p-1 rounded-md cursor-pointer transition-colors hover:bg-[#2f3d64] hover:text-white"
                onClick={() =>
                  copyToClipboard("https://rasael.almasafa.ly/api/MasafaRasaelLogin")
                }
                title="نسخ الرابط"
              >
                <FaCopy size={14} />
              </button>
            </div>

            <div className="relative bg-white border border-gray-300 rounded-md overflow-hidden">
              <button
                className="copy-btn absolute top-1 right-1 z-10 flex items-center gap-1 border-none bg-transparent text-[#455785] p-1 rounded-md cursor-pointer transition-colors hover:bg-[#2f3d64] hover:text-white"
                onClick={() =>
                  copyToClipboard(`{
  "username": ">>>>>",
  "password": "<<<<<"
}`)
                }
              >
                <FaCopy />
              </button>
              <SyntaxHighlighter language="json" style={atomOneLight} wrapLongLines>
                {`{
  "username": ">>>>>",
  "password": "<<<<<"
}`}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Step 3 */}
          <p className="flex items-center">
            3. انسخ التوكن الناتج وضعه في تبويب Authorization
            <span className="relative mr-2 cursor-pointer text-[#455785] group">
              <FaExclamationCircle />
              <img
                src="/images/PostmanAuthorization.png"
                alt="Postman auth"
                className="absolute top-0 right-6 w-[550px] max-w-none rounded-md shadow-xl hidden group-hover:block z-50"
              />
            </span>
          </p>

          {/* Step 4 */}
          <div className="flex flex-col gap-2">
            <p className="flex items-center">
              4. أرسل طلب إرسال الرسالة على رابط الإرسال
              <span className="relative mr-2 cursor-pointer text-[#455785] group">
                <FaExclamationCircle />
                <img
                  src="/images/PostmanSendMessage.png"
                  alt="Postman send"
                  className="absolute top-0 right-6 w-[550px] max-w-none rounded-md shadow-xl hidden group-hover:block z-50"
                />
              </span>
            </p>

            {/* LTR container for code block */}
            <div className="ltr bg-gray-50 border border-gray-300 rounded-md overflow-hidden p-3 w-full max-w-xl flex flex-col gap-2 relative">
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md overflow-x-auto text-sm font-mono">
                <strong className="text-base text-[#455785]">Send SMS:</strong>
                <code className="flex-1 mx-2 text-gray-700 whitespace-nowrap">
                  https://rasael.almasafa.ly/api/sms/Send
                </code>
                <button
                  className="copy-btn flex items-center gap-1 border-none bg-transparent text-[#455785] p-1 rounded-md cursor-pointer transition-colors hover:bg-[#2f3d64] hover:text-white"
                  onClick={() =>
                    copyToClipboard("https://rasael.almasafa.ly/api/sms/Send")
                  }
                  title="نسخ الرابط"
                >
                  <FaCopy size={14} />
                </button>
              </div>

              <div className="relative bg-white border border-gray-300 rounded-md overflow-hidden">
                <button
                  className="copy-btn absolute top-1 right-1 z-10 flex items-center gap-1 border-none bg-transparent text-[#455785] p-1 rounded-md cursor-pointer transition-colors hover:bg-[#2f3d64] hover:text-white"
                  onClick={() =>
                    copyToClipboard(`{
  "phoneNumber": "2189########",
  "message": "Rasael Test",
  "senderID": ""
}`)
                  }
                >
                  <FaCopy />
                </button>
                <SyntaxHighlighter language="json" style={atomOneLight} wrapLongLines>
                  {`{
  "phoneNumber": "2189########",
  "message": "Rasael Test",
  "senderID": ""
}`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>

        {/* Token Box Section */}
        {/* LTR container for token box */}
        <div className="flex flex-col gap-2 flex-1 basis-40">
          <div className="bg-gray-100 p-2 rounded-md ltr">
            <div className="flex justify-between">
              <label>
                <b className="text-gray-800">Token:</b>
              </label>
              <button
                className="copy-btn-token flex items-center gap-1 border-none bg-transparent text-[#455785] p-1 rounded-md cursor-pointer transition-colors hover:bg-[#2f3d64] hover:text-white"
                onClick={() => copyToClipboard(token || "")}
              >
                <FaCopy />
              </button>
            </div>
            <div className="flex items-start gap-1 mt-1">
              <textarea
                readOnly
                value={token || "غير متوفر"}
                className="w-full h-60 resize-none font-mono text-sm p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="my-8"></div>

      <p className="text-lg font-bold text-[#455785]">
        كيفية استخدام API لإرسال الرسائل واستلام التوكن في لغات مختلفة:
      </p>

      {/* CODE TABS - Already LTR */}
      <div className="mt-4 w-full md:w-3/4 max-w-xl rounded-md">
        <div className="flex border-b border-gray-300 bg-gray-100 rounded-t-md overflow-hidden">
          {Object.keys(examples).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`flex-1 py-3 px-4 cursor-pointer text-gray-700 text-sm transition-colors ${
                activeTab === lang
                  ? "bg-[#455785] text-white font-bold"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Code Content - Already LTR */}
        <div className="bg-transparent border-2 border-gray-100 rounded-b-md relative p-4 ltr">
          <button
            onClick={() => copyToClipboard(examples[activeTab])}
            className="copy-btn absolute top-2 right-2 flex items-center gap-1 border-none bg-transparent text-[#455785] p-1 rounded-md cursor-pointer transition-colors hover:bg-[#2f3d64] hover:text-white"
          >
            <FaCopy />
          </button>
          <SyntaxHighlighter language={activeTab} style={atomOneLight} wrapLongLines>
            {examples[activeTab]}
          </SyntaxHighlighter>
        </div>
      </div>
            <style>{`
        .ltr {
          direction: ltr !important;
          text-align: left;
        }
      `}</style>
    </div>
  );
}