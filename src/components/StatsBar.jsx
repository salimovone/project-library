/**
 * StatsBar Component
 * Responsibility: Render horizontal stats bar
 */
export default function StatsBar({ stats }) {
  return (
    <section className="bg-[#123a7b] py-10">
      <div className="custom-container grid grid-cols-2 gap-6 text-center text-white sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-red-200 sm:text-3xl">{stat.value}</p>
            <p className="text-xs uppercase tracking-wide text-blue-100">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
