import { useState } from "react";

const STORAGE_KEY = "lnk_history";

const load = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useLinkHistory = () => {
  const [history, setHistory] = useState(load);

  const addToHistory = (data) => {
    setHistory((prev) => {
      const entry = { ...data, createdAt: new Date().toISOString() };
      const updated = [entry, ...prev].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addToHistory, clearHistory };
};