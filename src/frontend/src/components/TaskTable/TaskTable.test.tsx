import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import { initialErrorState } from "../../store/ErrorSlice";
import { RootState, store as realStore } from "../../store/Store";
import TaskTable from "./TaskTable";
import { initialFeaturesState } from "../../store/FeatureSlice";
import userSlice from "../../store/UserSlice";
import * as taskRequests from "../../backendRequests/TasksRequests";
import taskSlice from "../../store/TaskSlice";

describe("Run Test Window tests", () => {
    const initialState: RootState = {
        User: {
            username: "test",
            role: "[ROLE_ADMIN]",
        },
        Task: {
            running: [
                {
                    id: "0",
                    startTime: "test time",
                    parameters: {
                        featuresPath: "testPath",
                        tags: "@TEST",
                        timeout: "10s",
                        owner: "TEST_USER",
                    },
                },
            ],
            queued: [],
            finished: [
                {
                    id: "0",
                    startTime: "test time",
                    parameters: {
                        featuresPath: "testPath",
                        tags: "@TEST",
                        timeout: "10s",
                        owner: "TEST_USER",
                    },
                },
            ],
        },
        Features: initialFeaturesState,
        Errors: initialErrorState,
    };
    const mockStore = configureStore<RootState>();
    let store;

    beforeAll(() => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    });

    it("initial state running", () => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <TaskTable type={"running"} />
            </Provider>
        );

        expect(screen.getByTestId("table-main")).toBeInTheDocument();
        expect(screen.getByTestId("row-0")).toBeInTheDocument();
        expect(screen.getByTestId("row-0-startTime").innerHTML).toBe(initialState.Task.running.at(0)?.startTime);
        expect(screen.getByTestId("row-0-owner").innerHTML).toBe(initialState.Task.running.at(0)?.parameters.owner);
        expect(screen.getByTestId("row-0-featuresPath").innerHTML).toBe(initialState.Task.running.at(0)?.parameters.featuresPath);
        expect(screen.getByTestId("row-0-tags").innerHTML).toBe(initialState.Task.running.at(0)?.parameters.tags);
    });

    it("initial state queued empty", () => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <TaskTable type={"queued"} />
            </Provider>
        );

        expect(screen.getByTestId("table-main")).toBeInTheDocument();
        expect(screen.getByTestId("row-empty").innerHTML).toContain("EMPTY");
    });

    it("initial state finished", async () => {
        const openSpy = jest.spyOn(globalThis, "open");
        const user = userEvent.setup();
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <TaskTable type={"finished"} />
            </Provider>
        );

        expect(screen.getByTestId("table-main")).toBeInTheDocument();
        expect(screen.getByTestId("row-0")).toBeInTheDocument();
        expect(screen.getByTestId("row-0-startTime").innerHTML).toBe(initialState.Task.finished.at(0)?.startTime);
        expect(screen.getByTestId("row-0-owner").innerHTML).toBe(initialState.Task.finished.at(0)?.parameters.owner);
        expect(screen.getByTestId("row-0-featuresPath").innerHTML).toBe(initialState.Task.finished.at(0)?.parameters.featuresPath);
        expect(screen.getByTestId("row-0-tags").innerHTML).toBe(initialState.Task.finished.at(0)?.parameters.tags);

        await user.click(screen.getByTestId("row-0"));
        expect(screen.getByTestId("offcanvas-main")).toBeInTheDocument();

        await user.click(screen.getByTestId("button-results"));
        expect(openSpy).toHaveBeenCalledWith("http://localhost:5050/allure-docker-service/projects/default/reports/0/index.html");

        await user.click(screen.getByLabelText("Close"));
        expect(screen.queryByTestId("offcanvas-main")).not.toBeInTheDocument();
    });

    it("test delete button", async () => {
        realStore.dispatch(userSlice.actions.setUser({ username: "ADMIN", role: "[ROLE_ADMIN]" }));
        realStore.dispatch(
            taskSlice.actions.setTasks({
                running: [],
                queued: [
                    {
                        id: "0",
                        startTime: "test time",
                        parameters: {
                            featuresPath: "testPath",
                            tags: "@TEST",
                            timeout: "10s",
                            owner: "TEST_USER",
                        },
                    },
                ],
                finished: [],
            })
        );
        const removeTaskSpy = jest.spyOn(taskRequests, "removeTask").mockImplementation(() => Promise.resolve());
        const user = userEvent.setup();
        render(
            <Provider store={realStore}>
                <TaskTable type={"queued"} />
            </Provider>
        );

        await user.click(screen.getByTestId("stopButton-id-0"));
        await user.click(screen.getByTestId("button-close"));
        expect(removeTaskSpy).toHaveBeenCalledTimes(0);

        await user.click(screen.getByTestId("stopButton-id-0"));
        await user.click(screen.getByTestId("button-confirm"));

        expect(removeTaskSpy).toHaveBeenCalledTimes(1);
        expect(realStore.getState().Task.queued.length).toBe(0);
    });

    it("test delete button with errors", async () => {
        realStore.dispatch(userSlice.actions.setUser({ username: "ADMIN", role: "[ROLE_ADMIN]" }));
        realStore.dispatch(
            taskSlice.actions.setTasks({
                running: [],
                queued: [
                    {
                        id: "0",
                        startTime: "test time",
                        parameters: {
                            featuresPath: "testPath",
                            tags: "@TEST",
                            timeout: "10s",
                            owner: "TEST_USER",
                        },
                    },
                ],
                finished: [],
            })
        );
        const removeTaskSpy = jest.spyOn(taskRequests, "removeTask").mockImplementation(() => Promise.reject(new Error("test error")));
        const user = userEvent.setup();
        render(
            <Provider store={realStore}>
                <TaskTable type={"queued"} />
            </Provider>
        );

        await user.click(screen.getByTestId("stopButton-id-0"));
        await user.click(screen.getByTestId("button-confirm"));

        expect(removeTaskSpy).toHaveBeenCalled();
        expect(realStore.getState().Task.queued[0]).toStrictEqual({
            id: "0",
            startTime: "test time",
            parameters: {
                featuresPath: "testPath",
                tags: "@TEST",
                timeout: "10s",
                owner: "TEST_USER",
            },
        });
        expect(realStore.getState().Errors.errors.at(-1)).toStrictEqual(new Error("test error"));
    });
});
