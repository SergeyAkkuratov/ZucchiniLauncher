import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "bootswatch/dist/darkly/bootstrap.min.css";
import Navigation from "./components/Navigation/Navigation";

const Main = React.lazy(() => import("./pages/Main"));
const About = React.lazy(() => import("./pages/About"));

export default function App() {
    return (
        <>
            <Suspense>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Suspense>
        </>
    );
}
