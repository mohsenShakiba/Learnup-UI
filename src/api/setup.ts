import axios from "axios";
import { clearAuth, getAuthToken } from "../stores/authStore";
import { OpenAPI as MainApi } from "./Learnup";


export default function setupOpenApi () {
    MainApi.BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

    // Attach the stored JWT to every request (skipped automatically when absent/expired).
    MainApi.TOKEN = async () => getAuthToken() ?? "";

    // If the server rejects our token, drop it so the auth guard sends the user back to login.
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.response?.status === 401) {
                clearAuth();
            }
            return Promise.reject(error);
        },
    );
}
