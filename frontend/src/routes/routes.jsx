import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";


const routes = [
    {
        path: '/login',
        element: <Login/>,

    },
    {
        path: '/signup',
        element: <Signup/>,
    }
]

const router = createBrowserRouter(routes);

export default router;