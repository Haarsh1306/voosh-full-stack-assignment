import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Error from "../pages/Error";


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
    },
    {
        path: '/',
        element: <Dashboard/>
    },
    {
        path: '/*',
        element: <Error message="Error 404 not found"/>
    }
]

const router = createBrowserRouter(routes);

export default router;