import { Outlet, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

export default function GameLayout() {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(0);
    const timer = useRef<number | null>(null);

    useEffect(() => {
        timer.current = window.setInterval(
            () => setSeconds((s) => s + 1),
            1000
        );
        return () => {
            if (timer.current !== null) clearInterval(timer.current);
        };
    }, []);

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" />

            <div className="absolute inset-0 bg-gray-100" />

            <nav className="relative z-10 bg-gray-300 shadow-md">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                    >
                        Go Back
                    </button>

                    <div className="text-gray-700 text-lg font-bold">
                        Time: <span className="font-extrabold">{seconds}s</span>
                    </div>

                    <div className="w-6" />
                </div>
            </nav>
            <main className="relative z-10 flex-1 flex items-center justify-center p-6">
                <Outlet />
            </main>
        </div>
    );
}
