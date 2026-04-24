import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, onConfirm, title, children }) {
	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 h-full w-full bg-[#0009] backdrop-blur-sm flex items-center justify-center z-9999">
			<div className="bg-white dark:bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md shadow-2xl relative z-10 transition-colors duration-300">
				<h2 className="text-xl font-semibold mb-4 text-[#003366] dark:text-blue-300 transition-colors">{title}</h2>
				<div>{children}</div>
			</div>
		</div>,
		document.body
	);
}
