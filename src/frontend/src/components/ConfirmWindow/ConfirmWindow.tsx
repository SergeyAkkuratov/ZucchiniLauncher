import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ConfirmWindowProps {
    title: string;
    message: string;
    showModal: boolean;
    closeModal: (confirm: boolean, data?: string) => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

export default function ConfirmWindow(props: ConfirmWindowProps) {
    return (
        <>
            <Modal show={props.showModal} onHide={() => props.closeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => props.closeModal(false)}>
                        {props.cancelButtonText ?? "Close"}
                    </Button>
                    <Button variant="primary" onClick={() => props.closeModal(true)}>
                        {props.confirmButtonText ?? "Confirm"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
