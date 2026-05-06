import { useEffect, useState } from "react";
import { FaBrain, FaThLarge } from "react-icons/fa";
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
import LoadingScreen from "../components/LoadingScreen";

export default function HomePage() {
    const navigate = useNavigate();
    const [newArrivals, setNewArrivals] = useState([]);
    const [mostRead, setMostRead] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // To'g'ri joylashuv

        const loadHomePageData = async () => {
            try {
                setLoading(true);
                // Uchta so'rovni parallel ravishda jo'natish
                const [latestBooks, topBooks, cats] = await Promise.all([
                    fetchLatestBooks(),
                    fetchLatestBooks(6), // Agar buning alohida APIdan farqi bo'lsa, moslashtiring
                    fetchCategories()
                ]);

                if (isMounted) {
                    setNewArrivals(latestBooks || []);
                    setMostRead(topBooks || []);
                    setCategories(cats || []);
                }
            } catch (error) {
                console.error("Ma'lumotlarni yuklashda xatolik:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadHomePageData();

        return () => {
            isMounted = false; // Komponent o'chirilganda state yangilanishini to'xtatadi
        };
    }, []);

    // Ma'lumotlar yuklangunicha LoadingScreen ko'rsatamiz
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-[#1a478e] font-semibold">
             Ma'lumotlar yuklanmoqda...
        </div>; // Yoki LoadingScreen chaqiring
    }

    return (
        <div className="space-y-14 pb-16">
            {/* Yangi qo'shilganlar */}
            <section className="py-10">
                <div className="custom-container space-y-6">
                    <SectionHeader
                        title="Yangi qo'shilgan kitoblar"
                        action={() => navigate("/books")}
                        actionLabel="Barchasi"
                    />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {newArrivals.map(book => (
                            <NewArrivalCard key={book.id} book={book} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Kategoriyalar */}
            <section className="bg-[#f4f4f4] dark:bg-[#1a1a1a] py-10 transition-colors duration-300">
                <div className="custom-container space-y-6">
                    <h2 className="text-xl font-semibold text-[#1a478e] dark:text-blue-300">
                        Sizni nima qiziqtiradi?
                    </h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {categories.map(category => (
                            <CategoryCard
                                key={category.id}
                                icon={category.icon ? category.icon : "default"}
                                label={category?.name}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Eng ko'p o'qilganlar */}
            <section className="custom-container space-y-6">
                <SectionHeader 
                    title="Eng ko'p o'qilganlar" 
                    action={() => navigate("/top-books")}
                    actionLabel="Barchasi" 
                />
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