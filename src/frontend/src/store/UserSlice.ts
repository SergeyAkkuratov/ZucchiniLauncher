import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./StoreTypes"

const initialUserState: UserState = {
    username: "",
    role: ""
}

const userSlice = createSlice({
    name: "User",
    initialState: initialUserState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => action.payload
    },
    selectors: {
        isAdmin: (state) => state.role === "[ROLE_ADMIN]"
    }
})

export default userSlice;