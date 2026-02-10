// src/api/axios.js
import axios from "axios";
import { baseUrl } from "./Config";

const api = axios.create({
  baseURL: baseUrl+"/api",
  withCredentials: true,
});

export default api;
