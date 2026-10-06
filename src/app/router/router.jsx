import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Home } from "../../pages/Home/Home";
import Tours from "../../pages/Tours/Tours";
import About from "../../pages/AboutUs/About";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/tours",
                element: <Tours/>
            },
            {
                path: "/about",
                element: <About/>
            },
        ]
    }
])