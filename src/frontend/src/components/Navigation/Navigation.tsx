import React, { useState } from "react";
import { Badge, Button, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { TestParameters } from "../../store/StoreTypes";
import { addTask, getTasks } from "../../backendRequests/TasksRequests";
import { useAppDispatch, useAppSelector } from "../../store/Store";
import errorSlice from "../../store/ErrorSlice";
import taskSlice from "../../store/TaskSlice";
import RunTestWindow from "../RunTestWindow/RunTestWindow";
import logo from "./zucchini.png"
import userSlice from "../../store/UserSlice";


export default function Navigation() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.User);
    const isAdmin = useAppSelector(userSlice.selectors.isAdmin);
    const [showAddTask, setShowAddTask] = useState(false);

    async function runTest(close: boolean, parameters?: TestParameters) {
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
                {user.username ? (
                    <Badge bg={isAdmin ? "success" : "primary"} onClick={() => navigate("/login?logout")}>{user.username}</Badge>
                ) : (
                    <Badge bg="secondary" onClick={() => navigate("/login")}>unauthorized</Badge>
                )}                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <Link className="nav-link" to="/">
                                Dashboard
                            </Link>
                        </Nav.Item>
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
                    <Nav className="justify-content-end">
                        <Button variant="success" onClick={() => setShowAddTask(true)}>Run test</Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <RunTestWindow showModal={showAddTask} addTaskFunction={runTest} />
        </>
    );
}
