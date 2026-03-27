import useRole from "../../../hooks/useRole";

const reviewStats = [
  { label: "5 star", value: 75 },
  { label: "4 star", value: 15 },
  { label: "3 star", value: 6 },
  { label: "2 star", value: 3 },
  { label: "1 star", value: 1 },
];

export default function ReviewSummary() {
  const { checkUserLevel } = useRole()
  const handleWriteReview = () => {
    /* Sharh yozish modalini ochish */ console.log("Sharh oynasi...");
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-base font-bold text-[#143c7b]">
            Mijozlar bahosi
          </h3>
          <p className="mt-2 text-5xl font-bold text-[#1a478e]">4.5</p>
          <p className="text-sm text-gray-500 mt-1">2,847 ta sharh asosida</p>
        </div>
        <div className="flex-1 space-y-2.5">
          {reviewStats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-12 text-xs font-medium text-gray-600">
                {stat.label}
              </span>
              <div className="h-2.5 flex-1 rounded-full bg-gray-100">
                <div
                  className="h-2.5 rounded-full bg-yellow-400"
                  style={{ width: `${stat.value}%` }}
                />
              </div>
              <span className="w-10 text-xs font-medium text-gray-600">
                {stat.value}%
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={handleWriteReview}
          className="w-full lg:w-auto self-start rounded-xl bg-[#003282] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!checkUserLevel("student")}
          type="button"
        >
          Sharh qoldirish
        </button>
      </div>
    </div>
  );
}
