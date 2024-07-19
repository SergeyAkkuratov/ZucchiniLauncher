import React from "react";
import { Card, Stack } from "react-bootstrap";
import TaskTable from "../components/TaskTable/TaskTable";


export default function Main() {
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
