"use client";

import { useState, useEffect, useCallback } from "react";
import { GeneratedItem, LocalStorageData } from "../types";
import { showToast } from "../components/Toaster";

const STORAGE_KEY = "ideogram-clone-data";

const defaultData: LocalStorageData = {
  items: [],
  lastUpdated: new Date().toISOString(),
};

export const useLocalStorage = () => {
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: LocalStorageData = JSON.parse(stored);
        // Convert date strings back to Date objects
        const parsedItems = data.items.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
        setItems(
          parsedItems.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        );
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      showToast("Error loading saved items", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage
  const saveToStorage = useCallback((newItems: GeneratedItem[]) => {
    try {
      const data: LocalStorageData = {
        items: newItems,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      showToast("Error saving items", "error");
    }
  }, []);

  // Add new item
  const addItem = useCallback(
    (item: GeneratedItem) => {
      setItems((prev) => {
        const newItems = [item, ...prev];
        saveToStorage(newItems);
        return newItems;
      });
      // showToast(
      //   `${
      //     item.type.charAt(0).toUpperCase() + item.type.slice(1)
      //   } saved successfully!`,
      //   "success"
      // );
    },
    [saveToStorage]
  );

  // Remove item
  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const newItems = prev.filter((item) => item.id !== id);
        saveToStorage(newItems);
        return newItems;
      });
      showToast("Item deleted", "info");
    },
    [saveToStorage]
  );

  // Clear all items
  const clearAllItems = useCallback(() => {
    setItems([]);
    saveToStorage([]);
    showToast("All items cleared", "info");
  }, [saveToStorage]);

  // Get items by type
  const getItemsByType = useCallback(
    (type: string) => {
      return items.filter((item) => item.type === type);
    },
    [items]
  );

  // Get storage stats
  const getStorageStats = useCallback(() => {
    return {
      totalItems: items.length,
      posts: items.filter((item) => item.type === "post").length,
      templates: items.filter((item) => item.type === "template").length,
      images: items.filter((item) => item.type === "image").length,
    };
  }, [items]);

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    clearAllItems,
    getItemsByType,
    getStorageStats,
  };
};
