import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { initialErrorState } from "../../store/ErrorSlice";
import { RootState } from "../../store/Store";
import { initialTaskState } from "../../store/TaskSlice";
import { initialUserState } from "../../store/UserSlice";
import FeatureSelect from "./FeatureSelect";

jest.mock("../../backendRequests/FeaturesRequests");

describe("Feature Select tests", () => {
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

    it("initial state", async () => {
        const user = userEvent.setup();
        let value = "placeholder";
        const onChangeMock = jest.fn((event: React.ChangeEvent<HTMLSelectElement>) => {
            value = event.target.value;
        });

        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <FeatureSelect onChange={onChangeMock} value={value} />
            </Provider>
        );

        expect(screen.getByTestId("select-feature")).toBeInTheDocument();
        expect(screen.getByTestId("select-placeholder")).toBeInTheDocument();
        expect(screen.getByTestId("select-feature-option-0")).toBeInTheDocument();
        expect(screen.getByTestId("select-feature-option-1")).toBeInTheDocument();

        await user.selectOptions(screen.getByTestId("select-feature") as HTMLSelectElement, "test.feature");
        expect(onChangeMock).toHaveBeenCalled();
        expect(value).toBe("test.feature");
    });
});
