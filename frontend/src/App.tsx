import homeBg from "./assets/homeBg.jpg";
import { Outlet } from "react-router";
import "../index.css";

function App() {
    return (
        <div
            className="min-h-screen min-w-full bg-cover bg-center flex flex-col"
            style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${homeBg})`,
            }}
        >
            <header className="py-8 flex justify-center items-center">
                <h1 className="text-7xl uppercase luckyguy">
                    Where's Waldo{" "}
                    <span className="text-2xl text-gray-700">by blazejzj</span>
                </h1>
            </header>
            <main className="flex-1 flex justify-center items-start">
                <Outlet />
            </main>
        </div>
    );
}
export default App;
