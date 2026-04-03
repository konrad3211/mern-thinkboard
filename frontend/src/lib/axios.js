import axios from "axios";

//in production, there's no localhost so we have to make this dynamic
//jest to właściwość vite, która sprawdza czy jesteśmy w production czy dev
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

//ustawiamy tutaj base url
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
