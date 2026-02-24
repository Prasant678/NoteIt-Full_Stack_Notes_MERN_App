import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("refresh-token")) {
            originalRequest._retry = true;

            try {
                await api.post("/user/refresh-token");
                return api(originalRequest);
            } catch (err) {
                console.log("Session expired");
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
)

export default api;