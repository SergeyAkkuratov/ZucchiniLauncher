import { Task, TaskState, TestParameters } from "../store/StoreTypes";
import request from "./Request";

export async function getTasks(): Promise<TaskState> {
    return (await request("tasks")) as TaskState;
}

export async function getTask(id: string): Promise<Task> {
    const json = await request(`tasks/${id}`);
    return JSON.parse(json);
}

export async function addTask(parameters: TestParameters): Promise<Task> {
    return (await request("tasks/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parameters),
    })) as Task;
}

export async function removeTask(id: string) {
    await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
    });
}
