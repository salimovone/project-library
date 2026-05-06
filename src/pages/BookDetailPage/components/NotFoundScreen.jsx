export default function NotFoundScreen({
  title = "Kitob topilmadi.",
  message = "Kechirasiz, siz izlayotgan kitob tizimda mavjud emas yoki o'chirilgan bo'lishi mumkin.",
  backLink = "/",
  backText = "Bosh sahifaga qaytish"
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#121212] px-4 transition-colors duration-300">
      <div className="text-center max-w-md space-y-6">
        
        {/* Icon yoki SVG */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-red-500 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Sarlavha va tushuntirish */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {/* Tugma */}
        <div className="pt-4">
          <a
            href={backLink}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm md:text-base font-medium rounded-md shadow-md text-white bg-[#1a478e] hover:bg-[#153a7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a478e] dark:focus:ring-offset-zinc-900 transition-all duration-200"
          >
            {backText}
          </a>
        </div>
        
      </div>
    </div>
  );
}