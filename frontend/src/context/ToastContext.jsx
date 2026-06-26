import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = useMemo(
    () => ({
      notify(message, tone = "success") {
        setToast({ message, tone });
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <div className={`toast ${toast.tone}`}>{toast.message}</div> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
