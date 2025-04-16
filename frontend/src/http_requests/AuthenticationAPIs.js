import axios from "axios";

const path = "/auth";

export async function signup({ name, username, email, password }) {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}${path}/signup`, // api endpoint
    { name: name, username: username, password: password, email: email }, // fields passed in HTTP body
    { headers: { "Content-Type": "application/json" } } // HTTP header(s)
  );
  return response;
}

export async function login({ username, password }) {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}${path}/login`, // api endpoint
    {  username: username, password: password }, // fields passed in HTTP body
    { headers: { "Content-Type": "application/json" } } // HTTP header(s)
  );
  return response;
}