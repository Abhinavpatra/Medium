import axios from "axios";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../Config";
import { BlogsResponse } from "../types";

export default function useBlogs() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogsResponse>({ posts: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<BlogsResponse>(`${BACKEND_URL}/api/v1/blog/bulk`)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return {
    blogs,
    loading,
    error,
  };
}