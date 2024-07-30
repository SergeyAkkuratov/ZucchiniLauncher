export default async function request(url: string, options?: RequestInit) {
    const response = await fetch(`http://localhost:8080/api/${url}`, options);
    if (response.ok) {
        const json = await response.json();
        return json;
    }
    throw new Error(`Response not ok: ${response}`);
}
