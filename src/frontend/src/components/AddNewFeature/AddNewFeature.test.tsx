import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import { initialErrorState } from "../../store/ErrorSlice";
import { RootState } from "../../store/Store";
import { initialTaskState } from "../../store/TaskSlice";
import { initialUserState } from "../../store/UserSlice";
import AddNewFeature from "./AddNewFeature";

describe("Run Test Window tests", () => {
    const initialState: RootState = {
        User: initialUserState,
        Task: initialTaskState,
        Features: {
            filenames: ["test.feature", "test2.feature"],
        },
        Errors: initialErrorState,
    };
    const mockStore = configureStore<RootState>();
    let store;

    it("initial state", () => {
        const cloeModal = jest.fn(() => {});
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <AddNewFeature showModal={true} closeModal={cloeModal} />
            </Provider>
        );

        expect(screen.getByTestId("input-filename")).toBeInTheDocument();
        expect(screen.getByTestId("button-close")).toBeInTheDocument();
        expect(screen.getByTestId("button-add")).toBeInTheDocument();
    });

    it("test close buttons", async () => {
        const user = userEvent.setup();
        const cloeModal = jest.fn(() => {});
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <AddNewFeature showModal={true} closeModal={cloeModal} />
            </Provider>
        );
        await user.type(screen.getByTestId("input-filename"), "test");
        await user.click(screen.getByTestId("button-close"));
        expect(cloeModal).toHaveBeenCalledTimes(1);
        expect(cloeModal).toHaveBeenCalledWith("test.feature", undefined);
        expect(screen.getByTestId("input-filename")).toHaveValue("");

        await user.type(screen.getByTestId("input-filename"), "test");
        await user.click(screen.getByLabelText("Close"));
        expect(cloeModal).toHaveBeenCalledTimes(2);
        expect(cloeModal).toHaveBeenCalledWith("test.feature", undefined);
        expect(screen.getByTestId("input-filename")).toHaveValue("");
    });

    it("test add buttons", async () => {
        const user = userEvent.setup();
        const cloeModal = jest.fn(() => {});
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <AddNewFeature showModal={true} closeModal={cloeModal} />
            </Provider>
        );

        await user.type(screen.getByTestId("input-filename"), "test");
        expect(screen.getByTestId("input-filename")).toHaveValue("test");

        await user.click(screen.getByTestId("button-add"));
        expect(cloeModal).toHaveBeenCalledTimes(1);
        expect(cloeModal).toHaveBeenCalledWith("test.feature", true);
        expect(screen.getByTestId("input-filename")).toHaveValue("");
    });

    it("test submit", async () => {
        const user = userEvent.setup();
        const cloeModal = jest.fn(() => {});
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <AddNewFeature showModal={true} closeModal={cloeModal} />
            </Provider>
        );

        await user.type(screen.getByTestId("input-filename"), "test");
        expect(screen.getByTestId("input-filename")).toHaveValue("test");

        await fireEvent.submit(screen.getByTestId("main-form"));
        expect(cloeModal).toHaveBeenCalledTimes(1);
        expect(cloeModal).toHaveBeenCalledWith("test.feature", true);
        expect(screen.getByTestId("input-filename")).toHaveValue("");
    });
});
