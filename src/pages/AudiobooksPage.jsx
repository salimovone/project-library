/**
 * AudiobooksPage Component
 * Responsibility: Display audiobooks page content
 * SOLID: Single Responsibility Principle
 */
export default function AudiobooksPage() {
  const audiobooks = [
    { id: 1, title: "Sayohatning Muqaddimasi", author: "Ibn Battuta", duration: "12:45" },
    { id: 2, title: "Tarixi Umumi", author: "Al-Masudi", duration: "15:30" },
    { id: 3, title: "Donishnomag-i Alaiy", author: "Ibn Sino", duration: "18:20" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🎧 Audiokitoblar</h1>
        <p className="text-gray-600 text-lg">O'zbekcha audiokitoblarni istalgan joyda tinglang</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-3xl font-bold text-blue-600">42</p>
          <p className="text-gray-600">Audiokitoblar</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-2">⏱️</div>
          <p className="text-3xl font-bold text-blue-600">245 h</p>
          <p className="text-gray-600">Jami Vaqt</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-3xl font-bold text-blue-600">1,250</p>
          <p className="text-gray-600">Tinglovchi</p>
        </div>
      </div>

      {/* Audiobooks List */}
      <div className="space-y-4">
        {audiobooks.map((audiobook) => (
          <div key={audiobook.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Thumbnail */}
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="text-4xl">🎙️</div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{audiobook.title}</h3>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Muallif:</span> {audiobook.author}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  ⏱️ Davomiyligi: {audiobook.duration}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold">
                  ▶️ Tinglash
                </button>
                <button className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-semibold">
                  ♡ Saqlash
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
