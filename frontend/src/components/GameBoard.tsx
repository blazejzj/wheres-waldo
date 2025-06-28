import React, { useRef, useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router";
import dinosaursWaldo from "../assets/dinosaursWaldo.jpeg";
import troyWaldo from "../assets/troyWaldo.jpeg";
import undergroundWaldo from "../assets/undergroundWaldo.jpeg";
import silentMovieWaldo from "../assets/silentmovieWaldo.jpeg";

const IMAGES = [
    { id: 1, name: "Dinosaurs and Waldo", image: dinosaursWaldo },
    { id: 2, name: "Troy and Waldo", image: troyWaldo },
    { id: 3, name: "Underground Waldo", image: undergroundWaldo },
    { id: 4, name: "Silentmovie Waldo", image: silentMovieWaldo },
];

const MAG_SIZE = 120;
const MAG_ZOOM = 2;
const LOCKED_PREVIEW_SIZE = 200;
const LOCKED_ZOOM = 3;

type LeaderboardEntry = {
    name: string;
    time: number;
};

export default function GameBoard() {
    const { gameId } = useParams<{ gameId: string }>();
    const { seconds } = useOutletContext<{ seconds: number }>(); // Make sure GameLayout provides this
    const game = IMAGES.find((img) => img.id === Number(gameId));
    const imgRef = useRef<HTMLImageElement>(null);

    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
        null
    );
    const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
        null
    );
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const [locked, setLocked] = useState(false);

    const [showWrongPopup, setShowWrongPopup] = useState(false);
    const [showNamePopup, setShowNamePopup] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const updateSize = () => {
            if (!imgRef.current) return;
            const { width, height } = imgRef.current.getBoundingClientRect();
            setImgSize({ width, height });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [game?.image]);

    if (!game) return <div>Game not found...</div>;

    const onMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        if (targetPos) return;
        const rect = imgRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            setMousePos(null);
        } else {
            setMousePos({ x, y });
        }
    };

    const onMouseLeave = () => {
        if (!targetPos) setMousePos(null);
    };

    const onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const rect = imgRef.current!.getBoundingClientRect();
        if (targetPos) {
            setTargetPos(null);
            setLocked(false);
            return;
        }
        setTargetPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const onClickAway = (e: React.MouseEvent<HTMLDivElement>) => {
        if (imgRef.current && !imgRef.current.contains(e.target as Node)) {
            setTargetPos(null);
            setLocked(false);
            setMousePos(null);
        }
    };

    const onConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setLocked(true);

        if (!targetPos) return;
        const normX = targetPos.x / imgSize.width;
        const normY = targetPos.y / imgSize.height;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/check`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        imageId: game.id,
                        x: normX,
                        y: normY,
                    }),
                }
            );
            const data = await response.json();

            if (data.correct) {
                setShowNamePopup(true);
            } else {
                setShowWrongPopup(true);
                setTimeout(() => setShowWrongPopup(false), 1800);
                setLocked(false);
            }
        } catch (err) {
            setShowWrongPopup(true);
            setTimeout(() => setShowWrongPopup(false), 1800);
            setLocked(false);
        }
    };

    const handleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${import.meta.env.VITE_API_URL}/api/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: playerName,
                time: seconds,
                imageId: game.id,
            }),
        });
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/leaderboard?imageId=${game.id}`
        );
        const data = await res.json();
        setLeaderboard(data.scores);
        setShowNamePopup(false);
        setShowLeaderboard(true);
    };

    let previewLeft = targetPos ? targetPos.x + 20 : 0;
    let previewTop = targetPos ? targetPos.y - LOCKED_PREVIEW_SIZE / 2 : 0;
    if (targetPos) {
        if (previewLeft + LOCKED_PREVIEW_SIZE > imgSize.width) {
            previewLeft = targetPos.x - LOCKED_PREVIEW_SIZE - 20;
        }
        if (previewLeft < 0) previewLeft = 0;
        if (previewTop < 0) previewTop = 0;
        if (previewTop + LOCKED_PREVIEW_SIZE > imgSize.height) {
            previewTop = imgSize.height - LOCKED_PREVIEW_SIZE;
        }
    }

    const magnifierStyle = mousePos
        ? {
              position: "absolute" as const,
              left: mousePos.x - MAG_SIZE / 2,
              top: mousePos.y - MAG_SIZE / 2,
              width: MAG_SIZE,
              height: MAG_SIZE,
              borderRadius: "50%",
              border: "2px solid #38bdf8",
              boxShadow: "0 0 8px rgba(0,0,0,0.25)",
              pointerEvents: "none" as const,
              zIndex: 20,
              backgroundImage: `url(${game.image})`,
              backgroundRepeat: "no-repeat" as const,
              backgroundSize: `${imgSize.width * MAG_ZOOM}px ${
                  imgSize.height * MAG_ZOOM
              }px`,
              backgroundPosition: `${-(
                  mousePos.x * MAG_ZOOM -
                  MAG_SIZE / 2
              )}px ${-(mousePos.y * MAG_ZOOM - MAG_SIZE / 2)}px`,
          }
        : {};

    return (
        <div
            className="relative w-fit h-fit"
            style={{ minWidth: 900, minHeight: 600 }}
            onClick={onClickAway}
        >
            <img
                ref={imgRef}
                src={game.image}
                alt={game.name}
                className="block max-w-full"
                style={{ cursor: targetPos ? "default" : "crosshair" }}
                onLoad={() => {
                    const rect = imgRef.current!.getBoundingClientRect();
                    setImgSize({ width: rect.width, height: rect.height });
                }}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onClick={onImageClick}
                draggable={false}
            />
            {mousePos && !targetPos && <div style={magnifierStyle} />}
            {targetPos && (
                <div
                    className="absolute z-30 flex flex-col items-center p-3 bg-white rounded-lg shadow-lg"
                    style={{
                        left: previewLeft,
                        top: previewTop,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="overflow-hidden rounded-md"
                        style={{
                            width: LOCKED_PREVIEW_SIZE,
                            height: LOCKED_PREVIEW_SIZE,
                            backgroundImage: `url(${game.image})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: `${imgSize.width * LOCKED_ZOOM}px ${
                                imgSize.height * LOCKED_ZOOM
                            }px`,
                            backgroundPosition: `${-(
                                targetPos.x * LOCKED_ZOOM -
                                LOCKED_PREVIEW_SIZE / 2
                            )}px ${-(
                                targetPos.y * LOCKED_ZOOM -
                                LOCKED_PREVIEW_SIZE / 2
                            )}px`,
                        }}
                    />
                    <h3 className="mt-2 text-xl font-bold">
                        {locked ? "You've made your choice!" : "Are you sure?"}
                    </h3>
                    {!locked && (
                        <button
                            onClick={onConfirm}
                            className="mt-2 bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition"
                        >
                            Confirm
                        </button>
                    )}
                </div>
            )}

            {showWrongPopup && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded z-50">
                    Not quite! Waldo is sneakier than you may think.
                </div>
            )}

            {showNamePopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleNameSubmit}
                        className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-3xl font-bold luckyguy">
                            You found Waldo!
                        </h2>
                        <p className="luckyguy text-xl">
                            Enter your name for the leaderboard:
                        </p>
                        <input
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="border px-2 py-1 rounded"
                            required
                            maxLength={20}
                        />
                        <button
                            type="submit"
                            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-bold text-xl hover:cursor-pointer"
                        >
                            Submit Your Score
                        </button>
                    </form>
                </div>
            )}

            {showLeaderboard && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
                        <h2 className="text-3xl font-bold mb-4 uppercase luckyguy">
                            Leaderboard
                        </h2>
                        <table>
                            <thead>
                                <tr>
                                    <th className="px-4">Name</th>
                                    <th className="px-4">Time (s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((score, i) => (
                                    <tr key={i}>
                                        <td className="px-4">{score.name}</td>
                                        <td className="px-4">
                                            {score.time.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-bold text-xl hover:cursor-pointer mt-3"
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
