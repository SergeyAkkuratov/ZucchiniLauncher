import * as FeatureRequests from "../backendRequests/FeaturesRequests"
import errorSlice from "./ErrorSlice";
import { store, updateFeatures } from "./Store";

describe("Common Store tests", () => {
    it("test updateFEatures function", async () => {
        jest.spyOn(FeatureRequests, "getFeatures")
            .mockReturnValueOnce(Promise.resolve(["test"]));
        await updateFeatures();
        expect(store.getState().Features.filenames).toStrictEqual(["test"]);
    })

    it("test updateFEatures function with error", async () => {
        jest.spyOn(FeatureRequests, "getFeatures")
            .mockImplementationOnce(() => Promise.reject(new Error("Test error message")));
        await updateFeatures();
        expect(errorSlice.selectors.lastError(store.getState())?.message).toBe("Test error message");
    })
})