import { useState } from "react";
import { Link } from "react-router";
import { BiChevronLeft } from "react-icons/bi";
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    topic: "Taklif",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // 'idle', 'submitting', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    console.log("telegram", botToken, chatId);

    if (!botToken || !chatId) {
      setStatus("error");
      return;
    }

    const text = `
<b>🔔 Saytdan yangi murojaat:</b>

<b>👤 Ism:</b> ${formData.name}
<b>📞 Aloqa:</b> ${formData.contact}
<b>🏷 Mavzu:</b> ${formData.topic}

<b>📝 Xabar:</b>
${formData.message}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setStatus("success");
        setFormData({ name: "", contact: "", topic: "Taklif", message: "" });
      } else {
        setStatus("error");
        setErrorMessage("Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Tarmoq xatosi yoki server ishlamayapti.");
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="custom-container mx-auto px-4 max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <BiChevronLeft className="text-xl" /> Ortga qaytish
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fikr va Mulohaza</h1>
            <p className="text-gray-500">Sayt bo'yicha takliflar, xatoliklar yoki qandaydir savollaringiz bo'lsa bizga tezkor murojaat yo'llashingiz mumkin.</p>
          </div>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 mb-6 transition-all">
              <FaCheckCircle className="text-xl shrink-0" />
              <p>Murojaatingiz muvaffaqiyatli yuborildi. Rahmat!</p>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 mb-6 transition-all">
              <FaExclamationCircle className="text-xl shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ismingiz <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Abdulla Qodiriy"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Aloqa uchun (Tel/Email)
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Murojaat turi
              </label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="Taklif">Taklif</option>
                <option value="Xatolik haqida">Saytdagi xatolik</option>
                <option value="Savol">Savol</option>
                <option value="Boshqa">Boshqa...</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Xabaringiz <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Fikringizni shu yerda batafsil yozib qoldiring..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <>Yuborilmoqda...</>
              ) : (
                <>Jo'natish <FaPaperPlane className="text-sm" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
