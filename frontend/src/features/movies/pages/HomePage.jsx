import { useState, useEffect } from 'react';
import HeroSection from '@/features/movies/components/HeroSection';
import MovieSlider from '@/features/movies/components/MovieSlider';
import { movieService } from '@/features/movies/services/movieService';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, Flame, Star, PlayCircle, Library, Heart } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function HomePage() {
    const [latestMovies, setLatestMovies] = useState([]);
    const [heroMovies, setHeroMovies] = useState([]);
    const [phimLe, setPhimLe] = useState([]);
    const [phimBo, setPhimBo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                // Execute parallel requests for performance
                const [latestRes, phimLeRes, phimBoRes] = await Promise.all([
                    movieService.getLatestMovies(1),
                    movieService.getMoviesByType('phim-le', 1),
                    movieService.getMoviesByType('phim-bo', 1)
                ]);

                if (latestRes.status) {
                    const basicMovies = latestRes.items || [];
                    setLatestMovies(basicMovies);

                    // Fetch rich details for the top 5 hero banner movies
                    const top5Slugs = basicMovies.slice(0, 5).map(m => m.slug);
                    const heroDetailsPromises = top5Slugs.map(slug => movieService.getMovieDetail(slug));
                    const heroDetailsRes = await Promise.all(heroDetailsPromises);

                    const richHeroMovies = heroDetailsRes
                        .filter(res => res.status && res.movie)
                        .map(res => res.movie);

                    setHeroMovies(richHeroMovies.length > 0 ? richHeroMovies : basicMovies.slice(0, 5));
                }
                if (phimLeRes.status) setPhimLe(phimLeRes.data?.items || []);
                if (phimBoRes.status) setPhimBo(phimBoRes.data?.items || []);
            } catch (error) {
                console.error("Failed to fetch home page data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const categories = [
        { name: 'Viễn Tưởng', color: 'from-orange-600 to-red-600', icon: Sparkles },
        { name: 'Thái Lan', color: 'from-blue-600 to-indigo-600', icon: Compass },
        { name: 'Hành Động', color: 'from-emerald-600 to-teal-600', icon: Flame },
        { name: 'Chiếu Rạp', color: 'from-purple-600 to-pink-600', icon: Star },
        { name: 'Kinh Dị', color: 'from-amber-600 to-orange-600', icon: PlayCircle },
        { name: 'Cổ Trang', color: 'from-rose-600 to-pink-600', icon: Library },
        { name: 'Tâm Lý', color: 'from-cyan-600 to-blue-600', icon: Heart },
        { name: 'Hài Hước', color: 'from-fuchsia-600 to-purple-600', icon: Sparkles }
    ];

    if (loading) {
        return (
            <div className="w-full flex-1 min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="relative flex flex-col items-center">
                    {/* Modern Spinner - Minimalist */}
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 border-[3px] border-white/5 rounded-full"></div>
                        <div className="absolute inset-0 border-[3px] border-primary-yellow rounded-full border-t-transparent animate-spin"></div>
                    </div>

                    <h2 className="mt-8 text-white/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                        CINESTREAM
                    </h2>
                </div>
            </div>
        );
    }


    return (
        <div className="w-full flex-1 bg-dark-bg animate-in fade-in duration-1000">
            <HeroSection movies={heroMovies} />

            <div className="w-full max-w-[1800px] flex flex-col mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-20 relative z-20">
                {/* Category Selection Row */}
                <div className="mb-12 pt-6">
                    <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 text-white ml-2 flex items-center gap-2">
                        <Flame className="text-primary-yellow" size={24} />
                        Khám phá Chủ Đề Thịnh Hành
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon;
                            return (
                                <Link
                                    key={idx}
                                    to="/explore"
                                    className={`relative w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer transition-transform hover:-translate-y-2`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                                        <h3 className="font-heading font-bold text-white text-lg md:text-xl drop-shadow-md">{cat.name}</h3>
                                        <div className="text-white/60 text-xs mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                                            Xem chủ đề <span>&rarr;</span>
                                        </div>
                                    </div>
                                    {Icon && <Icon className="absolute top-4 right-4 text-white/20 group-hover:text-white/40 group-hover:scale-110 transition-all" size={40} strokeWidth={1} />}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Unified Movie Sliders Container */}
                <div className="flex flex-col gap-0 bg-[#0f1015]/90 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 lg:p-8 shadow-2xl overflow-hidden relative">
                    {/* Background glowing effects for the container */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-yellow/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <MovieSlider title="Phim Mới Cập Nhật" movies={latestMovies} isLoading={loading} />

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

                    <MovieSlider title="Phim Lẻ Nổi Bật" movies={phimLe} isLoading={loading} />

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

                    <MovieSlider title="Phim Bộ Đặc Sắc" movies={phimBo} isLoading={loading} />
                </div>
            </div>
        </div>
    );
}
