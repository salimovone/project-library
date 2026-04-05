import { useState, useEffect } from "react";
import { FiUser, FiEyeOff, FiEye, FiArrowRight } from "react-icons/fi";
import logo from "../../assets/logo.png";
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
      setuseId(""); // Inputni tozalash
      setPassword(""); // Inputni tozalash
    }
  }, [error]);

  const handleLogin = (e) => {
    e.preventDefault();
    login(useId, password);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (localError) {
      setLocalError(null); // Xatoni va UI qizil rangini olib tashlash
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8">
        <img
          src={logo}
          alt="Alfraganus Library"
          className="h-16 md:h-20 object-contain"
        />
      </div>

      <div className="w-full max-w-120 bg-white border border-[#e5e7eb] rounded-2xl px-6 py-10 md:px-10 md:py-12 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-[#143c7b] mb-2">
            Qaytib kelganingizdan xursandmiz
          </h1>
          <p className="text-[#5174ac] font-medium text-sm md:text-base">
            O'qishni davom ettirish uchun tizimga kiring
          </p>
        </div>

        {localError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <p className="text-sm text-red-700 font-medium">{localError}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#143c7b]">
              Hemis Id
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5174ac]">
                <FiUser className="text-lg" />
              </div>
              <input
                type="text"
                value={useId}
                onChange={handleInputChange(setuseId)}
                placeholder="457000007876"
                className="w-full bg-[#f8f9fa] border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#143c7b] focus:ring-1 focus:ring-[#143c7b] transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#143c7b]">
              Parol
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#5174ac]">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none hover:text-[#143c7b] transition-colors"
                >
                  {showPassword ? (
                    <FiEye className="text-lg" />
                  ) : (
                    <FiEyeOff className="text-lg" />
                  )}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="••••••••"
                className="w-full bg-[#f8f9fa] border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#143c7b] focus:ring-1 focus:ring-[#143c7b] transition-colors"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`w-full flex items-center justify-center gap-2 text-white font-medium py-3.5 rounded-xl transition-colors duration-200 mt-2 
              ${
                localError
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400 active:bg-red-800" 
                  : "bg-[#003282] hover:bg-blue-900 disabled:bg-blue-400 active:bg-blue-700"
              }`}
          >
            {loading ? "Kutilmoqda..." : "Kirish"}{" "}
            <FiArrowRight className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
}