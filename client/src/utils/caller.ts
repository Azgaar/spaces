const BASE_URL: string = process.env.REACT_APP_SERVER_URI || "http://localhost:3001";

export const post = async (endpoint: string, body: string) => {
  const options = {method: "POST", headers: {"Content-Type": "application/json"}, body};
  try {
    const data = await fetch(BASE_URL + endpoint, options);
    const json = await data.json();
    return json;
  } catch (error) {
    return error;
  }
}
