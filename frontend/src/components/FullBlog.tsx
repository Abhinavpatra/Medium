import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Appbar from "./AppBar";
import Avatar from "./Avatar";
import { BACKEND_URL } from "../Config";
interface Blog {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string;
      id: string;
    };
    comments: Array<{
      id: number;
      content: string;
      createdAt: string;
      author: {
        id: string;
        name: string | null;
        username: string;
      };
    }>;
  };
}

export default function FullBlog({ blog }: { blog: Blog }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(blog.post.comments || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setComments(blog.post.comments || []);
  }, [blog.post.comments]);

  const characterCountClass = useMemo(() => {
    if (comment.length >= 550) {
      return "text-red-600";
    }

    if (comment.length >= 400) {
      return "text-amber-600";
    }

    return "text-slate-400";
  }, [comment.length]);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("token");
    const trimmed = comment.trim();

    if (!trimmed) {
      setError("Comment cannot be empty.");
      return;
    }

    if (trimmed.length > 600) {
      setError("Comment must be 600 characters or fewer.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog/${blog.post.id}/comments`,
        { content: trimmed },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setComments((currentComments) => [
        response.data.comment,
        ...currentComments,
      ]);
      setComment("");
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to post comment right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="grid grid-cols-12 w-full pt-200 px-10 max-w-screen-2xl">
        <div className="col-span-8 pr-8">
          <div className="mt-2    text-5xl font-extrabold">
            {blog.post.title}
          </div>
          <div className="text-slate-500 pt-2">Posted on 12th September</div>
          <div className="pt-4">{blog.post.content}</div>

          <div className="mt-10 border-t border-slate-200 pt-6">
            <div className="text-lg font-semibold text-slate-800">Comments</div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={600}
                rows={4}
                placeholder="Write a comment"
                className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-slate-400"
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={characterCountClass}>
                  {comment.length}/600 characters
                  {comment.length >= 400 ? " - getting close to the limit" : ""}
                </span>
                <button
                  onClick={handleCommentSubmit}
                  disabled={
                    submitting || !comment.trim() || comment.length > 600
                  }
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {submitting ? "Posting..." : "Post comment"}
                </button>
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-600">{error}</div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              {comments.length === 0 ? (
                <div className="text-sm text-slate-500">No comments yet.</div>
              ) : (
                comments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar name={item.author.name || item.author.username} />
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {item.author.name || item.author.username}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-700">
                      {item.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4 m-0 pl-0 text-slate-500">
          <div className="md-0 mt-2">Author</div>
          <div className="text-slate-700 font-bold w-full text-xl mt-2 flex items-center">
            <Avatar name={blog.post.author.name} />

            <div className="ml-2 ">{blog.post.author?.name}</div>
          </div>
          <div className="w-full text-slate-500 text-md">
            a description of the author Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Nam reprehenderit asperiores quis accusamus quos,
            at hic voluptatem rerum, eius eos deserunt culpa illum distinctio
            veniam placeat ea quod molestiae sunt.
          </div>
        </div>
      </div>
    </div>
  );
}
