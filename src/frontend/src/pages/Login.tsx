import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { login } from "../backendRequests/UserRequests";
import { useAppDispatch } from "../store/Store";
import errorSlice from "../store/ErrorSlice";

export default function Login() {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [searchParams] = useSearchParams();

    if (searchParams.has("logout")) {
        window.location.href = `login?logout`;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await login(username, password);
        } catch (error) {
            if (error instanceof Error) {
                dispatch(
                    errorSlice.actions.addError({
                        name: "Couldn't add task",
                        message: `Couldn't add task from queue!<br>${error.message}`,
                    })
                );
            }
        }
    };
    return (
        <>
            <Form method="POST" action="/login" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="login">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={(event) => setUsername(event.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </>
    );
}
