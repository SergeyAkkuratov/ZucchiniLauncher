import React, { useEffect } from "react";
import { Card, Stack } from "react-bootstrap";
import TaskTable from "../components/TaskTable/TaskTable";
import { getTasks } from "../backendRequests/TasksRequests";
import { taskSlice, useAppDispatch } from "../store/Store";


export default function Main() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const timerId = setInterval(() => { getTasks().then((state) => { dispatch(taskSlice.actions.setTasks(state)) }) }, 5000);
        return () => { clearInterval(timerId) };
    }, [])

    return (
        <>
            <Stack gap={2}>
                <div className="p-2">
                    <Card border="success">
                        <Card.Header>Running Tasks</Card.Header>
                        <Card.Body>
                            <TaskTable type={"running"} />
                        </Card.Body>
                    </Card>
                </div>
                <div className="p-2">
                    <Card border="warning">
                        <Card.Header>Queued Tasks</Card.Header>
                        <Card.Body>
                            <TaskTable type={"queued"} />
                        </Card.Body>
                    </Card>
                </div>
            </Stack>
        </>
    );
}
