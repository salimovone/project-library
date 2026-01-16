/**
 * Footer Component
 * Responsibility: Display footer
 * SOLID: Single Responsibility - only handles footer UI
 */
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="custom-container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">📚 Kutubxona</h3>
            <p className="text-gray-400">Raqamli kitoblar va audiokitoblar platformasi</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Havolalar</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Asosiy</a></li>
              <li><a href="/library" className="hover:text-white transition">Kitoblar</a></li>
              <li><a href="/audiobooks" className="hover:text-white transition">Audiokitoblar</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold mb-4">Aloqa</h4>
            <p className="text-gray-400">Email: info@kutubxona.uz</p>
            <p className="text-gray-400">Tel: +998 90 123 45 67</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Kutubxona. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
