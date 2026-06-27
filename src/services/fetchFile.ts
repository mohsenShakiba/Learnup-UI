import axios from "axios";
import { OpenAPI } from "../api/Learnup";

export async function getFileById (fileName: string): Promise<ArrayBuffer> {
    const token = typeof OpenAPI.TOKEN === 'function'
        ? await OpenAPI.TOKEN({ method: 'GET', url: '' })
        : OpenAPI.TOKEN;

    const res = await axios.get<ArrayBuffer>(
        `${OpenAPI.BASE}/Mobile/Files/${fileName}`,
        {
            responseType: 'arraybuffer',
            withCredentials: OpenAPI.WITH_CREDENTIALS,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
    );

    return res.data;
}
