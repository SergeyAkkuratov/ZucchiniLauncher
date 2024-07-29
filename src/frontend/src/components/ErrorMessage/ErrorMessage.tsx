import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import errorSlice from "../../store/ErrorSlice";
import { useAppDispatch, useAppSelector } from "../../store/Store";

export default function ErrorMessage() {
    const dispatch = useAppDispatch();
    const lastError = useAppSelector(errorSlice.selectors.lastError);
    const showError = useAppSelector(errorSlice.selectors.showError);

    return (
        <>
            <ToastContainer position="top-end" className="toast-top-full-width">
                <Toast onClose={() => dispatch(errorSlice.actions.errorShowed())} show={showError} delay={3000} autohide bg="danger">
                    <Toast.Header data-testid="header">
                        <strong className="me-auto">{lastError?.name}</strong>
                    </Toast.Header>
                    <Toast.Body data-testid="body">
                        <pre>{lastError?.message}</pre>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}
