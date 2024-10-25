// hooks/useFetch.ts

import { useEffect, useState, useRef } from 'react';

// Define a generic type for the data being fetched
type FetchData<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>; // Function to trigger fetch
};

const useFetch = <T>(url: string): FetchData<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to store the abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async () => {
    abortControllerRef.current = new AbortController(); // Create a new AbortController for each fetch call
    const signal = abortControllerRef.current.signal;
	setData(null);
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        // Attempt to parse the error message from the response
        const errorData = await response.json(); // Use response.json() to handle JSON responses
        const errorMessage = errorData.message || 'An error occurred'; // Get the error message
        throw new Error(errorMessage); // Throw the extracted message as an error
      }

      const result: T = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        // Handle fetch abort error
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setError(err.message); // Set the server error message here
        }
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup function to abort any ongoing requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, fetchData };
};

export default useFetch;
