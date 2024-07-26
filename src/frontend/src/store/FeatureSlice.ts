import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeaturesState } from "./StoreTypes"

const initialFeaturesState: FeaturesState = {
    filenames: []
}

const featureSlice = createSlice({
    name: "Features",
    initialState: initialFeaturesState,
    reducers: {
        updateFileNames: (state, action: PayloadAction<FeaturesState>) => action.payload
    }
})

export default featureSlice;