import React from "react";
import { Table } from "react-bootstrap";
import { Task } from "../../store/StoreTypes";

interface TestDetailsProps {
    task: Task;
}

export default function TestDetails(props: TestDetailsProps) {
    return (
        <>
            <Table striped hover>
                <tbody>
                    {Object.entries(props.task.parameters).map(([key, value]) => (
                        <tr key={key} data-testid={`row-test-${key}`}>
                            <td>{key.toUpperCase()}</td>
                            <td data-testid={`row-value-${key}`}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
