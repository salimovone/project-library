import React from "react";
import {BookCard} from "../components";
import coverImage from "../assets/cover-image.jpg";

export default function HomePage() {
	return (
		<div className="space-y-8">
			<section className="w-full bg-[#f4f4f4] py-16">
                <div className="flex justify-between items-center mb-8 px-4 custom-container">
                    <h2 className="text-2xl font-bold text-[#1a478e]">Yangi qo'shilgan kitoblar</h2>
                    <button className="text-blue-600 hover:underline">Hammasini ko'rish</button>
                </div>
				<div className="custom-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center ">
					{Array(8)
						.fill()
						.map((_, index) => (
							<div key={index} className="w-full flex justify-center">
								<BookCard
									coverImage={coverImage}
									author={"Abdulla Qahhor"}
									rating={4.7}
									title="Asror Bobo"
								/>
							</div>
						))}
				</div>
			</section>
		</div>
	);
}
