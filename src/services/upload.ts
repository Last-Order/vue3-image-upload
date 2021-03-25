import axios, { AxiosInstance } from "axios";
interface UploadParams {
    file: File;
    onProgress: (progress: number) => void;
}
class UploadService {
    private client: AxiosInstance;
    constructor() {
        this.client = axios.create({
            baseURL: "/API",
        });
    }

    async uploadFile({ file, onProgress }: UploadParams) {
        const form = new FormData();
        form.append("file", file);
        return (await this.client.post("/upload", form, {
            onUploadProgress: (e: ProgressEvent) => {
                const percentCompleted = Math.round((e.loaded * 100) / e.total);
                onProgress(percentCompleted);
            },
        })).data;
    }
}

export default new UploadService();
