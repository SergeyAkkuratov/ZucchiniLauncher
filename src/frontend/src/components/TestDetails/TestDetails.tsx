import React from "react";
import { Table } from "react-bootstrap";
import { Task } from "../../store/StoreTypes";

interface TestDetailsProps {
    task: Task;
}
// {
//     "id": "121896cd-35c9-43d2-937e-a59bb438375b",
//     "startTime": "2024-07-25 21:48:46.859",
//     "parameters": {
//       "priority": "0",
//       "glue": "ru.sakkuratov.autotests.cucumber",
//       "threads": "1",
//       "plugin": [
//         "pretty",
//         "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm"
//       ],
//       "featuresPath": "features\\test.feature",
//       "owner": "user",
//       "tags": "@TEST",
//       "timeout": "10S"
//     },
//     "priority": 0
//   }
export default function TestDetails(props: TestDetailsProps) {
    return (
        <>
            <Table striped hover>
                <tbody>
                    {Object.entries(props.task.parameters).map(([key, value]) => (
                        <tr key={key}>
                            <td>{key.toUpperCase()}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
