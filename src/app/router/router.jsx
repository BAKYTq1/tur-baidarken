import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Home } from "../../pages/Home/Home";
import Tours from "../../pages/Tours/Tours";
import About from "../../pages/AboutUs/About";
import Contact from "../../pages/Contact/Contact";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
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
            {
                path: "/contacts",
                element: <Contact/>
            },
        ]
    }
])