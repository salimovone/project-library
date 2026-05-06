export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#121212] transition-colors duration-300">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-[#1a478e] border-t-transparent rounded-full animate-spin"></div>
        {/* Matn */}
        <p className="text-[#1a478e] dark:text-blue-400 font-semibold text-lg tracking-wide animate-pulse">
          Ma'lumotlar yuklanmoqda...
        </p>
      </div>
    </div>
  );
}