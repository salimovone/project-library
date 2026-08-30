import { useState, useEffect } from "react";
import { FiUser, FiEyeOff, FiEye, FiArrowRight } from "react-icons/fi";
import logoDarkText from "../../assets/logo.png";
import logoWhiteText from "../../assets/logo-white-text.png";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const { login, loading, isAuthenticated, error } = useAuth();
  const [useId, setuseId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      window.location.reload();
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      setuseId("");
      setPassword("");
    }
  }, [error]);

  const handleLogin = (e) => {
    e.preventDefault();
    login(useId, password);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (localError) {
      setLocalError(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-center p-4 font-interface transition-colors duration-300 relative">
      {/* Top Left Return to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 md:top-8 md:left-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--navy-primary)] dark:text-white text-xs font-bold shadow-xs hover:bg-[var(--navy-light)] transition cursor-pointer"
      >
        ← Bosh sahifaga qaytish
      </button>

      {/* Brand Header */}
      <div onClick={() => navigate("/")} className="mb-8 cursor-pointer flex flex-col items-center gap-2">
        <img
          src={logoDarkText}
          alt="Alfraganus Library"
          className="h-12 md:h-14 w-auto block dark:hidden object-contain"
        />
        <img
          src={logoWhiteText}
          alt="Alfraganus Library"
          className="h-12 md:h-14 w-auto hidden dark:block object-contain"
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-7 md:p-9 shadow-xs transition-colors duration-300">
        <div className="text-center mb-7">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--navy-light)] text-[var(--navy-primary)] dark:text-white text-xs font-bold mb-3">
            Alfraganus University
          </span>
          <h1 className="font-editorial text-2.5xl md:text-3xl font-normal text-[var(--text-main)] mb-1.5">
            Tizimga kirish
          </h1>
          <p className="text-xs md:text-sm text-[var(--text-muted)] font-semibold">
            HEMIS ID va parolingiz orqali shaxsiy kabinetga kiring
          </p>
        </div>

        {localError && (
          <div className="mb-5 bg-[var(--crimson-light)] border border-[var(--crimson-border)] p-3.5 rounded-xl text-xs font-bold text-[var(--crimson-primary)]">
            {localError}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              HEMIS ID
            </label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 text-gray-400 text-base" />
              <input
                type="text"
                value={useId}
                onChange={handleInputChange(setuseId)}
                placeholder="457000007876"
                className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl pl-10 pr-4 text-sm font-semibold text-[var(--text-main)] placeholder-[#8a93a6] focus:border-[var(--navy-primary)] outline-none transition"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              Parol
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="••••••••"
                className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl pl-4 pr-10 text-sm font-semibold text-[var(--text-main)] placeholder-[#8a93a6] focus:border-[var(--navy-primary)] outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-[var(--text-main)] cursor-pointer"
              >
                {showPassword ? <FiEye className="text-base" /> : <FiEyeOff className="text-base" />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[var(--crimson-primary)] text-white text-sm font-bold shadow-xs hover:opacity-90 transition cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? "Kutilmoqda..." : "Kirish"} <FiArrowRight className="text-base" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--border-main)] text-center text-xs text-[var(--text-subtle)] font-medium">
          Ma'lumotlar qayta tiklash uchun HEMIS bo'limiga murojaat qiling.
        </div>
      </div>

      {/* Additional Bottom Return Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--navy-primary)] dark:text-white text-xs font-bold shadow-xs hover:bg-[var(--navy-light)] transition cursor-pointer"
      >
        ← Bosh sahifaga qaytish
      </button>
    </div>
  );
}