import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ConfirmWindowProps {
    title: string;
    message: string;
    showModal: boolean;
    closeModal: (confirm: boolean) => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

export default function ConfirmWindow(props: ConfirmWindowProps) {
    return (
        <>
            <Modal show={props.showModal} onHide={() => props.closeModal(false)}>
                <Modal.Header closeButton data-testid="header">
                    <Modal.Title data-testid="title">{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body data-testid="body">{props.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => props.closeModal(false)} data-testid="button-close">
                        {props.cancelButtonText ?? "Close"}
                    </Button>
                    <Button variant="primary" onClick={() => props.closeModal(true)} data-testid="button-confirm">
                        {props.confirmButtonText ?? "Confirm"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
