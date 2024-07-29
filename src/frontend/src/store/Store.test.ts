import * as FeatureRequests from "../backendRequests/FeaturesRequests"
import * as TaskRequests from "../backendRequests/TasksRequests"
import errorSlice from "./ErrorSlice";
import { store, updateFeatures, updateTasks } from "./Store";

describe("Common Store tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("test updateFeatures function", async () => {
        jest.spyOn(FeatureRequests, "getFeatures")
            .mockReturnValueOnce(Promise.resolve(["test"]));
        await updateFeatures();
        expect(store.getState().Features.filenames).toStrictEqual(["test"]);
    });

    it("test updateFeatures function with error", async () => {
        jest.spyOn(FeatureRequests, "getFeatures")
            .mockImplementationOnce(() => Promise.reject(new Error("Test error message")));
        await updateFeatures();
        expect(errorSlice.selectors.lastError(store.getState())?.message).toBe("Test error message");
    });

    it("test updateTasks function", async () => {
        jest.spyOn(TaskRequests, "getTasks")
            .mockReturnValueOnce(Promise.resolve({
                running: [], queued: [], finished: [{
                    id: "running",
                    parameters: {
                        featuresPath: "testPath",
                        tags: "@TEST",
                        timeout: "10s"
                    }
                }]
            }));
        await updateTasks();
        expect(store.getState().Task.finished[0]).toStrictEqual({
            id: "running",
            parameters: {
                featuresPath: "testPath",
                tags: "@TEST",
                timeout: "10s"
            }
        });
    });

    it("test updateTasks function with error", async () => {
        jest.spyOn(TaskRequests, "getTasks")
            .mockImplementationOnce(() => Promise.reject(new Error("Test error message")));
        await updateTasks();
        expect(errorSlice.selectors.lastError(store.getState())?.message).toBe("Test error message");
    });
})