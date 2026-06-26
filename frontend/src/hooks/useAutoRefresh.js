import { useEffect, useRef } from "react";

export function useAutoRefresh(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const timer = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(timer);
  }, [delay]);
}
