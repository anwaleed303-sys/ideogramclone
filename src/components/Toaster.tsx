"use client";

import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

interface ToastMessage {
  id: number;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

let toastQueue: ToastMessage[] = [];
let toastId = 0;
let showToastCallback: ((message: ToastMessage) => void) | null = null;

export const showToast = (
  message: string,
  severity: "success" | "error" | "warning" | "info" = "info"
) => {
  const toast: ToastMessage = {
    id: toastId++,
    message,
    severity,
  };

  if (showToastCallback) {
    showToastCallback(toast);
  } else {
    toastQueue.push(toast);
  }
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    showToastCallback = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);
    };

    // Process any queued toasts
    if (toastQueue.length > 0) {
      setToasts((prev) => [...prev, ...toastQueue]);
      toastQueue = [];
    }

    return () => {
      showToastCallback = null;
    };
  }, []);

  const handleClose = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={4000}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
