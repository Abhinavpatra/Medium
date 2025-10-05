import AppBar from "../components/AppBar";
import BlogCard from "../components/BlogCard";
import SkeletonBlogs from "../components/SkeletonBlogs";
import useBlogs from "../hooks/UseBlogs";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import { useNavigate } from "react-router-dom";

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

export default function Blogs() {
  const { loading, blogs } = useBlogs();
  const navigate = useNavigate();
    // const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Get user ID from localStorage
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUserId(userId);
    } else {
      // If userId is not in localStorage, fetch it
      axios
        .get(`${BACKEND_URL}/api/v1/user/me`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const userId = response.data.user.id;
          localStorage.setItem("userId", userId);
          setCurrentUserId(userId);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/signin");
          }
        });
    }
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <AppBar />
        <div className="max-w-xl mx-auto">
          <SkeletonBlogs />
          <SkeletonBlogs />
          <SkeletonBlogs />
        </div>
      </div>
    );
  }

  // Access the posts array from blogs
  const posts = blogs?.posts || [];

  return (
    <>
      <AppBar />
      <div className="flex justify-center">
        <div className="max-w-xl">
          {posts.map((post: Blog) => (
            <BlogCard
              key={post.id}
              id={post.id}
              authorId={post.author?.id || post.authorId}
              authorName={post.author?.name || "Unknown"}
              title={post.title}
              content={post.content}
              publishedDate="June 18, 2025"
            />
          ))}
        </div>
      </div>
    </>
  );
}
