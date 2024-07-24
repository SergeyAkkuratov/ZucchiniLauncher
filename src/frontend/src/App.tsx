import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import "bootswatch/dist/darkly/bootstrap.min.css";
import Navigation from "./components/Navigation/Navigation";
import { errorSlice, useAppDispatch, useAppSelector } from "./store/Store";
import Features from "./pages/Features";



const Main = React.lazy(() => import("./pages/Main"));
const About = React.lazy(() => import("./pages/About"));

export default function App() {
    const dispatch = useAppDispatch();
    const lastError = useAppSelector(errorSlice.selectors.lastError);
    const showError = useAppSelector(errorSlice.selectors.showError);

    return (
        <>
            <Navigation />
            <Suspense>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/features" element={<Features />} />
                </Routes>
            </Suspense>
            <ToastContainer position="top-end">
                <Toast onClose={() => dispatch(errorSlice.actions.errorShowed())} show={showError} delay={3000} autohide bg="danger">
                    <Toast.Header>
                        <strong className="me-auto">{lastError?.name}</strong>
                    </Toast.Header>
                    <Toast.Body>{lastError?.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}
