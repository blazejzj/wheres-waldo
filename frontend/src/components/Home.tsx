import { useNavigate } from "react-router";
import dinosaursWaldo from "../assets/dinosaursWaldo.jpeg";
import troyWaldo from "../assets/troyWaldo.jpeg";
import undergroundWaldo from "../assets/undergroundWaldo.jpeg";
import silentMovieWaldo from "../assets/silentmovieWaldo.jpeg";

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

    return (
        <div className="flex flex-col items-center gap-10">
            <h1 className="text-5xl mt-10 mb-4">
                Where's Waldo? Pick Your Image!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {IMAGES.map((img) => (
                    <button
                        key={img.id}
                        className="flex flex-col items-center bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
                        onClick={() => navigate(`/game/${img.id}`)}
                    >
                        <img
                            src={img.image}
                            alt={img.name}
                            className="w-44 h-44 object-cover rounded-lg mb-2"
                        />
                        <span className="text-lg font-bold">{img.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Home;
