export default function CheckboxGroup({ name, label, value, onChange }) {
  const handleCheckboxChange = (e) => {
    const { name: checkboxName, checked } = e.target;
    onChange({
      target: {
        name,
        value: {
          ...value,
          [checkboxName]: checked,
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#143c7b]">{label}</label>
      <div className="flex flex-col gap-2 mt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_physical"
            checked={value.is_physical}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Fizikal</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_audio"
            checked={value.is_audio}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Audiokitob</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_pdf"
            checked={value.is_pdf}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">PDF</span>
        </label>
      </div>
    </div>
  );
}
