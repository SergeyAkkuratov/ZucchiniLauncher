import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import "bootswatch/dist/darkly/bootstrap.min.css";
import "./styles.css";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Features = React.lazy(() => import("./pages/Features"));
const Login = React.lazy(() => import("./pages/Login"));

export default function App() {
    return (
        <>
            <Navigation />
            <Suspense>
                <Routes>
                    <Route path="/index.html" element={<Navigate to="/" replace />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Suspense>
            <ErrorMessage />
        </>
    );
}
