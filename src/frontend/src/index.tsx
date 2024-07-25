import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { errorSlice, store, userSlice } from "./store/Store";

import App from "./App";
import getUserName from "./backendRequests/UserRequests";

getUserName()
    .then((user) => { store.dispatch(userSlice.actions.setUser(user)) })
    .catch((error) => { store.dispatch(errorSlice.actions.addError(error)) });
const root = createRoot(document.getElementById("app")!);
root.render(
    <>
        <Provider store={store}>
            <BrowserRouter basename={PREFIX}>
                <App />
            </BrowserRouter>
        </Provider>
    </>
);
