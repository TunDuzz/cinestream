import React from 'react';

const LoadingSpinner = ({ label = "CINESTREAM" }) => {
    return (
        <div className="w-full flex-1 min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative flex flex-col items-center">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-yellow/5 rounded-full blur-[80px] animate-pulse"></div>

                {/* Modern Spinner - Minimalist */}
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 border-[3px] border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-[3px] border-primary-yellow rounded-full border-t-transparent animate-spin"></div>
                </div>

                <h2 className="mt-8 text-white/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                    {label}
                </h2>
            </div>
        </div>
    );
};

export default LoadingSpinner;
