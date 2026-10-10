import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Home } from "../../pages/Home/Home";
import Tours from "../../pages/Tours/Tours";
import About from "../../pages/AboutUs/About";
import Contact from "../../pages/Contact/Contact";
import Reviews from "../../pages/reviews/Reviews";
import AdminLayout from "../Layout/AdminLayout";
import AdminTours from "../../pages/admin/AdminTours";
import AdminBookings from "../../pages/admin/AdminBookings";
import AdminReviews from "../../pages/admin/AdminReviews";
import AdminLogin from "../../pages/admin/AdminLogin";
import Blog from "../../pages/Blog/Blog";
import TourPage from "../../pages/Tours/TourPage";
import AdminGuides from "../../pages/admin/Adminguides";
import AdminFaq from "../../pages/admin/Adminfaq";
import AdminCompany from "../../pages/admin/Admincompany";
import AdminTelegram from "../../pages/admin/Admintelegram";
import ResourceList from "../../pages/admin/Resourcelist";
import ResourceForm from "../../pages/admin/Resourceform";
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
                path: "/tours/:slug",
                element: <TourPage/>
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
    { path: 'tours', element: <ResourceList resource="tours" /> },
{ path: 'tours/new', element: <ResourceForm resource="tours" /> },
{ path: 'tours/:id', element: <ResourceForm resource="tours" /> },
    { path: 'bookings', element: <AdminBookings /> },
    { path: 'reviews', element: <AdminReviews/> },
    { path: 'guides', element: <AdminGuides /> },
{ path: 'faq', element: <AdminFaq /> },
{ path: 'company', element: <AdminCompany /> },
{ path: 'telegram', element: <AdminTelegram /> },
  ],
},

])