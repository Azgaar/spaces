const BASE_URL: string = process.env.REACT_APP_SERVER_URI || "http://localhost:3001";

export const post = async (endpoint: string, body: string) => {
  const options = {method: "POST", headers: {"Content-Type": "application/json"}, body};
  try {
    const res = await fetch(BASE_URL + endpoint, options);
    const json = await res.json();
    return json;
  } catch (error) {
    return error;
  }
}
