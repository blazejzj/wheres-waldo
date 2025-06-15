import homeBg from "./assets/homeBg.jpg";
import "../index.css";

function App() {
    return (
        <div
            className="gap-5 w-full h-full bg-cover bg-center flex justify-center items-center flex-col"
            style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${homeBg})`,
            }}
        >
            <h1 className="text-7xl uppercase luckyguy">
                Where's Waldo{" "}
                <span className="text-2xl text-gray-700">by blazejzj</span>
            </h1>
            <div className="w-[30rem] h-[300px] bg-white rounded-md flex flex-col items-center">
                <h1>Choose any image to start!</h1>
                <div>
                    <li>Hello</li>
                    <li>Hello2</li>
                    <li>Hello3</li>
                </div>
            </div>
        </div>
    );
}

export default App;
