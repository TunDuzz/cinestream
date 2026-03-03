import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavbarSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Parse searching query
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('q');
        if (query) {
            setSearchTerm(query);
        } else if (location.pathname !== '/search') {
            setSearchTerm('');
        }
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            inputRef.current?.blur();
            if (window.innerWidth < 768) setIsMobileExpanded(false);
        }
    };

    return (
        <>
            {/* Desktop and Unexpanded Mobile State */}
            <form
                onSubmit={handleSearch}
                className={`
                    flex items-center rounded-full overflow-hidden h-[44px]
                    w-[44px] md:w-56 xl:w-72 bg-transparent md:bg-white/5 transition-colors
                    ${isMobileExpanded ? 'invisible md:visible' : 'relative hover:bg-white/10 md:hover:bg-white/10'}
                    ${isFocused && !isMobileExpanded ? 'md:ring-1 md:ring-primary-yellow/40 md:bg-black/80' : ''}
                `}
            >
                {/* Search Button (Triggers expand on mobile) */}
                <button
                    type="button"
                    tabIndex={0}
                    onClick={() => {
                        if (window.innerWidth < 768) {
                            if (!isMobileExpanded) {
                                setIsMobileExpanded(true);
                                setTimeout(() => {
                                    if (inputRef.current) inputRef.current.focus();
                                }, 10);
                            }
                        } else {
                            handleSearch(new Event('submit'));
                        }
                    }}
                    className="absolute left-0 z-10 w-[44px] h-[44px] flex items-center justify-center focus:outline-none rounded-full text-gray-400 md:hover:text-white"
                >
                    <Search size={18} />
                </button>

                {/* Input (Desktop only visible, hidden/opacity-0 on mobile) */}
                <input
                    type="text"
                    placeholder="Tìm kiếm phim, diễn viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="w-full h-full bg-transparent border-none focus:outline-none text-[15px] md:text-sm font-medium text-white placeholder-gray-500 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto pl-[44px] pr-10"
                />

                {/* Clear Button (Desktop only) */}
                {searchTerm && isFocused && (
                    <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="hidden md:flex absolute right-1 text-gray-400 hover:text-primary-yellow p-1 min-h-[44px] items-center justify-center rounded-full"
                    >
                        <X size={14} />
                    </button>
                )}
            </form>

            {/* Mobile Expanded Overlay - Perfect match layout without animations */}
            {isMobileExpanded && (
                <div className="absolute inset-0 z-[70] bg-[#0a0a0c] rounded-full flex items-center px-4 md:hidden">
                    <form onSubmit={handleSearch} className="flex-1 h-[36px] bg-[#1a1c22] border border-white/5 rounded-[12px] flex items-center px-3 mr-1">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Tìm kiếm phim, diễn viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-full bg-transparent border-none text-[14px] font-medium text-white placeholder-gray-500 focus:outline-none"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="text-gray-400 p-1.5 focus:outline-none"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </form>

                    {/* X Button replacing original Search icon precisely */}
                    <button
                        type="button"
                        onClick={() => setIsMobileExpanded(false)}
                        className="w-[44px] h-[44px] flex items-center justify-center shrink-0 text-[#ef4444]"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>
            )}
        </>
    );
}
