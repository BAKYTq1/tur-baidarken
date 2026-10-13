import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import AdminLayout from "../Layout/AdminLayout";

const lazyPage = (importPage, props) => async () => {
    const { default: Component } = await importPage();
    return {
        Component: props ? () => <Component {...props} /> : Component,
    };
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        HydrateFallback: () => <div role="status" aria-label="Loading page" />,
        children: [
            {
                index: true,
                lazy: lazyPage(() => import("../../pages/Home/Home"))
            },
            {
                path: "/tours/:tourId",
                lazy: lazyPage(() => import("../../pages/Tours/TourDetails"))
            },
            {
                path: "/tours",
                lazy: lazyPage(() => import("../../pages/Tours/Tours"))
            },
            {
                path: "/tours/:slug",
                lazy: lazyPage(() => import("../../pages/Tours/TourPage"))
            },
            {
                path: "/about",
                lazy: lazyPage(() => import("../../pages/AboutUs/About"))
            },
            {
                path: "/contacts",
                lazy: lazyPage(() => import("../../pages/Contact/Contact"))
            },
            {
                path: "/reviews",
                lazy: lazyPage(() => import("../../pages/reviews/Reviews"))
            },
            {
                path: "/blog",
                lazy: lazyPage(() => import("../../pages/Blog/Blog"))
            }
        ]
    },
    { path: '/admin/login', lazy: lazyPage(() => import("../../pages/admin/AdminLogin")) },
    {
   path: '/admin',
   element: <AdminLayout />,
   children: [
    { index: true, element: <Navigate to="tours" replace /> },
    { path: 'tours', lazy: lazyPage(() => import("../../pages/admin/AdminTours")) },
    { path: 'guides', lazy: lazyPage(() => import("../../pages/admin/Adminguides")) },
    { path: 'tours', lazy: lazyPage(() => import("../../pages/admin/Resourcelist"), { resource: "tours" }) },
{ path: 'tours/new', lazy: lazyPage(() => import("../../pages/admin/Resourceform"), { resource: "tours" }) },
{ path: 'tours/:id', lazy: lazyPage(() => import("../../pages/admin/Resourceform"), { resource: "tours" }) },
    { path: 'bookings', lazy: lazyPage(() => import("../../pages/admin/AdminBookings")) },
    { path: 'reviews', lazy: lazyPage(() => import("../../pages/admin/AdminReviews")) },
    { path: 'guides', lazy: lazyPage(() => import("../../pages/admin/Adminguides")) },
{ path: 'faq', lazy: lazyPage(() => import("../../pages/admin/Adminfaq")) },
{ path: 'company', lazy: lazyPage(() => import("../../pages/admin/Admincompany")) },
{ path: 'telegram', lazy: lazyPage(() => import("../../pages/admin/Admintelegram")) },
  ],
},

])