import { useRef, useState } from 'react';

export default function FileUploadTable({
  imageFile,
  setImageFile,
  pdfFile,
  setPdfFile,
  isTeacher
}) {
  const [showPdf, setShowPdf] = useState(isTeacher || Boolean(pdfFile));
  
  const imgInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  return (
    <div className="bg-[#f6f8fa] border border-[#d1d9e6] rounded-3xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#d1d9e6]">
            <th className="py-4 px-6 text-sm font-bold text-[#143c7b]">Fayl turi</th>
            <th className="py-4 px-6 text-sm font-bold text-[#143c7b]">Fayl nomi</th>
            <th className="py-4 px-6 text-sm font-bold text-[#143c7b] text-center">Yuklash</th>
            <th className="py-4 px-6 text-sm font-bold text-[#143c7b] text-center">O'chirish</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {/* Image Row */}
          <tr className="border-b border-[#f2f4f7]">
            <td className="py-4 px-6 text-sm font-medium text-gray-700">Kitob rasmi</td>
            <td className="py-4 px-6 text-sm text-gray-500">
              {imageFile ? imageFile.name : 'Tanlanmagan'}
            </td>
            <td className="py-4 px-6 text-center">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={imgInputRef} 
                onChange={(e) => {
                  if (e.target.files[0]) setImageFile(e.target.files[0]);
                }} 
              />
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition min-w-[120px]"
              >
                {imageFile ? 'Almashtirish' : 'Tanlash'}
              </button>
            </td>
            <td className="py-4 px-6 text-center">
              {imageFile && (
                <button
                  type="button"
                  onClick={() => { setImageFile(null); if(imgInputRef.current) imgInputRef.current.value = ""; }}
                  className="bg-red-100 text-red-700 px-8 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                >
                  O'chirish
                </button>
              )}
            </td>
          </tr>

          {/* PDF Row */}
          {showPdf && (
            <tr className="border-b border-[#f2f4f7]">
              <td className="py-4 px-6 text-sm font-medium text-gray-700">
                PDF fayl {isTeacher ? "*" : ""}
              </td>
              <td className="py-4 px-6 text-sm text-gray-500">
                {pdfFile ? pdfFile.name : 'Tanlanmagan'}
              </td>
              <td className="py-4 px-6 text-center">
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  ref={pdfInputRef} 
                  onChange={(e) => {
                    if (e.target.files[0]) setPdfFile(e.target.files[0]);
                  }} 
                />
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition min-w-[120px]"
                >
                  {pdfFile ? 'Almashtirish' : 'Tanlash'}
                </button>
              </td>
              <td className="py-4 px-6 text-center">
                {pdfFile && (
                  <button
                    type="button"
                    onClick={() => { setPdfFile(null); if(pdfInputRef.current) pdfInputRef.current.value = ""; }}
                    className="bg-red-100 text-red-700 px-8 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                  >
                    O'chirish
                  </button>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {!showPdf && (
        <div className="p-6 bg-white flex justify-center border-t border-[#f2f4f7]">
          <button
            type="button"
            onClick={() => setShowPdf(true)}
            className="bg-[#1a73e8] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-md"
          >
            PDF fayl qo'shish
          </button>
        </div>
      )}
    </div>
  );
}
