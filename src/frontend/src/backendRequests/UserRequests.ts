import { UserState } from "../store/StoreTypes";
import request from "./Request";

export default async function getUserName() {
    return (await request("username")) as UserState;
}

export async function login(username: string, password: string) {
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username,
            password,
        }),
    });
    if (response.ok) {
        const json = await response.json();
        return json;
    }
    throw new Error(`Response not ok: ${response}`);
}
