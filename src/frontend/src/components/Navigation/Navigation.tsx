import React, { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TestParameters } from "../../store/StoreTypes";
import { addTask, getTasks } from "../../backendRequests/TasksRequests";
import { taskSlice, errorSlice, useAppDispatch } from "../../store/Store";
import RunTestWindow from "../RunTestWindow/RunTestWindow";
import logo from "./zucchini.png"

export default function Navigation() {
    const dispatch = useAppDispatch();
    const [showAddTask, setShowAddTask] = useState(false);

    async function addTaskFunction(close: boolean, parameters?: TestParameters) {
        if (parameters) {
            try {
                await addTask(parameters);
                const state = await getTasks();
                dispatch(taskSlice.actions.setTasks(state));
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(errorSlice.actions.addError({
                        name: "Couldn't add task",
                        message: `Couldn't add task from queue!<br>${error.message}`
                    }));
                }
            }
        }
        if (close) setShowAddTask(false);
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary bg-dark" data-bs-theme="dark" data-testid="header">
                <Container>
                    <Navbar.Brand href="/">
                        <img
                            alt=""
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Zucchini Launcher
                    </Navbar.Brand>
                    <Button variant="success" onClick={() => setShowAddTask(true)}>Run test</Button>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Item>
                                <Link className="nav-link" to="/features">
                                    Features
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link className="nav-link" to="/about" data-testid="linkAbout">
                                    About
                                </Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                    <Nav className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="/login">Mark Otto</a>
                        </Navbar.Text>
                    </Nav>
                </Container>
            </Navbar>
            <RunTestWindow showModal={showAddTask} addTaskFunction={addTaskFunction} />
        </>
    );
}
