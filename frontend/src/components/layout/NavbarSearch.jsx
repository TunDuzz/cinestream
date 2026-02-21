import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavbarSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Parse the query parameter on load so the search bar shows what we searched for
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('q');
        if (query) {
            setSearchTerm(query);
        } else if (location.pathname !== '/search') {
            // Only clear search term if we are not on the search page itself
            setSearchTerm('');
        }
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            inputRef.current?.blur();
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        inputRef.current?.focus();
    };

    return (
        <form
            onSubmit={handleSearch}
            className={`relative hidden md:flex items-center transition-all duration-300 w-40 md:w-48 lg:w-56 xl:w-64 shrink-0 rounded-full ${isFocused
                ? 'shadow-[0_0_15px_rgba(234,179,8,0.15)] ring-1 ring-primary-yellow/30 bg-black/60'
                : 'bg-white/5 hover:bg-white/10'
                }`}
        >
            <Search
                className={`absolute left-3 z-10 transition-colors ${isFocused ? 'text-primary-yellow' : 'text-gray-400'}`}
                size={18}
            />

            <input
                ref={inputRef}
                type="text"
                placeholder="Tìm kiếm phim, diễn viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border border-white/10 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-primary-yellow/50 transition-all text-white placeholder-gray-500"
            />

            {/* Clear Button */}
            {searchTerm && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 text-gray-400 hover:text-primary-yellow transition-colors p-1"
                >
                    <X size={14} />
                </button>
            )}
        </form>
    );
}
