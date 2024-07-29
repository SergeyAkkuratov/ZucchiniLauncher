import { store } from "./Store";
import { TaskState } from "./StoreTypes";
import taskSlice from "./TaskSlice";

describe("Task State tests", () => {
    const tasks: TaskState = {
        running: [
            {
                id: "running",
                parameters: {
                    featuresPath: "testPath",
                    tags: "@TEST",
                    timeout: "10s",
                },
            },
        ],
        queued: [
            {
                id: "queued",
                parameters: {
                    featuresPath: "testPath",
                    tags: "@TEST",
                    timeout: "10s",
                },
            },
        ],
        finished: [
            {
                id: "finished",
                parameters: {
                    featuresPath: "testPath",
                    tags: "@TEST",
                    timeout: "10s",
                },
            },
        ],
    };

    it("test setTasks action", () => {
        store.dispatch(taskSlice.actions.setTasks(tasks));
        expect(store.getState().Task).toStrictEqual(tasks);
    });

    it("test removeTask action", () => {
        store.dispatch(taskSlice.actions.setTasks(tasks));
        store.dispatch(taskSlice.actions.removeTask({ id: "running", type: "running" }));
        store.dispatch(taskSlice.actions.removeTask({ id: "queued", type: "queued" }));
        store.dispatch(taskSlice.actions.removeTask({ id: "finished", type: "finished" }));
        expect(store.getState().Task).toStrictEqual({ running: [], queued: [], finished: [] });
    });

    it("test tasksOfType selector", () => {
        store.dispatch(taskSlice.actions.setTasks(tasks));
        expect(taskSlice.selectors.tasksOfType(store.getState(), "finished")).toBe(tasks.finished);
        expect(taskSlice.selectors.tasksOfType(store.getState(), "queued")).toBe(tasks.queued);
        expect(taskSlice.selectors.tasksOfType(store.getState(), "running")).toBe(tasks.running);
    });
});
