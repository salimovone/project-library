/**
 * LibraryPage Component
 * Responsibility: Display library (books) page content
 * SOLID: Single Responsibility Principle
 */
export default function LibraryPage() {
  const books = [
    { id: 1, title: "O'zbek Klassiklari", author: "Alisher Navoi", year: 1500 },
    { id: 2, title: "Temur Qo'mondonchisi", author: "Zahir ad-Din Muhammad Bobur", year: 1506 },
    { id: 3, title: "Muqaddima", author: "Ibn Xaldun", year: 1377 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📖 Kitoblar</h1>
        <p className="text-gray-600 text-lg">Bizning to'plamda mavjud kitoblar ro'yxati</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Kitob nomi bo'yicha qidiring..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Muallif bo'yicha qidiring..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            🔍 Qidirish
          </button>
        </div>
      </div>

      {/* Books List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-32 flex items-center justify-center">
              <div className="text-6xl">📘</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Muallif:</span> {book.author}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Yil:</span> {book.year}
              </p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                O'qish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
