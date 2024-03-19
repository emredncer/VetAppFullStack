import { createBrowserRouter, RouteObject } from "react-router-dom";
import React from "react";
import App from "../App";
import VaccinePage from "../pages/VaccinePage";
import CustomerPage from "../pages/CustomerPage";
import DoctorPage from "../pages/DoctorPage";
import AppointmentPage from "../pages/AppointmentPage";
import AnimalPage from "../pages/AnimalPage";
import ReportPage from "../pages/ReportPage";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App /> ,
        children: [
             { path: '/vaccine', element: <VaccinePage /> },
             { path: '/customer', element: <CustomerPage /> },
             { path: '/doctor', element: <DoctorPage /> },
             { path: '/appointment', element: <AppointmentPage /> },
             { path: '/animal', element: <AnimalPage /> },
             { path: '/report', element: <ReportPage /> }
        ]
    },
]

export const router = createBrowserRouter(routes);