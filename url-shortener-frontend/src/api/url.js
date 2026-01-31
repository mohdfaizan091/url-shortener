import api from "./axios"

export const shortenUrl = async (originalUrl) => {
    const res = await api.post("/shorten", { originalUrl });
    return res.data;
};