import { OpenAPI as MainApi } from "./Learnup";


export default function setupOpenApi () {
    MainApi.BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";
}