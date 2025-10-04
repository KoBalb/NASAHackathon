import { useEffect, useState } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // очистка попереднього таймера
  }, [value, delay]);

  return debounced;
}

export default useDebounce; 