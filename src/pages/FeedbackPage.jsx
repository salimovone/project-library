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

  const [status, setStatus] = useState("idle");
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

    if (!botToken || !chatId) {
      setStatus("error");
      setErrorMessage("Telegram bot sozlamalari topilmadi.");
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
    <div className="py-12 bg-[var(--bg-page)] font-interface min-h-screen transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--navy-primary)] dark:text-blue-300 hover:underline mb-6"
        >
          <BiChevronLeft className="text-xl" /> Bosh sahifaga qaytish
        </Link>

        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-xs p-7 md:p-9 transition-colors duration-300">
          <div className="text-center mb-8">
            <h1 className="font-editorial text-3xl font-normal text-[var(--text-main)] mb-2">
              Fikr va mulohazalar
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)] font-medium">
              Sayt bo'yicha takliflar, xatoliklar yoki savollaringiz bo'lsa bizga tezkor murojaat yo'llashingiz mumkin.
            </p>
          </div>

          {status === "success" && (
            <div className="bg-[#eaf7ee] dark:bg-[#12281a] border border-[#a2e0b5] text-[#2d7a46] dark:text-[#5fd28a] px-4 py-3.5 rounded-xl flex items-center gap-3 mb-6 text-xs font-bold">
              <FaCheckCircle className="text-base shrink-0" />
              <p>Murojaatingiz muvaffaqiyatli yuborildi. Rahmat!</p>
            </div>
          )}

          {status === "error" && (
            <div className="bg-[var(--crimson-light)] border border-[var(--crimson-border)] text-[var(--crimson-primary)] px-4 py-3.5 rounded-xl flex items-center gap-3 mb-6 text-xs font-bold">
              <FaExclamationCircle className="text-base shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                Ismingiz <span className="text-[var(--crimson-primary)]">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Abdulla Qodiriy"
                className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] placeholder-[#8a93a6] focus:border-[var(--navy-primary)] outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact" className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                Aloqa uchun (Tel / Telegram / Email)
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] placeholder-[#8a93a6] focus:border-[var(--navy-primary)] outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="topic" className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                Murojaat turi
              </label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] outline-none cursor-pointer"
              >
                <option value="Taklif">Taklif</option>
                <option value="Xatolik haqida">Saytdagi xatolik</option>
                <option value="Savol">Savol</option>
                <option value="Boshqa">Boshqa...</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                Xabaringiz <span className="text-[var(--crimson-primary)]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Fikringizni shu yerda batafsil yozib qoldiring..."
                className="w-full p-4 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl text-sm font-semibold text-[var(--text-main)] placeholder-[#8a93a6] focus:border-[var(--navy-primary)] outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full h-12 rounded-xl bg-[var(--navy-primary)] text-white text-sm font-bold shadow-xs hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {status === "submitting" ? (
                "Yuborilmoqda..."
              ) : (
                <>
                  Jo'natish <FaPaperPlane className="text-xs" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
