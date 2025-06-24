import App from "../App";
import Home from "./Home";
import GameLayout from "./GameLayout";
import GameBoard from "./GameBoard";

const routes = [
    {
        path: "/",
        element: <App />,
        children: [{ index: true, element: <Home /> }],
    },
    {
        path: "/game/:gameId",
        element: <GameLayout />,
        children: [{ index: true, element: <GameBoard /> }],
    },
];

export default routes;
