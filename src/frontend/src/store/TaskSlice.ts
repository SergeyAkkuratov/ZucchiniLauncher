/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskState, TaskType } from "./StoreTypes";

const initialTaskState: TaskState = {
    running: [],
    queued: [],
    finished: [],
};

const taskSlice = createSlice({
    name: "Task",
    initialState: initialTaskState,
    reducers: {
        setTasks: (state, action: PayloadAction<TaskState>) => action.payload,
        removeTask: (state, action: PayloadAction<{ id: string; type: TaskType }>) => {
            switch (action.payload.type) {
                case "finished":
                    state.finished = state.finished.filter((task) => task.id !== action.payload.id);
                    break;
                case "queued":
                    state.queued = state.queued.filter((task) => task.id !== action.payload.id);
                    break;
                default:
                    state.running = state.running.filter((task) => task.id !== action.payload.id);
                    break;
            }
        },
    },
    selectors: {
        tasksOfType: (state, type: TaskType) => {
            switch (type) {
                case "finished":
                    return state.finished;
                case "queued":
                    return state.queued;
                default:
                    return state.running;
            }
        },
    },
});

export default taskSlice;
