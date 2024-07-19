import React, { useState } from "react";
import { CloseButton, ProgressBar, Table } from "react-bootstrap";
import { taskSlice, useAppSelector } from "../../store/Store";

import ModalWindow from "../ModalWindow/ModalWindow";


export interface TaskTableProps {
    type: "running" | "queued";
}

export default function TaskTable(props: TaskTableProps) {
    const tasks = useAppSelector((state) => taskSlice.selectors.tasksOfType(state, props.type));
    const [isModalShow, setIsModalShow] = useState(false);

    function closeModal(confirm: boolean) {
        setIsModalShow(false);
        console.log(confirm);
    }

    return (
        <>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Owner</th>
                        <th>Feature Path</th>
                        <th>Tags</th>
                        <th>Progress</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index} data-testid={`row-id-${task.id}`}>
                            <td>"TODO: добавить даты"</td>
                            <td>{task.parameters.owner}</td>
                            <td>{task.parameters.featuresPath}</td>
                            <td>{task.parameters.tags}</td>
                            <td><ProgressBar striped animated variant="info" now={20} /></td>
                            <td>
                                <CloseButton onClick={() => setIsModalShow(true)} data-testid={`stopButton-id-${task.id}`} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ModalWindow title="Stop task" message="Do you really want to stop task?" showModal={isModalShow} closeModal={closeModal} />
        </>
    )
}

