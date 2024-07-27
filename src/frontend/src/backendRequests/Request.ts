export default async function request(url: string, options?: RequestInit) {
    const response = await fetch(`api/${url}`, options);
    if (response.ok) {
        const json = await response.json();
        return json;
    }
    throw new Error(`Response not ok: ${response}`);
}
