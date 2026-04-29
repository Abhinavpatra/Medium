import AppBar from "../components/AppBar";
import BlogCard from "../components/BlogCard";
import SkeletonBlogs from "../components/SkeletonBlogs";
import useBlogs from "../hooks/UseBlogs";
import { BlogPost } from "../types";

export default function Blogs() {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <AppBar />
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <SkeletonBlogs />
          <SkeletonBlogs />
          <SkeletonBlogs />
        </div>
      </div>
    );
  }

  const posts = blogs.posts || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      <AppBar />
      <div className="flex justify-center pt-8 px-4">
        <div className="max-w-2xl w-full">
          {posts.map((post: BlogPost) => (
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
    </div>
  );
}
