import { useState } from "react";
import { formatDateReadable } from "../../utils/helper.js";
import Modal from "../Modal";
import useAuth from "../../hooks/useAuth.jsx";

export function ProfileHeader({ user }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { logout } = useAuth();


	const handleLogout = () => {
        logout();
		setIsModalOpen(false);
	};

	return (
		<>
			<div className="rounded-2xl bg-white dark:bg-[#1e1e1e] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors duration-300">
				<div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
					<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#e02424] text-3xl text-[#143c7b] dark:text-blue-300 bg-white dark:bg-[#252525] shrink-0 transition-colors">
						{user.first_name ? user.first_name[0].toUpperCase() : "K"}
					</div>
					<div className="text-center sm:text-left pt-2">
						<h1 className="text-2xl font-semibold text-[#143c7b] dark:text-white leading-tight transition-colors">
							{user.first_name ? user.first_name : "Kitobxon"} {user.last_name}
						</h1>
						<div className="mt-1 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-[15px]">
							<span className="text-gray-500 dark:text-gray-400 transition-colors">
								{formatDateReadable(user.last_login)}
							</span>
						</div>
					</div>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className="border-2 border-red-500 bg-red-400 text-white rounded-md px-4 py-2 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
				>
					Log Out
				</button>
			</div>
			<Modal
				isOpen={isModalOpen}
				title="Confirm Logout"
			>
				<p className="text-indigo-900 dark:text-indigo-300 transition-colors">Are you sure you want to log out?</p>
				<div className="flex justify-end gap-4 mt-6">
					<button
						onClick={() => setIsModalOpen(false)}
						className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg transition-colors"
						>
						Cancel
					</button>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg transition-colors"
					>
						Confirm
					</button>
				</div>
			</Modal>
		</>
	);
}
