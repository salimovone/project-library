import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  CategoryCard,
  MostReadCard,
  BookCard,
  StatsBar,
} from "../components";
import { fetchLatestBooks } from "../services/bookService";
import { fetchCategories } from "../services/additional";

export default function HomePage() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [mostRead, setMostRead] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadHomePageData = async () => {
      try {
        setLoading(true);
        const [latestBooks, topBooks, cats] = await Promise.all([
          fetchLatestBooks(5),
          fetchLatestBooks(6),
          fetchCategories(),
        ]);

        if (isMounted) {
          setNewArrivals(latestBooks || []);
          setMostRead(topBooks || []);
          setCategories(cats || []);
        }
      } catch (error) {
        console.error("HomePage data load error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHomePageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/books", { state: { search: searchQuery } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--navy-primary)] font-bold text-lg font-interface">
        Ma'lumotlar yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="flex flex-col font-interface bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#eff4fc] to-[#f6f5f2] dark:from-[#0b1730] dark:to-[#0b1120] border-b border-[var(--border-main)] py-12 md:py-16 px-4 md:px-10 overflow-hidden">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(158,27,50,0.07),transparent_52%)] pointer-events-none" />
        
        <div className="max-w-[1320px] 2xl:max-w-[1680px] min-[1920px]:max-w-[1840px] min-[2560px]:max-w-[2240px] mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_0.9fr] gap-[56px] items-center relative">
          {/* Hero Left Content */}
          <div className="flex flex-col gap-5">
            <span className="inline-flex items-center gap-2 self-start bg-[var(--bg-card)] border border-[var(--navy-light-border)] text-[var(--navy-primary)] dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5fd28a]" />
              12 480 nashr · 24/7 onlayn
            </span>

            <h1 className="font-editorial text-4xl md:text-5.5xl font-normal leading-[1.06] text-[var(--text-main)] tracking-tight max-w-[620px]">
              Universitet kutubxonasi — endi bir qidiruv oynasida
            </h1>

            <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-[520px]">
              PDF va audio kitoblarni yuklab oling, brauzerda o'qing yoki fizik nusxani oldindan band qilib, kutubxonaga tayyor holda boring.
            </p>

            {/* Hero Search Box */}
            <form onSubmit={handleHeroSearch} className="flex items-center gap-2 bg.white bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-2 pl-4 max-w-[600px] shadow-sm">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#8a93a6" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4.2-4.2" />
              </svg>
              <input
                type="text"
                placeholder="Anatomiya, Navoiy, dasturlash…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-base text-[var(--text-main)] placeholder-[#8a93a6] font-medium outline-none"
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[var(--crimson-primary)] text-white text-sm font-bold hover:opacity-90 transition cursor-pointer"
              >
                Qidirish
              </button>
            </form>

            {/* Popular Topic Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[var(--text-subtle)] font-semibold">Ommabop:</span>
              {["Tibbiyot", "IT va dasturlash", "Adabiyot", "Iqtisod"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate("/books", { state: { search: tag } })}
                  className="text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full px-3 py-1 hover:border-[var(--navy-primary)] transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Right: Davom Ettirish Widget */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5.5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-widest uppercase text-[var(--text-subtle)]">
                Davom ettirish
              </span>
              <button onClick={() => navigate("/profile")} className="text-xs font-bold text-[var(--navy-primary)] dark:text-blue-400 hover:underline cursor-pointer">
                Barchasi
              </button>
            </div>

            <div className="flex gap-3.5 items-center">
              <span className="w-16 h-22 rounded-xl bg-gradient-to-br from-[#4a7fc9] to-[#2a538f] shrink-0 relative overflow-hidden block">
                <span className="absolute left-0 top-0 bottom-0 w-1.2 bg-[var(--crimson-primary)]" />
              </span>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <span className="text-sm font-bold text-[var(--text-main)] leading-snug truncate">
                  Odam anatomiyasi
                </span>
                <span className="text-xs text-[var(--text-subtle)]">
                  A. G'. Ahmedov · 233-bet / 444
                </span>
                <div className="h-1.5 rounded-full bg-[#f0eee9] dark:bg-[#1a2540] relative overflow-hidden">
                  <span className="absolute left-0 top-0 bottom-0 w-[52%] bg-[#5fd28a] rounded-full" />
                </div>
                <button
                  onClick={() => navigate("/books/1")}
                  className="self-start mt-1 h-8 px-3.5 rounded-lg bg-[var(--navy-primary)] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  O'qishni davom ettirish
                </button>
              </div>
            </div>

            <div className="h-px bg-[var(--border-main)]" />

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl p-3">
                <span className="text-xl font-extrabold text-[var(--text-main)] block leading-none">2</span>
                <span className="text-[11.5px] text-[var(--text-subtle)] font-semibold mt-1 block">Band qilingan</span>
              </div>
              <div className="bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl p-3">
                <span className="text-xl font-extrabold text-[#a8760c] block leading-none">3 kun</span>
                <span className="text-[11.5px] text-[var(--text-subtle)] font-semibold mt-1 block">Qaytarish muddati</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yangi qo'shilgan kitoblar Section */}
      <section className="py-11 px-4 md:px-10 overflow-hidden">
        <div className="max-w-[1320px] 2xl:max-w-[1680px] min-[1920px]:max-w-[1840px] min-[2560px]:max-w-[2240px] mx-auto">
          <div className="flex items-end justify-between mb-5.5">
            <div className="flex flex-col gap-1">
              <h2 className="font-editorial text-2.5xl md:text-3xl font-normal text-[var(--text-main)] tracking-tight">
                Yangi qo'shilgan kitoblar
              </h2>
              <span className="text-[13.5px] text-[var(--text-subtle)]">
                Oxirgi 30 kunda fondga qo'shilgan 46 nashr
              </span>
            </div>
            
            <button
              onClick={() => navigate("/books")}
              className="inline-flex items-center gap-1.5 h-9 px-4 border border-[var(--border-strong)] rounded-full bg-[var(--bg-card)] text-xs font-bold text-[var(--navy-primary)] dark:text-white hover:bg-[var(--navy-light)] transition cursor-pointer shrink-0"
            >
              Barchasi →
            </button>
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:pt-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 min-[2560px]:grid-cols-7 sm:gap-4.5"
            >
              {newArrivals.map((book) => (
                <div
                  key={book.id}
                  className="snap-start shrink-0 w-[68vw] max-w-[230px] min-w-[190px] sm:w-auto sm:max-w-none sm:min-w-0 sm:shrink sm:grow-0"
                >
                  <BookCard
                    book={book}
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="h-full"
                  />
                </div>
              ))}
            </div>

            {/* Bottom Controls for Mobile (below carousel) */}
            <div className="flex sm:hidden items-center justify-center gap-3 mt-3">
              <button
                onClick={scrollLeft}
                aria-label="Oldingi kitoblar"
                className="w-8 h-8 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-main)] flex items-center justify-center text-sm font-bold shadow-xs active:scale-95 transition cursor-pointer"
              >
                ‹
              </button>
              <span className="text-[11.5px] font-semibold text-[var(--text-subtle)]">
                Surish uchun suring
              </span>
              <button
                onClick={scrollRight}
                aria-label="Keyingi kitoblar"
                className="w-8 h-8 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-main)] flex items-center justify-center text-sm font-bold shadow-xs active:scale-95 transition cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Kategoriyalar Section */}
      <section className="py-11 px-4 md:px-10">
        <div className="max-w-[1320px] 2xl:max-w-[1680px] min-[1920px]:max-w-[1840px] min-[2560px]:max-w-[2240px] mx-auto bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-5.5">
            <h2 className="font-editorial text-2xl md:text-2.5xl font-normal text-[var(--text-main)]">
              Sizni nima qiziqtiradi?
            </h2>
            <span className="text-xs font-bold text-[var(--navy-primary)] dark:text-blue-300">
              {categories.length || 14} bo'lim · Katalog
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-7 min-[2560px]:grid-cols-8 gap-3 md:gap-3.5">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                label={category?.name}
                code={category?.code || (category?.name ? category.name.substring(0, 2).toUpperCase() : "TB")}
                count={category?.book_count}
                onClick={() => navigate("/books", { state: { category: category.id } })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Eng ko'p o'qilganlar Section */}
      <section className="pb-12 px-4 md:px-10">
        <div className="max-w-[1320px] 2xl:max-w-[1680px] min-[1920px]:max-w-[1840px] min-[2560px]:max-w-[2240px] mx-auto">
          <div className="flex items-end justify-between mb-5.5">
            <h2 className="font-editorial text-2.5xl md:text-3xl font-normal text-[var(--text-main)]">
              Eng ko'p o'qilganlar
            </h2>
            <button
              onClick={() => navigate("/top-books")}
              className="text-xs font-bold text-[var(--navy-primary)] dark:text-blue-300 hover:underline cursor-pointer"
            >
              Barchasi →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {mostRead.map((book, idx) => (
              <MostReadCard key={book.id} book={book} rank={idx + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* StatsBar */}
      <StatsBar />
    </div>
  );
}