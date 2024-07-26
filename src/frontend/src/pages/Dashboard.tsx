import React, { useEffect } from "react";
import { Card, Stack } from "react-bootstrap";
import TaskTable from "../components/TaskTable/TaskTable";
import { getTasks } from "../backendRequests/TasksRequests";
import { useAppDispatch } from "../store/Store";
import taskSlice from "../store/TaskSlice";


export default function Dashboard() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        getTasks().then((state) => { dispatch(taskSlice.actions.setTasks(state)) });
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
                <div className="p-2">
                    <Card border="info">
                        <Card.Header>Last 10 Finished tasks</Card.Header>
                        <Card.Body>
                            <TaskTable type={"finished"} />
                        </Card.Body>
                    </Card>
                </div>
            </Stack>
        </>
    );
}
