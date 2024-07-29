import React, { useState } from "react";
import { Badge, Button, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { TestParameters, ZLError } from "../../store/StoreTypes";
import { addTask } from "../../backendRequests/TasksRequests";
import { updateTasks, useAppDispatch, useAppSelector } from "../../store/Store";
import errorSlice from "../../store/ErrorSlice";
import RunTestWindow from "../RunTestWindow/RunTestWindow";
import logo from "../../images/zucchini.png";
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
                await updateTasks();
            } catch (error) {
                dispatch(errorSlice.actions.addError(error as ZLError));
            }
        }
        if (close) setShowAddTask(false);
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary bg-dark" data-bs-theme="dark" data-testid="header">
                <Navbar.Brand href="/" data-testid="brand">
                    <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" data-testid="brand-logo" />
                    Zucchini Launcher
                </Navbar.Brand>
                <Badge bg={isAdmin ? "success" : "primary"} onClick={() => navigate("/login?logout")} data-testid="badge-user">
                    {user.username}
                </Badge>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <Link className="nav-link" to="/" data-testid="link-dashboard">
                                Dashboard
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link className="nav-link" to="/features" data-testid="link-features">
                                Features
                            </Link>
                        </Nav.Item>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Button variant="success" onClick={() => setShowAddTask(true)} data-testid="button-runTest">
                            Run test
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <RunTestWindow showModal={showAddTask} addTaskFunction={runTest} />
        </>
    );
}
