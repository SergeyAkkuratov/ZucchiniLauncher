import React, { useState } from "react";
import { Button, CloseButton, Offcanvas, OverlayTrigger, Popover, Stack, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/Store";
import taskSlice from "../../store/TaskSlice";
import errorSlice from "../../store/ErrorSlice";
import ConfirmWindow from "../ConfirmWindow/ConfirmWindow";
import { removeTask } from "../../backendRequests/TasksRequests";
import { Task, TaskType, ZLError } from "../../store/StoreTypes";
import TestDetails from "../TestDetails/TestDetails";
import userSlice from "../../store/UserSlice";

export interface TaskTableProps {
    type: TaskType;
}

export default function TaskTable(props: TaskTableProps) {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => taskSlice.selectors.tasksOfType(state, props.type));
    const isAdmin = useAppSelector(userSlice.selectors.isAdmin);
    const [isModalShow, setIsModalShow] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task>(tasks[0]);
    const [show, setShow] = useState(false);

    const handleCloseDetails = () => setShow(false);
    const handleShowDetails = (task: Task) => {
        setCurrentTask(task);
        setShow(true);
    };

    async function closeModal(confirm: boolean) {
        setIsModalShow(false);
        if (confirm && currentTask?.id) {
            try {
                await removeTask(currentTask.id);
                dispatch(taskSlice.actions.removeTask({ id: currentTask.id, type: props.type }));
            } catch (error) {
                dispatch(errorSlice.actions.addError(error as ZLError));
            }
        }
    }

    const openResults = () => {
        window.open(`http://localhost:5050/allure-docker-service/projects/default/reports/${currentTask.id}/index.html`);
    };

    return (
        <>
            <Table striped hover data-testid="table-main">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Owner</th>
                        <th>Feature Path</th>
                        <th>Tags</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <OverlayTrigger
                                trigger="hover"
                                key={`tolltip-${index}`}
                                placement="auto-start"
                                delay={1000}
                                overlay={
                                    <Popover id={`testDetail-${index}`}>
                                        <Popover.Header as="h3">Details</Popover.Header>
                                        <Popover.Body>
                                            <TestDetails task={task} />
                                        </Popover.Body>
                                    </Popover>
                                }
                            >
                                <tr key={index} data-testid={`row-${task.id}`} onClick={() => handleShowDetails(task)}>
                                    <td data-testid={`row-${task.id}-startTime`}>{task.startTime}</td>
                                    <td data-testid={`row-${task.id}-owner`}>{task.parameters.owner}</td>
                                    <td data-testid={`row-${task.id}-featuresPath`}>{task.parameters.featuresPath}</td>
                                    <td data-testid={`row-${task.id}-tags`}>{task.parameters.tags}</td>
                                    <td>
                                        {props.type === "queued" ? (
                                            <CloseButton
                                                disabled={!isAdmin}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setIsModalShow(true);
                                                    setCurrentTask(task);
                                                }}
                                                data-testid={`stopButton-id-${task.id}`}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </td>
                                </tr>
                            </OverlayTrigger>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} data-testid="row-empty">
                                <p className="text-center">EMPTY</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Offcanvas show={show} onHide={handleCloseDetails} placement="bottom" data-testid="offcanvas-main">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <Stack direction="horizontal" gap={3}>
                            <strong>Test Details</strong>
                            {props.type === "finished" && (
                                <Button variant="success" onClick={openResults} className="me-auto" data-testid="button-results">
                                    Open Results
                                </Button>
                            )}
                        </Stack>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <TestDetails task={currentTask} />
                </Offcanvas.Body>
            </Offcanvas>
            <ConfirmWindow
                title="Remove test"
                message="Do you really want to remove test from queue?"
                showModal={isModalShow}
                closeModal={closeModal}
            />
        </>
    );
}
