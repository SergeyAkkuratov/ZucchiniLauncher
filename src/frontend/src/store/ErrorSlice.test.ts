import errorSlice, { MAX_ERRORS_SIZE } from "./ErrorSlice";
import { store } from "./Store";
import { ZLError } from "./StoreTypes";

describe("Redux Error state tests", () => {
    const testError: ZLError = {
        name: "TestError",
        message: "This is the test error message",
    };
    it("test addError action", () => {
        store.dispatch(errorSlice.actions.addError(testError));
        expect(store.getState().Errors.errors.at(-1)).toBe(testError);
        expect(store.getState().Errors.newError).toBeTruthy();
    });

    it("test errorShowed action", () => {
        store.dispatch(errorSlice.actions.errorShowed());
        expect(store.getState().Errors.newError).not.toBeTruthy();
    });

    it("test meximum erros", () => {
        store.dispatch(errorSlice.actions.addError({ name: "test2", message: "test2" }));
        for (let i = 0; i < MAX_ERRORS_SIZE; i += 1) {
            store.dispatch(errorSlice.actions.addError({ name: "test2", message: "test2" }));
        }
        expect(store.getState().Errors.errors.at(-1)).toStrictEqual({ name: "test2", message: "test2" });
        expect(store.getState().Errors.errors.at(0)).toStrictEqual({ name: "test2", message: "test2" });
    });

    it("test lastError selector", () => {
        store.dispatch(errorSlice.actions.addError(testError));
        expect(errorSlice.selectors.lastError(store.getState())).toBe(testError);
    });

    it("test showError selector", () => {
        store.dispatch(errorSlice.actions.addError(testError));
        expect(errorSlice.selectors.showError(store.getState())).toBeTruthy();
    });
});
