import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import Navigation from "./components/Navigation/Navigation";
import { useAppDispatch, useAppSelector } from "./store/Store";
import errorSlice from "./store/ErrorSlice";
import "bootswatch/dist/darkly/bootstrap.min.css";
import "./styles.css"

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Features = React.lazy(() => import("./pages/Features"));
const Login = React.lazy(() => import("./pages/Login"));

export default function App() {
    const dispatch = useAppDispatch();
    const lastError = useAppSelector(errorSlice.selectors.lastError);
    const showError = useAppSelector(errorSlice.selectors.showError);

    return (
        <>
            <Navigation />
            <Suspense>
                <Routes> 
                    <Route path="/index.html" element={<Navigate to="/" replace />}/>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Suspense>
            <ToastContainer position="top-end">
                <Toast onClose={() => dispatch(errorSlice.actions.errorShowed())} show={showError} delay={3000} autohide bg="danger">
                    <Toast.Header>
                        <strong className="me-auto">{lastError?.name}</strong>
                    </Toast.Header>
                    <Toast.Body><pre>{lastError?.message}</pre></Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}
