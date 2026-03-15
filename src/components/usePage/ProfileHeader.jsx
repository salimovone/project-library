import { useState } from "react";
import { formatDateReadable } from "../../utils/helper.js";
import Modal from "../Modal";
import useAuth from "../../hooks/useAuth.jsx";

export function ProfileHeader({ user }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { logout } = useAuth();


	const handleLogout = () => {
        logout();
		console.log("Logging out...");
		setIsModalOpen(false);
	};

	return (
		<>
			<div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex justify-between items-center">
				<div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
					<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#e02424] text-3xl text-[#143c7b] bg-white shrink-0">
						{user.first_name ? user.first_name[0].toUpperCase() : "K"}
					</div>
					<div className="text-center sm:text-left pt-2">
						<h1 className="text-2xl font-semibold text-[#143c7b] leading-tight">
							{user.first_name ? user.first_name : "Kitobxon"} {user.last_name}
						</h1>
						<div className="mt-1 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-[15px]">
							<span className="text-gray-500">
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
				<p className="text-indigo-900">Are you sure you want to log out?</p>
				<div className="flex justify-end gap-4 mt-6">
					<button
						onClick={() => setIsModalOpen(false)}
						className="px-4 py-2 bg-gray-200 rounded-lg"
						>
						Cancel
					</button>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-500 text-white rounded-lg"
					>
						Confirm
					</button>
				</div>
			</Modal>
		</>
	);
}
