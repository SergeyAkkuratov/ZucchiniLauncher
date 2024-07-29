import { store } from "./Store";
import userSlice from "./UserSlice";

describe("User state tests", () => {
    it("test setUSer action", () => {
        store.dispatch(userSlice.actions.setUser({ username: "test", role: "[ROLE_TEST]" }));
        expect(store.getState().User.username).toBe("test");
    });

    it("test isADmin selector", () => {
        store.dispatch(userSlice.actions.setUser({ username: "test", role: "[ROLE_TEST]" }));
        expect(userSlice.selectors.isAdmin(store.getState())).not.toBeTruthy();
        store.dispatch(userSlice.actions.setUser({ username: "test", role: "[ROLE_ADMIN]" }));
        expect(userSlice.selectors.isAdmin(store.getState())).toBeTruthy();
    });
});
