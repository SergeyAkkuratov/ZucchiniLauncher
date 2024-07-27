/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorState, ZLError } from "./StoreTypes";

export const MAX_ERRORS_SIZE = 20;

const initialErrorState: ErrorState = {
    newError: false,
    errors: [],
};

const errorSlice = createSlice({
    name: "Errors",
    initialState: initialErrorState,
    reducers: {
        addError: (state, action: PayloadAction<ZLError>) => {
            state.errors.push(action.payload);
            state.newError = true;
            if (state.errors.length > MAX_ERRORS_SIZE) {
                state.errors = state.errors.slice(-MAX_ERRORS_SIZE, state.errors.length);
            }
        },
        errorShowed: (state) => {
            state.newError = false;
        },
    },
    selectors: {
        lastError: (state) => state.errors.at(-1),
        showError: (state) => state.newError,
    },
});

export default errorSlice;
