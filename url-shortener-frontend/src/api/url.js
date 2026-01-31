import api from "./axios"

export const shortenUrl = async (originalUrl) => {
    const res = await api.post("/shorten", { originalUrl });
    return res.data;
};

export const fetchAnalytics = async (shortenCode) => {
    const res = await api.get(`/analytics/${shortenCode}`);
    return res.data;
};