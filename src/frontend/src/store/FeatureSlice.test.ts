import featureSlice from "./FeatureSlice"
import { store } from "./Store"

describe("Feature state tests", () => {
    it("test updateFileNames action", () =>{
        store.dispatch(featureSlice.actions.updateFileNames({filenames: ["test"]}));
        expect(store.getState().Features.filenames.at(-1)).toBe("test");
    })
})