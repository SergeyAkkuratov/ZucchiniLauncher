import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import * as router from "react-router";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import { initialErrorState } from "../../store/ErrorSlice";
import { RootState } from "../../store/Store";
import { initialTaskState } from "../../store/TaskSlice";
import Navigation from "./Navigation";
import * as requests from "../../backendRequests/TasksRequests";
import * as realStore from "../../store/Store";
import userSlice from "../../store/UserSlice";
import featureSlice from "../../store/FeatureSlice";

describe("Run Test Window tests", () => {
    const initialState: RootState = {
        User: {
            username: "test",
            role: "[ROLE_USER]",
        },
        Task: initialTaskState,
        Features: {
            filenames: ["test.feature", "test2.feature"],
        },
        Errors: initialErrorState,
    };
    const mockStore = configureStore<RootState>();
    let store;

    it("initial state", () => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByTestId("brand")).toBeInTheDocument();
        expect(screen.getByTestId("brand").innerHTML).toContain("Zucchini Launcher");
        expect(screen.getByTestId("brand-logo")).toBeInTheDocument();
        expect(screen.getByTestId("badge-user")).toBeInTheDocument();
        expect(screen.getByTestId("badge-user").innerHTML).toBe("test");
        expect(screen.getByTestId("link-dashboard")).toBeInTheDocument();
        expect(screen.getByTestId("link-features")).toBeInTheDocument();
        expect(screen.getByTestId("button-runTest")).toBeInTheDocument();
    });

    it("test navigate actions", async () => {
        const navigate = jest.fn();
        jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
        const user = userEvent.setup();
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        await user.click(screen.getByTestId("badge-user"));
        expect(navigate).toHaveBeenCalledWith("/login?logout");
    });

    it("test runTest function", async () => {
        const spyAddTask = jest.spyOn(requests, "addTask").mockImplementation(() =>
            Promise.resolve({
                id: "running",
                parameters: {
                    featuresPath: "testPath",
                    tags: "@TEST",
                    timeout: "10s",
                },
            })
        );
        const spyUpdateTasks = jest.spyOn(realStore, "updateTasks").mockImplementation(() => Promise.resolve());
        const user = userEvent.setup();
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        await user.click(screen.getByTestId("button-runTest"));
        await user.selectOptions(screen.getByTestId("select-feature") as HTMLSelectElement, "test.feature");
        await user.type(screen.getByTestId("input-tags"), "@TEST");
        await user.click(screen.getByTestId("button-run"));

        expect(spyAddTask).toHaveBeenCalledTimes(1);
        expect(spyUpdateTasks).toHaveBeenCalledTimes(1);

        await user.click(screen.getByTestId("button-runTest"));
        await user.click(screen.getByLabelText("Close"));

        expect(spyAddTask).toHaveBeenCalledTimes(1);
        expect(spyUpdateTasks).toHaveBeenCalledTimes(1);

        await user.click(screen.getByTestId("button-runTest"));
        await user.selectOptions(screen.getByTestId("select-feature") as HTMLSelectElement, "test.feature");
        await user.type(screen.getByTestId("input-tags"), "@TEST");
        await user.click(screen.getByTestId("run-another-test"));
        await user.click(screen.getByTestId("button-run"));
        await user.click(screen.getByTestId("button-run"));

        expect(spyAddTask).toHaveBeenCalledTimes(3);
        expect(spyUpdateTasks).toHaveBeenCalledTimes(3);
        expect(screen.getByTestId("button-run")).toBeInTheDocument();
    });

    it("test runTest function with errors", async () => {
        const spyAddTask = jest.spyOn(requests, "addTask").mockImplementation(() => Promise.reject(new Error("TEST ERROR")));
        const spyUpdateTasks = jest.spyOn(realStore, "updateTasks").mockImplementation(() => Promise.resolve());
        realStore.store.dispatch(featureSlice.actions.updateFileNames({ filenames: ["test.feature"] }));
        const user = userEvent.setup();
        render(
            <Provider store={realStore.store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        await user.click(screen.getByTestId("button-runTest"));
        await user.selectOptions(screen.getByTestId("select-feature") as HTMLSelectElement, "test.feature");
        await user.type(screen.getByTestId("input-tags"), "@TEST");
        await user.click(screen.getByTestId("button-run"));

        expect(spyAddTask).toHaveBeenCalledTimes(1);
        expect(spyUpdateTasks).toHaveBeenCalledTimes(0);
        expect(realStore.store.getState().Errors.errors.at(-1)).toStrictEqual(new Error("TEST ERROR"));
    });

    it("test admin badge actions", async () => {
        realStore.store.dispatch(
            userSlice.actions.setUser({
                username: "TEST",
                role: "[ROLE_ADMIN]",
            })
        );
        render(
            <Provider store={realStore.store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByTestId("badge-user")).toBeInTheDocument();
        expect(screen.getByTestId("badge-user").classList).toContain("bg-success");
    });
});
