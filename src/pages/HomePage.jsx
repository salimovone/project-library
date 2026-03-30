import {useEffect, useState} from "react";
import {FaBrain, FaThLarge} from "react-icons/fa";
import {
	CategoryCard,
	MostReadCard,
	NewArrivalCard,
	SectionHeader,
	StatsBar,
} from "../components";
import { fetchLatestBooks } from "../services/bookService";
import { fetchCategories } from "../services/additional";
import { useNavigate } from "react-router";

/**
 * HomePage Component
 * Responsibility: Compose the home page layout
 */
export default function HomePage() {
	const navigate = useNavigate()
	const [newArrivals, setNewArrivals] = useState([])
	const [mostRead, setMostRead] = useState([])
	const [categories, setCategories] = useState([])

	let isMounted = false;
	useEffect(() => {
		if(isMounted) return;

		fetchLatestBooks().then(setNewArrivals)
		fetchLatestBooks(6).then(setMostRead)
		fetchCategories().then(setCategories)

		return () => {
			isMounted = true;
		};
	}, []);

	return (
		<div className="space-y-14 pb-16">
			<section className="bg-[#f4f4f4] py-10">
				<div className="custom-container space-y-6">
					<SectionHeader
						title="Yangi qo'shilgan kitoblar"
						action={()=>navigate("/books")}
						actionLabel="Barchasi"
					/>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{newArrivals.map(book => (
							<NewArrivalCard key={book.id} book={book} />
						))}
					</div>
				</div>
			</section>

			<section className="custom-container space-y-6">
				<h2 className="text-xl font-semibold text-[#1a478e]">
					Sizni nima qiziqtiradi?
				</h2>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
					{categories.map((category) => (
						<CategoryCard
							key={category.id}
							// icon={<FaBrain className="text-2xl text-[#1a478e]"/>}
							icon={category.icon ? category.icon : "default"}
							label={category?.name}
						/>
					))}
					{/* <CategoryCard
						icon={<FaThLarge className="text-2xl text-[#1a478e]"/>}
						label={"Barchasi"}
					/> */}
				</div>
			</section>

			<section className="custom-container space-y-6">
				<SectionHeader title="Eng ko'p o'qilganlar" actionLabel="Barchasi" />
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{mostRead.map(book => (
						<MostReadCard key={book.id} book={book} />
					))}
				</div>
			</section>

			<StatsBar />
		</div>
	);
}
