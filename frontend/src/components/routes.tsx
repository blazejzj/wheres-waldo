import App from "../App";
import Home from "./Home";
import GameBoard from "./GameBoard";
import ErrorPage from "./ErrorPage";

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            {
                path: "game/:gameId",
                element: <GameBoard />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
    },
];

export default routes;
