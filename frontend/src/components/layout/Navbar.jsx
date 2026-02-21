import { Link, useNavigate } from 'react-router-dom';
import { User, PlayCircle, Bell, LogOut, ChevronDown } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import NavbarSearch from './NavbarSearch';
import { movieService } from '@/features/movies/services/movieService';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [showGenreMenu, setShowGenreMenu] = useState(false);
    const [showCountryMenu, setShowCountryMenu] = useState(false);
    const [showListMenu, setShowListMenu] = useState(false);
    const navigate = useNavigate();

    const LIST_TYPES = [
        { name: 'Phim Mới', slug: 'phim-moi' },
        { name: 'Phim Bộ', slug: 'phim-bo' },
        { name: 'Phim Lẻ', slug: 'phim-le' },
        { name: 'Shows', slug: 'tv-shows' },
        { name: 'Hoạt Hình', slug: 'hoat-hinh' },
        { name: 'Phim Vietsub', slug: 'phim-vietsub' },
        { name: 'Phim Thuyết Minh', slug: 'phim-thuyet-minh' },
        { name: 'Phim Lồng Tiếng', slug: 'phim-long-tieng' },
        { name: 'Phim Bộ Đang Chiếu', slug: 'phim-bo-dang-chieu' },
        { name: 'Phim Bộ Đã Hoàn Thành', slug: 'phim-bo-hoan-thanh' },
        { name: 'Phim Sắp Chiếu', slug: 'phim-sap-chieu' },
        { name: 'Phim Chiếu Rạp', slug: 'phim-chieu-rap' }
    ];

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catRes, countRes] = await Promise.all([
                    movieService.getCategories(),
                    movieService.getCountries()
                ]);
                if (catRes?.status && catRes?.data?.items) {
                    setCategories(catRes.data.items);
                }
                if (countRes?.status && countRes?.data?.items) {
                    setCountries(countRes.data.items);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu filter:", error);
            }
        };
        fetchFilters();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto bg-[#0a0a0a]/70 backdrop-blur-2xl border border-white/10 rounded-full px-4 md:px-6 py-3 flex items-center justify-between gap-1 lg:gap-4 xl:gap-6 shadow-2xl shadow-black/60">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary-yellow text-black p-1.5 rounded-full group-hover:scale-110 transition-transform">
                        <PlayCircle size={24} strokeWidth={2.5} />
                    </div>
                    <span className="font-heading font-bold text-2xl tracking-tight text-white">
                        Cine<span className="text-gray-400 font-light">Stream</span>
                    </span>
                </Link>

                {/* Center Links (Hidden on small screens) */}
                <div className="hidden lg:flex items-center gap-3 lg:gap-5 xl:gap-8 font-medium text-sm text-gray-300 whitespace-nowrap shrink-0">
                    <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
                    <div
                        className="relative"
                        onMouseEnter={() => setShowGenreMenu(true)}
                        onMouseLeave={() => setShowGenreMenu(false)}
                    >
                        <span className={`hover:text-white transition-colors flex items-center gap-1 cursor-pointer py-2 ${showGenreMenu ? 'text-white' : ''}`}>
                            Thể loại <ChevronDown size={14} className={`transition-transform duration-300 ${showGenreMenu ? 'rotate-180' : ''}`} />
                        </span>

                        {/* Genre Dropdown */}
                        {showGenreMenu && categories.length > 0 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[540px] z-50">
                                <div className="bg-[#0f1015]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 grid grid-cols-3 gap-1">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            to={`/search?genre=${cat.slug}`}
                                            className="px-3 py-2 rounded-xl text-[13px] text-gray-400 hover:text-primary-yellow hover:bg-white/5 transition-all"
                                            onClick={() => setShowGenreMenu(false)}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={() => setShowCountryMenu(true)}
                        onMouseLeave={() => setShowCountryMenu(false)}
                    >
                        <span className={`hover:text-white transition-colors flex items-center gap-1 cursor-pointer py-2 ${showCountryMenu ? 'text-white' : ''}`}>
                            Quốc gia <ChevronDown size={14} className={`transition-transform duration-300 ${showCountryMenu ? 'rotate-180' : ''}`} />
                        </span>

                        {/* Country Dropdown */}
                        {showCountryMenu && countries.length > 0 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[540px] z-50">
                                <div className="bg-[#0f1015]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 grid grid-cols-3 gap-1">
                                    {countries.map((country) => (
                                        <Link
                                            key={country.slug}
                                            to={`/search?country=${country.slug}`}
                                            className="px-3 py-2 rounded-xl text-[13px] text-gray-400 hover:text-primary-yellow hover:bg-white/5 transition-all"
                                            onClick={() => setShowCountryMenu(false)}
                                        >
                                            {country.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={() => setShowListMenu(true)}
                        onMouseLeave={() => setShowListMenu(false)}
                    >
                        <span className={`hover:text-white transition-colors flex items-center gap-1 cursor-pointer py-2 ${showListMenu ? 'text-white' : ''}`}>
                            Danh sách <ChevronDown size={14} className={`transition-transform duration-300 ${showListMenu ? 'rotate-180' : ''}`} />
                        </span>

                        {/* Types List Dropdown */}
                        {showListMenu && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[600px] z-50">
                                <div className="bg-[#0f1015]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-5 grid grid-cols-3 gap-y-3 gap-x-1">
                                    {LIST_TYPES.map((type) => (
                                        <Link
                                            key={type.slug}
                                            to={`/search?type=${type.slug}`}
                                            className="px-3 py-1.5 rounded-xl text-[14px] text-gray-300 hover:text-primary-yellow hover:bg-white/5 transition-all font-medium"
                                            onClick={() => setShowListMenu(false)}
                                        >
                                            {type.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/top" className="hover:text-white transition-colors flex items-center gap-2">
                        Top Thịnh Hành
                        <span className="bg-primary-yellow text-black text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Hot</span>
                    </Link>
                </div>

                {/* Right Section: Search & Profile */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <NavbarSearch />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3 md:gap-5">
                            {/* Notification Bell */}
                            <button className="text-gray-300 hover:text-white transition-colors relative">
                                <Bell size={22} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-primary-yellow rounded-full"></span>
                            </button>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/5 px-4 py-2 rounded-full transition-colors text-sm font-medium"
                                >
                                    <div className="w-6 h-6 rounded-full bg-primary-yellow/20 flex items-center justify-center overflow-hidden">
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={14} className="text-primary-yellow" />
                                        )}
                                    </div>
                                    <span className="hidden sm:inline text-white max-w-[100px] truncate">{user?.displayName || 'Thành viên'}</span>
                                    <ChevronDown size={14} className="text-white/60" />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[#0f1015]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl py-2 z-50">
                                        <div className="px-4 py-2 border-b border-white/5 mb-2">
                                            <p className="text-sm text-white font-medium truncate">{user?.displayName}</p>
                                            <p className="text-xs text-white/50 truncate">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
                            <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="bg-primary-yellow text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </nav >
    );
}
