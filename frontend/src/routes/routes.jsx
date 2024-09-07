import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";


const routes = [
    {
        path: '/login',
        element: <Login/>,

    },
    {
        path: '/signup',
        element: <Signup/>,
    },
    {
        path: '/dashboard',
        element: <Dashboard/>,
    }
]

const router = createBrowserRouter(routes);

export default router;