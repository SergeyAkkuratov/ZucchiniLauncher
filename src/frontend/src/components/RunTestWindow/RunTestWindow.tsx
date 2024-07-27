import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { TestParameters } from "../../store/StoreTypes";
import FeatureSelect from "../FeatureSelect/FeatureSelect";
import { useAppSelector } from "../../store/Store";

interface RunTestWindowProps {
    showModal: boolean;
    addTaskFunction: (close: boolean, parameters?: TestParameters) => Promise<void> | void;
}

export default function RunTestWindow(props: RunTestWindowProps) {
    const user = useAppSelector((state) => state.User);
    const cleanFormData: TestParameters = {
        featuresPath: "placeholder",
        tags: "",
        timeout: "10S",
    };

    const [formData, setFormData] = useState<TestParameters>(cleanFormData);
    const [isAnotherTest, setAnotherTest] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { id, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    const runTest = (parameters?: TestParameters) => {
        if (!isAnotherTest) {
            setFormData(cleanFormData);
        }
        props.addTaskFunction(!isAnotherTest, { ...parameters, owner: user.username } as TestParameters);
    };

    return (
        <>
            <Modal show={props.showModal} onHide={() => props.addTaskFunction(true)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Run new test</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="featureSelect">
                            <FeatureSelect onChange={(event) => handleChange(event)} value={formData.featuresPath} id="featuresPath" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="tagsInput">
                            <Form.Label>Tags</Form.Label>
                            <FormControl
                                type="text"
                                value={formData.tags}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                                id="tags"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="timeoutInput">
                            <Form.Label>Timeout</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.timeout}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                                id="timeout"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Check
                        type="switch"
                        id="another"
                        label="Run another test"
                        defaultChecked={isAnotherTest}
                        onChange={() => setAnotherTest(!isAnotherTest)}
                    />
                    <Button variant="secondary" onClick={() => props.addTaskFunction(true)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => runTest(formData)}>
                        Run
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
