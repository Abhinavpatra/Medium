import axios from "axios";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../Config";

interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
  };
}

interface BlogsResponse {
  posts: Blog[];
}

export default function useBlogs() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogsResponse>({ posts: [] });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get<BlogsResponse>(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  return {
    blogs,
    loading,
  };
}
