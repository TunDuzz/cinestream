import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isAdmin: (() => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            console.log('Stored Token Decoded:', decoded);
            const role = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            return role === 'Admin';
        } catch (e) {
            console.error('Token Decode Error:', e);
            return false;
        }
    })(),

    login: (userData, token, refreshToken) => {
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));

        const decoded = jwtDecode(token);
        const role = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const isAdmin = role === 'Admin';
        console.log('Login Info:', { decoded, role, isAdmin });

        set({ user: userData, token, refreshToken, isAuthenticated: true, isAdmin });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isAdmin: false });
    },
}));

export default useAuthStore;
