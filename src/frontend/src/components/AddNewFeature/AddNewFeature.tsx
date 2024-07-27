import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { InputGroup } from "react-bootstrap";

interface AddNewFeatureProps {
    showModal: boolean;
    closeModal: (fileName: string, confirm?: boolean) => Promise<void> | void;
}

export default function AddNewFeature(props: AddNewFeatureProps) {
    const [fileName, setFileName] = useState("");
    const innerRef = useRef<HTMLInputElement>(null);

    const addFeature = (confirm?: boolean) => {
        setFileName("");
        props.closeModal(`${fileName}.feature`, confirm);
    };

    return (
        <>
            <Modal show={props.showModal} onHide={() => addFeature()} onShow={() => innerRef.current?.focus()}>
                <Modal.Header closeButton>
                    <Modal.Title>Run new test</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(event) => {
                            event.preventDefault();
                            addFeature(true);
                        }}
                    >
                        <InputGroup className="mb-3">
                            <FormControl
                                ref={innerRef}
                                type="text"
                                placeholder="File name"
                                value={fileName}
                                onChange={(event) => setFileName(event.target.value)}
                                aria-describedby="fileNameInput"
                            />
                            <InputGroup.Text id="fileNameInput">.feature</InputGroup.Text>
                        </InputGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => addFeature()}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={() => addFeature(true)}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
