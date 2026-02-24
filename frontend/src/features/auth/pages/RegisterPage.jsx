import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Mail, Lock, User, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import useAuthStore from '@/store/useAuthStore';
import { jwtDecode } from 'jwt-decode';

export default function RegisterPage() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);

        try {
            const data = await authService.register(email, password, displayName);
            const userState = {
                email: data.email,
                displayName: data.displayName,
                avatarUrl: data.avatarUrl
            };

            // Auto-login using the token from registration
            login(userState, data.token, data.refreshToken);

            // Handle redirection based on role
            const decoded = jwtDecode(data.token);
            const role = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

            setSuccess('Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => {
                if (role === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 1500);
        } catch (err) {
            const data = err.response?.data;
            let errMsg = data?.message || data?.title || 'Đăng ký thất bại. Vui lòng thử lại.';
            if (data?.errors) {
                const valErrs = Object.values(data.errors).flat();
                if (valErrs.length > 0) errMsg = valErrs[0];
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[100dvh] flex items-center justify-center overflow-auto font-inter py-6 sm:py-12">
            {/* Cinematic Background */}
            <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://img.ophim.live/uploads/movies/biet-doi-bao-thu-thumb.jpg')" }}>
                <div className="absolute inset-0 bg-[#060814]/80 backdrop-blur-md"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#060814] via-[#060814]/40 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-[400px] px-4">
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 group mb-3">
                        <div className="bg-primary-yellow text-black p-1.5 rounded-full group-hover:scale-110 transition-transform">
                            <PlayCircle size={28} strokeWidth={2.5} />
                        </div>
                        <span className="font-heading font-bold text-2xl tracking-tight text-white">
                            Cine<span className="text-gray-400 font-light">Stream</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold font-heading text-white">Tạo tài khoản</h1>
                </div>

                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary-yellow/20 rounded-full blur-[80px]"></div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm px-4 py-3 rounded-xl">
                                {success}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Tên hiển thị</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Tên của bạn"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success !== ''}
                            className="w-full mt-2 bg-white text-black font-semibold py-3 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center text-sm"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Đăng Ký"}
                        </button>

                        <p className="text-center text-white/60 text-sm mt-4">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-primary-yellow hover:text-yellow-400 font-medium transition-colors">
                                Đăng nhập
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
