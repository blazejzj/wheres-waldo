import { useNavigate } from "react-router";
import dinosaursWaldo from "../assets/dinosaursWaldo.jpeg";
import troyWaldo from "../assets/troyWaldo.jpeg";
import undergroundWaldo from "../assets/undergroundWaldo.jpeg";
import silentMovieWaldo from "../assets/silentmovieWaldo.jpeg";
import { useEffect, useState } from "react";

const IMAGES = [
    {
        id: 1,
        name: "Dinosaurs and Waldo",
        image: dinosaursWaldo,
        characters: ["Waldo"],
    },
    {
        id: 2,
        name: "Troy and Waldo",
        image: troyWaldo,
        characters: ["Waldo"],
    },
    {
        id: 3,
        name: "Underground Waldo",
        image: undergroundWaldo,
        characters: ["Waldo"],
    },
    {
        id: 4,
        name: "Silentmovie Waldo",
        image: silentMovieWaldo,
        characters: ["Waldo"],
    },
];

function Home() {
    const navigate = useNavigate();
    const [bestTimes, setBestTimes] = useState<
        { imageId: number; name: string | null; time: number | null }[]
    >([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTimes() {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/besttimes`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                const data = await response.json();
                setFetchError(data);
            } else {
                const data = await response.json();
                setBestTimes(data.bestTimes);
            }
        }
        fetchTimes();
    });

    function getBestForImage(id: number) {
        const entry = bestTimes.find((e) => e.imageId === id);
        if (!entry || entry.time === null) return "No record yet";
        return `${entry.name || "???"} – ${entry.time.toFixed(2)}s`;
    }

    return (
        <div className="flex flex-col items-center gap-10">
            <h1 className="text-5xl mt-10 mb-4 uppercase luckyguy">
                Pick Your Image!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {IMAGES.map((img) => (
                    <button
                        key={img.id}
                        className="flex flex-col items-center bg-gray-50 border-1 border-gray-400 rounded-xl shadow-md hover:shadow-xl transition p-4 hover:cursor-pointer"
                        onClick={() => navigate(`/game/${img.id}`)}
                    >
                        <img
                            src={img.image}
                            alt={img.name}
                            className="w-44 h-44 object-cover rounded-lg mb-2"
                        />
                        <span className="text-lg font-bold uppercase luckyguy">
                            {img.name}
                        </span>
                        {fetchError ? (
                            <span>Error!</span>
                        ) : (
                            <span className="font-bold uppercase luckyguy text-sm mt-2">
                                Best time: {getBestForImage(img.id)}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Home;
