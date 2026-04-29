import axios from "axios";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../Config";
import { BlogDetailResponse } from "../types";

export default function useBlog({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get<BlogDetailResponse>(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: token ? { Authorization: token } : undefined,
      })
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return {
    blog,
    loading,
    error,
  };
}