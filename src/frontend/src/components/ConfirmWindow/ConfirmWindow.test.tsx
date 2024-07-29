import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import { initialErrorState } from "../../store/ErrorSlice";
import { RootState } from "../../store/Store";
import { initialTaskState } from "../../store/TaskSlice";
import { initialUserState } from "../../store/UserSlice";
import ConfirmWindow from "./ConfirmWindow";

describe("Run Confirm Window tests", () => {
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
        let showModal = true;
        const closeModal = jest.fn(() => {
            showModal = false;
        });
        store = mockStore(initialState);
        const { rerender } = render(
            <Provider store={store}>
                <ConfirmWindow
                    title={"TEST"}
                    message={"TEST MESSAGE"}
                    showModal={showModal}
                    closeModal={closeModal}
                    confirmButtonText="CONFIRM"
                    cancelButtonText="CANCEL"
                />
            </Provider>
        );

        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("title")).toBeInTheDocument();
        expect(screen.getByTestId("title").innerHTML).toBe("TEST");
        expect(screen.getByTestId("body")).toBeInTheDocument();
        expect(screen.getByTestId("body").innerHTML).toBe("TEST MESSAGE");
        expect(screen.getByTestId("button-confirm")).toBeInTheDocument();
        expect(screen.getByTestId("button-confirm").innerHTML).toBe("CONFIRM");
        expect(screen.getByTestId("button-close")).toBeInTheDocument();
        expect(screen.getByTestId("button-close").innerHTML).toBe("CANCEL");

        rerender(
            <Provider store={store}>
                <ConfirmWindow title={"TEST"} message={"TEST MESSAGE"} showModal={showModal} closeModal={closeModal} />
            </Provider>
        );

        expect(screen.getByTestId("button-confirm").innerHTML).toBe("Confirm");
        expect(screen.getByTestId("button-close").innerHTML).toBe("Close");
    });

    it("close and confirm actions", async () => {
        const user = userEvent.setup();
        let showModal = true;
        const closeModal = jest.fn(() => {
            showModal = false;
        });
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <ConfirmWindow title={"TEST"} message={"TEST MESSAGE"} showModal={showModal} closeModal={closeModal} />
            </Provider>
        );

        await user.click(screen.getByTestId("button-confirm"));
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(closeModal).toHaveBeenCalledWith(true);

        await user.click(screen.getByTestId("button-close"));
        expect(closeModal).toHaveBeenCalledTimes(2);
        expect(closeModal).toHaveBeenCalledWith(false);

        await user.click(screen.getByLabelText("Close"));
        expect(closeModal).toHaveBeenCalledTimes(3);
        expect(closeModal).toHaveBeenCalledWith(false);
    });
});
