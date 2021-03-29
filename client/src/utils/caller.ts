const BASE_URL: string = process.env.REACT_APP_SERVER_URI || "http://localhost:3001";

export const post = async (endpoint: string, withCredentials: boolean, body?: string) => {
  try {
    const res = await fetch(BASE_URL + endpoint, {
      method: "POST",
      credentials: withCredentials ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": BASE_URL
      },
      body
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || res.statusText);
    return {...json, ok: true};
  } catch (error) {
    return error;
  }
}
