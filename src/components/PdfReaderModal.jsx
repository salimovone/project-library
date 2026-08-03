import React, { useEffect, useState, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  FaDownload,
  FaTimes,
  FaBookOpen,
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaList,
  FaMoon,
  FaSun,
  FaExpand,
  FaCompress,
  FaExternalLinkAlt,
  FaSpinner,
  FaBookReader,
} from "react-icons/fa";

// Set Worker path for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfReaderModal({ isOpen, onClose, book }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [theme, setTheme] = useState("dark"); // "dark" | "light" | "sepia"
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const modalContainerRef = useRef(null);
  const renderTaskRef = useRef(null);

  const pdfUrl = book?.file_pdf || book?.pdf;
  const isDemoOrYoutube = !pdfUrl || pdfUrl.includes("youtube.com") || pdfUrl.includes("youtu.be");

  // Load PDF Document natively via PDF.js
  useEffect(() => {
    if (!isOpen || isDemoOrYoutube || !pdfUrl) {
      setPdfDoc(null);
      setNumPages(0);
      setCurrentPage(1);
      setLoadError(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setLoadError(false);

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      withCredentials: false,
    });

    loadingTask.promise
      .then((doc) => {
        if (!isMounted) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("PDF.js load error:", err);
        if (!isMounted) return;
        // Fallback: try fetching ArrayBuffer to bypass CORS header restrictions
        fetch(pdfUrl)
          .then((res) => res.arrayBuffer())
          .then((buffer) => pdfjsLib.getDocument({ data: buffer }).promise)
          .then((doc) => {
            if (!isMounted) return;
            setPdfDoc(doc);
            setNumPages(doc.numPages);
            setCurrentPage(1);
            setIsLoading(false);
          })
          .catch((bufferErr) => {
            console.error("ArrayBuffer load error:", bufferErr);
            if (isMounted) {
              setLoadError(true);
              setIsLoading(false);
            }
          });
      });

    return () => {
      isMounted = false;
      if (loadingTask) loadingTask.destroy();
    };
  }, [isOpen, pdfUrl, isDemoOrYoutube]);

  // Render Page onto Native HTML5 Canvas with Selectable Text Layer
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      setIsRendering(true);
      const page = await pdfDoc.getPage(currentPage);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height * dpr;
      canvas.width = viewport.width * dpr;
      canvas.style.height = `${viewport.height}px`;
      canvas.style.width = `${viewport.width}px`;

      ctx.scale(dpr, dpr);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;

      // Render Selectable Text Layer
      if (textLayerRef.current) {
        try {
          const textContent = await page.getTextContent();
          const textLayerDiv = textLayerRef.current;
          textLayerDiv.innerHTML = "";
          textLayerDiv.style.height = `${viewport.height}px`;
          textLayerDiv.style.width = `${viewport.width}px`;

          if (pdfjsLib.TextLayer) {
            const textLayer = new pdfjsLib.TextLayer({
              textContentSource: textContent,
              container: textLayerDiv,
              viewport: viewport,
            });
            await textLayer.render();
          }
        } catch (textErr) {
          console.error("Text layer render error:", textErr);
        }
      }
    } catch (err) {
      if (err?.name !== "RenderingCancelledException") {
        console.error("Page render error:", err);
      }
    } finally {
      setIsRendering(false);
    }
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage();
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  // Keyboard Shortcuts Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setCurrentPage((p) => Math.min(numPages, p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setScale((s) => Math.min(3.0, s + 0.25));
      } else if (e.key === "-") {
        e.preventDefault();
        setScale((s) => Math.max(0.5, s - 0.25));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, numPages, onClose]);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // PDF Download Handler
  const handleDownload = async () => {
    if (isDemoOrYoutube || !pdfUrl) return;
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book?.title || book?.name || "kitob"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(pdfUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  // Theme Styles
  const themeBgClasses = {
    dark: "bg-[#18181b] text-white",
    light: "bg-[#f4f4f5] text-gray-900",
    sepia: "bg-[#fbf0d9] text-[#4a3b2c]",
  };

  const canvasFilterStyle = theme === "dark" ? { filter: "invert(0.9) hue-rotate(180deg)" } : theme === "sepia" ? { filter: "sepia(0.3) brightness(0.95)" } : {};

  return (
    <div
      ref={modalContainerRef}
      className={`fixed inset-0 z-50 flex flex-col font-interface animate-in fade-in duration-200 select-none ${themeBgClasses[theme]}`}
    >
      {/* Top Professional Reader Header */}
      <header className="h-16 px-4 md:px-6 bg-[var(--navy-primary)] text-white flex items-center justify-between shadow-md border-b border-white/10 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
              showSidebar ? "bg-white/25 text-white" : "bg-white/10 hover:bg-white/20 text-blue-200"
            }`}
            title="Mundarija va sahifalar panelini ochish/yopish"
          >
            <FaList className="text-sm" />
          </button>

          <div className="flex flex-col min-w-0">
            <h2 className="text-xs md:text-sm font-bold text-white truncate max-w-xs md:max-w-md">
              {book?.title || book?.name || "Onlayn kitob o'qish"}
            </h2>
            <span className="text-[11px] text-blue-200 truncate">
              {Array.isArray(book?.author)
                ? book.author.map((a) => (typeof a === "object" ? a.name || a.sortingname : a)).join(", ")
                : typeof book?.author === "object"
                ? book.author.name
                : book?.author || "Muallif"}
            </span>
          </div>
        </div>

        {/* Center Page Navigator & Zoom Controls */}
        {pdfDoc && (
          <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl">
            {/* Previous Page */}
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 transition cursor-pointer"
              title="Oldingi sahifa (←)"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {/* Current / Total Pages Input */}
            <div className="flex items-center gap-1 text-xs font-bold px-1">
              <input
                type="number"
                min={1}
                max={numPages}
                value={currentPage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1 && val <= numPages) setCurrentPage(val);
                }}
                className="w-10 h-7 text-center bg-white/20 border border-white/30 rounded text-white font-extrabold outline-none text-xs"
              />
              <span className="text-blue-200 font-medium">/ {numPages}</span>
            </div>

            {/* Next Page */}
            <button
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 transition cursor-pointer"
              title="Keyingi sahifa (→)"
            >
              <FaChevronRight className="text-xs" />
            </button>

            <div className="w-px h-4 bg-white/20 mx-1" />

            {/* Zoom Minus */}
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
              title="Kichiklashtirish (-)"
            >
              <FaSearchMinus className="text-xs" />
            </button>

            <span className="text-xs font-extrabold w-12 text-center text-white">{Math.round(scale * 100)}%</span>

            {/* Zoom Plus */}
            <button
              onClick={() => setScale((s) => Math.min(3.0, s + 0.25))}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
              title="Kattalashtirish (+)"
            >
              <FaSearchPlus className="text-xs" />
            </button>
          </div>
        )}

        {/* Right Actions & Theme Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Reading Theme Toggle */}
          <div className="flex items-center bg-white/10 border border-white/15 p-1 rounded-xl">
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-lg transition cursor-pointer text-xs ${
                theme === "dark" ? "bg-white/30 text-white font-bold" : "text-blue-200 hover:text-white"
              }`}
              title="Tungi rejim"
            >
              <FaMoon />
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-lg transition cursor-pointer text-xs ${
                theme === "light" ? "bg-white/30 text-white font-bold" : "text-blue-200 hover:text-white"
              }`}
              title="Yorug' rejim"
            >
              <FaSun />
            </button>
            <button
              onClick={() => setTheme("sepia")}
              className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-[11px] font-extrabold ${
                theme === "sepia" ? "bg-[#fbf0d9] text-[#4a3b2c]" : "text-blue-200 hover:text-white"
              }`}
              title="Sepia rejim"
            >
              Aa
            </button>
          </div>

          {!isDemoOrYoutube && pdfUrl && (
            <button
              onClick={handleDownload}
              className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition border border-white/20 cursor-pointer"
            >
              <FaDownload className="text-xs" /> PDF
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center text-xs cursor-pointer border border-white/15"
            title="To'liq ekran"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-red-500 text-white transition flex items-center justify-center text-base cursor-pointer border border-white/20"
            title="Yopish (Esc)"
          >
            <FaTimes />
          </button>
        </div>
      </header>

      {/* Main E-Book Reader Studio Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Page Thumbnails List */}
        {showSidebar && pdfDoc && (
          <aside className="w-56 md:w-64 bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col shrink-0 z-10 animate-in slide-in-from-left duration-200">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-200">
                Sahifalar ({numPages})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 custom-scrollbar">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === currentPage;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isActive
                        ? "bg-[var(--navy-primary)] text-white border-[var(--navy-primary)] font-bold shadow-md"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                    }`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-xs font-extrabold shrink-0">
                      {p}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs truncate font-semibold">Sahifa {p}</span>
                      <span className="text-[10px] opacity-75">{Math.round((p / numPages) * 100)}% o'qildi</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center Reader Workspace Canvas */}
        <main className="flex-1 overflow-auto flex flex-col items-center justify-start p-4 md:p-8 relative custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center my-auto gap-4">
              <FaSpinner className="text-4xl animate-spin text-[var(--navy-primary)] dark:text-blue-400" />
              <span className="text-sm font-bold tracking-wide">PDF kitob yuklanmoqda va qayta ishlanmoqda...</span>
            </div>
          ) : loadError || isDemoOrYoutube ? (
            <div className="flex flex-col items-center justify-center my-auto text-center p-8 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl max-w-lg shadow-2xl text-[var(--text-main)]">
              <div className="w-16 h-16 rounded-2xl bg-[var(--navy-light)] text-[var(--navy-primary)] dark:text-white flex items-center justify-center text-3xl mb-4">
                <FaBookReader />
              </div>
              <h3 className="text-base font-extrabold mb-2">Native PDF Kitobini Ochish</h3>
              <p className="text-xs text-[var(--text-subtle)] leading-relaxed mb-6">
                Ushbu kitob uchun backendda haqiqiy `.pdf` raqamli fayli yuklanmagan yoki test manzil berilgan. Fayl biriktirilgan taqdirda sayt uni ushbu Canvas E-Book Studio orqali native render qiladi.
              </p>
              {pdfUrl && (
                <button
                  onClick={() => window.open(pdfUrl, "_blank")}
                  className="px-6 py-2.5 rounded-xl bg-[var(--navy-primary)] text-white text-xs font-bold shadow-xs hover:opacity-90 transition flex items-center gap-2 cursor-pointer mb-3"
                >
                  <FaExternalLinkAlt /> Yangi tabda ochib ko'rish
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl border border-[var(--border-main)] text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition cursor-pointer"
              >
                Yopish
              </button>
            </div>
          ) : (
            <div className="relative shadow-2xl rounded-lg overflow-hidden my-auto transition-transform duration-200">
              {isRendering && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-10">
                  <FaSpinner className="text-2xl animate-spin text-white" />
                </div>
              )}
              <canvas ref={canvasRef} style={canvasFilterStyle} className="rounded-lg shadow-2xl block bg-white" />
              <div ref={textLayerRef} className="pdf-text-layer" />
            </div>
          )}
        </main>
      </div>

      {/* Bottom Reading Progress Bar */}
      {pdfDoc && (
        <footer className="h-10 px-6 bg-[var(--navy-primary)]/90 text-white flex items-center justify-between text-xs font-bold border-t border-white/10 shrink-0 z-20">
          <span>
            Joriy sahifa: <b>{currentPage}</b> / {numPages}
          </span>
          <div className="w-48 bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${(currentPage / numPages) * 100}%` }}
            />
          </div>
          <span>{Math.round((currentPage / numPages) * 100)}% O'qildi</span>
        </footer>
      )}
    </div>
  );
}
