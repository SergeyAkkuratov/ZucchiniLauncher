import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import RunTestWindow from "./RunTestWindow"
import { initialErrorState } from "../../store/ErrorSlice";
import { RootState } from "../../store/Store";
import { initialTaskState } from "../../store/TaskSlice";
import { initialUserState } from "../../store/UserSlice";


describe("Run Test Window tests", () => {
    const initialState: RootState = {
        User: initialUserState,
        Task: initialTaskState,
        Features: {
            filenames: [
                "test.feature",
                "test2.feature"
            ]
        },
        Errors: initialErrorState
    };
    const mockStore = configureStore<RootState>();
    let store;
    
    it("initial state", () => {
        const addTaskFunction = jest.fn(() => {});
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <RunTestWindow showModal={true} addTaskFunction={addTaskFunction} />
            </Provider>
        )

        expect(screen.getByTestId("select-feature")).toBeInTheDocument();
        expect(screen.getByTestId("input-tags")).toBeInTheDocument();
        expect(screen.getByTestId("input-timeout")).toBeInTheDocument();
        expect(screen.getByTestId("run-another-test")).toBeInTheDocument();
        expect(screen.getByTestId("button-close")).toBeInTheDocument();
        expect(screen.getByTestId("button-run")).toBeInTheDocument();
    })

    it("test actions", async () => {
        const user = userEvent.setup();
        const addTaskFunction = jest.fn(() => {});
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <RunTestWindow showModal={true} addTaskFunction={addTaskFunction} />
            </Provider>
        )

        await user.selectOptions(screen.getByTestId("select-feature") as HTMLSelectElement, "test.feature");
        await user.type(screen.getByTestId("input-tags"), "@TEST");
        await user.clear(screen.getByTestId("input-timeout"));
        await user.type(screen.getByTestId("input-timeout"), "20s");
        await user.click(screen.getByTestId("run-another-test"));

        expect(screen.getByTestId("select-feature")).toHaveValue("test.feature");
        expect(screen.getByTestId("input-tags")).toHaveValue("@TEST");
        expect(screen.getByTestId("input-timeout")).toHaveValue("20s");
        
        await user.click(screen.getByTestId("button-run"));

        // expect(screen.queryByTestId("modal-window")).not.toBeInTheDocument();
        expect(addTaskFunction).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId("select-feature")).toHaveValue("test.feature");
        expect(screen.getByTestId("input-tags")).toHaveValue("@TEST");
        expect(screen.getByTestId("input-timeout")).toHaveValue("20s");

        await user.click(screen.getByTestId("run-another-test"));
        await user.click(screen.getByTestId("button-run"));

        expect(addTaskFunction).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId("select-feature")).toHaveValue("placeholder");
        expect(screen.getByTestId("input-tags")).toHaveValue("");
        expect(screen.getByTestId("input-timeout")).toHaveValue("10S");
    })
})