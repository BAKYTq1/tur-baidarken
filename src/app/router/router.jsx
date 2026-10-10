import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Home } from "../../pages/Home/Home";
import Tours from "../../pages/Tours/Tours";
import About from "../../pages/AboutUs/About";
import Contact from "../../pages/Contact/Contact";
import Reviews from "../../pages/reviews/Reviews";
import AdminLayout from "../Layout/AdminLayout";
import AdminTours from "../../pages/admin/AdminTours";
import AdminGuides from "../../pages/admin/AdminGuides";
import AdminBookings from "../../pages/admin/AdminBookings";
import AdminReviews from "../../pages/admin/AdminReviews";
import AdminLogin from "../../pages/admin/AdminLogin";
import Blog from "../../pages/Blog/Blog";
import TourDetails from "../../pages/Tours/TourDetails";

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
                path: "/tours/:tourId",
                element: <TourDetails/>
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
            {
                path: "/reviews",
                element: <Reviews/>
            },
            {
                path: "/blog",
                element: <Blog/>
            }
        ]
    },
    { path: '/admin/login', element: <AdminLogin /> },
    {
   path: '/admin',
   element: <AdminLayout />,
   children: [
    { index: true, element: <Navigate to="tours" replace /> },
    { path: 'tours', element: <AdminTours /> },
    { path: 'guides', element: <AdminGuides /> },
    { path: 'bookings', element: <AdminBookings /> },
    { path: 'reviews', element: <AdminReviews/> },
  ],
},

])