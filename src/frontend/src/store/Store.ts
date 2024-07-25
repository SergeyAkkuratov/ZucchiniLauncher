/* eslint-disable no-param-reassign */
import { PayloadAction, configureStore, createSelector, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { ErrorState, TaskState, TaskType, UserState, ZLError } from "./StoreTypes";

const MAX_ERRORS_SIZE = 20;

const initialErrorState: ErrorState = {
    newError: false,
    errors: []
}

const initialTaskState: TaskState = {
    running: [],
    queued: [],
    finished: []
};

const initialUserState: UserState = {
    username: "",
    role: ""
}

export const taskSlice = createSlice({
    name: "Task",
    initialState: initialTaskState,
    reducers: {
        setTasks: (state, action: PayloadAction<TaskState>) => action.payload,
        removeTask: (state, action: PayloadAction<{ id: string, type: TaskType }>) => {
            if (action.payload.type === "running") {
                state.running = state.running.filter(task => task.id !== action.payload.id);
            } else {
                state.queued = state.queued.filter(task => task.id !== action.payload.id);
            }
        }
    },
    selectors: {
        runningTasks: (state) => state.running,
        queuedTasks: (state) => state.queued,
        tasksOfType: (state, type: TaskType) => {
            switch (type) {
                case "finished":
                    return state.finished;
                case "queued":
                    return state.queued;
                default:
                    return state.running;

            }
        }
    },
});

export const errorSlice = createSlice({
    name: "Errors",
    initialState: initialErrorState,
    reducers: {
        addError: (state, action: PayloadAction<ZLError>) => {
            console.error(action.payload)
            state.errors.push(action.payload);
            state.newError = true;
            if (state.errors.length > MAX_ERRORS_SIZE) {
                state.errors = state.errors.slice(-MAX_ERRORS_SIZE, state.errors.length);
            }
        },
        errorShowed: (state) => {
            state.newError = false;
        }
    },
    selectors: {
        lastError: (state) => state.errors.at(-1),
        showError: (state) => state.newError
    }
})

export const userSlice = createSlice({
    name: "User",
    initialState: initialUserState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => action.payload
    }
})

export const store = configureStore({
    reducer: {
        Task: taskSlice.reducer,
        User: userSlice.reducer,
        Errors: errorSlice.reducer
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