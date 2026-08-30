import { Link } from "react-router";
import logo from "../assets/logo-white-text.png";

/**
 * Footer Component
 * Responsibility: Display footer according to SiteFooter.dc.html design
 */
export default function Footer() {
  return (
    <footer className="bg-[#1b3f7a] text-white font-interface py-10 px-4 md:px-10 transition-colors duration-300">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Col 1: Brand & Details */}
        <div className="flex flex-col gap-3.5">
          <Link to="/">
            <img
              src={logo}
              alt="Alfraganus University Library"
              className="h-8.5 w-auto self-start object-contain"
            />
          </Link>
          <span className="text-xs md:text-[13px] leading-relaxed text-[#8fa1c2] max-w-[300px] block">
            Alfraganus University kutubxonasi — elektron katalog, PDF va audio kitoblar, fizik nusxalarni onlayn band qilish.
          </span>
          <span className="text-xs md:text-[13px] text-[#8fa1c2]">
            Toshkent, Yunusobod · +998 71 200 00 00
          </span>
        </div>

        {/* Col 2: Kutubxona Links */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#5f7093]">
            Kutubxona
          </span>
          <Link to="/books" className="text-[13.5px] text-[#dbe3f1] hover:text-white transition-colors">
            Katalog
          </Link>
          <Link to="/top-books" className="text-[13.5px] text-[#dbe3f1] hover:text-white transition-colors">
            Top kitoblar
          </Link>
          <Link to="/books?filter=new" className="text-[13.5px] text-[#dbe3f1] hover:text-white transition-colors">
            Yangi nashrlar
          </Link>
          <Link to="/books" className="text-[13.5px] text-[#dbe3f1] hover:text-white transition-colors">
            Bo'limlar
          </Link>
        </div>

        {/* Col 3: Yordam Links */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#5f7093]">
            Yordam
          </span>
          <a href="#how-to" className="text-[13.5px] text-[#dbe3f1] hover:text-white transition-colors">
            Qanday band qilaman?
          </a>
          <a href="#rules" className="text-[13.5px] text-[#dbe3f1] hover:text-white transition-colors">
            Qoidalar va muddatlar
          </a>
          <Link to="/feedback" className="text-[13.5px] text-[#dbe3f1] hover:text-white transition-colors">
            Fikr-mulohaza
          </Link>
          <a href="#contact" className="text-[13.5px] text-[#dbe3f1] hover:text-white transition-colors">
            Aloqa
          </a>
        </div>

        {/* Col 4: Ish vaqti */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#5f7093]">
            Ish vaqti
          </span>
          <span className="text-[13.5px] text-[#dbe3f1]">Du–Ju · 09:00–19:00</span>
          <span className="text-[13.5px] text-[#dbe3f1]">Sha · 09:00–15:00</span>
          <span className="text-[13.5px] text-[#8fa1c2]">Onlayn xizmat 24/7</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1320px] mx-auto mt-7 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-[#5f7093]">
          © 2026 Alfraganus University Library. Barcha huquqlar himoyalangan.
        </span>
        <div className="flex gap-4">
          <a href="#privacy" className="text-xs text-[#8fa1c2] hover:text-white transition-colors">
            Maxfiylik siyosati
          </a>
          <a href="#terms" className="text-xs text-[#8fa1c2] hover:text-white transition-colors">
            Foydalanish shartlari
          </a>
        </div>
      </div>
    </footer>
  );
}
