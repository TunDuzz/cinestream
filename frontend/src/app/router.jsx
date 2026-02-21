import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { HomePage, WatchPage, SearchPage } from '@/features/movies';
import { LoginPage, RegisterPage } from '@/features/auth';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Auth Routes (No Navbar/Footer) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Main App Routes */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/watch/:id" element={<WatchPage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
