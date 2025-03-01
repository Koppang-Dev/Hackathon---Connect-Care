import { useState, useEffect } from "react";

export const useApi = (endpoint, method = "GET", options = {}) => {
  const BASE_URL = "http://localhost:3000"; // Backend base URL

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);

  // Function to fetch data
  const fetchData = async (fetchOptions = {}) => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
        body: method !== "GET" ? JSON.stringify(fetchOptions.body) : null,
      });

      setResponseStatus(response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data for GET requests
  useEffect(() => {
    if (method === "GET") {
      fetchData();
    }
  }, [endpoint, method]);

  return { data, loading, error };
};
