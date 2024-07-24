import React, { useState } from "react";
import { CloseButton, ProgressBar, Table } from "react-bootstrap";
import { errorSlice, taskSlice, useAppDispatch, useAppSelector } from "../../store/Store";

import ConfirmWindow from "../ConfirmWindow/ConfirmWindow";
import { removeTask } from "../../backendRequests/TasksRequests";


export interface TaskTableProps {
    type: "running" | "queued";
}

export default function TaskTable(props: TaskTableProps) {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => taskSlice.selectors.tasksOfType(state, props.type));
    const [isModalShow, setIsModalShow] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState<string>();

    async function closeModal(confirm: boolean) {
        setIsModalShow(false);
        if (confirm && currentTaskId) {
            try {
                await removeTask(currentTaskId);
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(errorSlice.actions.addError({
                        name: "Couldn't remove task",
                        message: `Couldn't remove task from queue!<br>${error.message}`
                    }));
                }

            }
            dispatch(taskSlice.actions.removeTask({ id: currentTaskId, type: props.type }));
        }
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
                    {tasks.length > 0 ? tasks.map((task, index) => (
                        <tr key={index} data-testid={`row-id-${task.id}`}>
                            <td>"TODO: добавить даты"</td>
                            <td>{task.parameters.owner}</td>
                            <td>{task.parameters.featuresPath}</td>
                            <td>{task.parameters.tags}</td>
                            <td><ProgressBar striped animated variant="info" now={20} /></td>
                            <td>
                                {props.type === "queued" ? (
                                    <CloseButton onClick={() => {
                                        setIsModalShow(true);
                                        setCurrentTaskId(task.id);
                                    }} data-testid={`stopButton-id-${task.id}`} />
                                ) : (<></>)}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6}><p className="text-center">EMPTY</p></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <ConfirmWindow title="Remove task" message="Do you really want to remove task from queue?" showModal={isModalShow} closeModal={closeModal} />
        </>
    )
}

