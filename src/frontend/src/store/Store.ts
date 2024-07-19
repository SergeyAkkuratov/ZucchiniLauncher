/* eslint-disable no-param-reassign */
import { PayloadAction, configureStore, createSelector, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Task, TaskState } from "./StoreTypes";

export const initialTaskState: TaskState = {
    running: [
        {
            id: "TEST",
            priority: 1,
            parameters: {
                priority: "1",
                glue: "test",
                threads: "1",
                plugin: [
                    "test"
                ],
                featuresPath: "features/test.feature",
                owner: "Me",
                tags: "@TEST",
                timeout: "60m"
            }
        },
        {
            id: "TEST2",
            priority: 2,
            parameters: {
                priority: "2",
                glue: "test",
                threads: "1",
                plugin: [
                    "test"
                ],
                featuresPath: "features/test2.feature",
                owner: "Me",
                tags: "@TEST2",
                timeout: "60m"
            }
        }
    ],
    queued: [
        {
            id: "TEST",
            priority: 1,
            parameters: {
                priority: "1",
                glue: "test",
                threads: "1",
                plugin: [
                    "test"
                ],
                featuresPath: "features/test.feature",
                owner: "Me",
                tags: "@TEST",
                timeout: "60m"
            }
        },
        {
            id: "TEST2",
            priority: 2,
            parameters: {
                priority: "2",
                glue: "test",
                threads: "1",
                plugin: [
                    "test"
                ],
                featuresPath: "features/test2.feature",
                owner: "Me",
                tags: "@TEST2",
                timeout: "60m"
            }
        }
    ]
};

export const taskSlice = createSlice({
    name: "Task",
    initialState: initialTaskState,
    reducers: {
        addRunningTask: (state, action: PayloadAction<Task>) => {
            state.running.push(action.payload);
        },
        addQueuedTask: (state, action: PayloadAction<Task>) => {
            state.queued.push(action.payload);
        },
        setRunningTasks: (state, action: PayloadAction<Task[]>) => {
            state.running = action.payload;
        },
        setQueuedTasks: (state, action: PayloadAction<Task[]>) => {
            state.queued = action.payload;
        },
        removeTask: (state, action: PayloadAction<string>) => {
            state.running = state.running.filter(task => task.id !== action.payload);
            state.queued = state.queued.filter(task => task.id !== action.payload);
        }
    },
    selectors: {
        runningTasks: (state) => state.running,
        queuedTasks: (state) => state.queued,
        tasksOfType: (state, type: "running" | "queued") => type === "running" ? state.running : state.queued
    },
});

export const store = configureStore({
    reducer: {
        Task: taskSlice.reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const createAppSelector = createSelector.withTypes<RootState>();