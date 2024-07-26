
import { configureStore, createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import userSlice from "./UserSlice";
import taskSlice from "./TaskSlice";
import errorSlice from "./ErrorSlice";
import featureSlice from "./FeatureSlice";
import { getFeatures } from "../backendRequests/FeaturesRequests";

export const store = configureStore({
    reducer: {
        Task: taskSlice.reducer,
        User: userSlice.reducer,
        Errors: errorSlice.reducer,
        Features: featureSlice.reducer
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const createAppSelector = createSelector.withTypes<RootState>();

export function updateFeatures() {
    getFeatures()
        .then((filenames) => { store.dispatch(featureSlice.actions.updateFileNames({filenames})) })
        .catch((error) => { store.dispatch(errorSlice.actions.addError(error)) });
}