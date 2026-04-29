import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Appbar from "./AppBar";
import Avatar from "./Avatar";
import { BACKEND_URL } from "../Config";
import { useSound } from "../hooks/use-sound";
import { click003Sound } from "../lib/click-003";
import { hoverTickSound } from "../lib/hover-tick";
import { successChimeSound } from "../lib/success-chime";
import { toggle001Sound } from "../lib/toggle-001";

interface Blog {
  post: {
    id: string;
    title: string;
    content: string;
    author?: {
      name: string;
      id: string;
    };
    comments?: Array<{
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
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(blog.post.comments || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [playClick] = useSound(click003Sound, { volume: 0.5 });
  const [playHover] = useSound(hoverTickSound, { volume: 0.08 });
  const [playSuccess] = useSound(successChimeSound, { volume: 0.5 });
  const [playBack] = useSound(toggle001Sound, { volume: 0.4 });

  useEffect(() => {
    setComments(blog.post.comments || []);
  }, [blog.post.comments]);

  const characterCountClass = useMemo(() => {
    if (comment.length >= 550) {
      return "text-red-600 dark:text-red-400";
    }

    if (comment.length >= 400) {
      return "text-amber-600 dark:text-amber-400";
    }

    return "text-slate-500 dark:text-slate-400";
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

    const userId = localStorage.getItem("userId");
    const optimisticComment = {
      id: Date.now(),
      content: trimmed,
      createdAt: new Date().toISOString(),
      author: {
        id: userId || "user",
        name: null,
        username: "You"
      }
    };

    setComments((currentComments) => [optimisticComment, ...currentComments]);
    setComment("");
    setSubmitting(true);
    playClick();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog/${blog.post.id}/comments`,
        { content: trimmed },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setComments((currentComments) => 
        currentComments.map(c => 
          c.id === optimisticComment.id ? response.data.comment : c
        )
      );
      playSuccess();
    } catch (requestError: any) {
      setComments((currentComments) => 
        currentComments.filter(c => c.id !== optimisticComment.id)
      );
      setComment(trimmed);
      setError(
        requestError?.response?.data?.message ||
          "Unable to post comment right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Appbar />
      <button
        onClick={() => {
          playBack();
          navigate("/blogs");
        }}
        onMouseEnter={() => playHover()}
        className="ml-10 mt-6 flex items-center gap-2 bg-gray-400 text dark:bg-slate-100 rounded-2xl px-4 py-2 text-sm font-medium text-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-900 transition-all duration-300 tracking-wider"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5"/>
          <path d="M12 19l-7-7 7-7"/>
        </svg>
        Back to blogs
      </button>
      <div className="grid grid-cols-12 w-full pt-4 md:pt-8 px-10 max-w-screen-2xl mx-auto">
        <div className="col-span-12 md:col-span-8 md:pr-12">
          <div className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {blog.post.title}
          </div>
          <div className="text-slate-500 dark:text-slate-400 pt-2">Posted on 12th September</div>
          <div className="pt-4 text-slate-700 dark:text-slate-300">{blog.post.content}</div>

          <div className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">Comments</div>
            <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={600}
                rows={4}
                placeholder="Write a comment"
                className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-slate-400 dark:focus:border-slate-400"
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={characterCountClass}>
                  {comment.length}/600 characters
                  {comment.length >= 400 ? " - getting close to the limit" : ""}
                </span>
                <button
                  type="button"
                  onClick={()=>{
                    playClick();
                    handleCommentSubmit();
                  }}
                  disabled={
                    submitting || !comment.trim() || comment.length > 600
                  }
                  className="rounded-full bg-slate-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-slate-900 transition-colors disabled:cursor-not-allowed disabled:bg-slate-400 dark:disabled:bg-slate-600"
                >
                  {submitting ? "Posting..." : "Post comment"}
                </button>
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              {comments.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">No comments yet.</div>
              ) : (
                comments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar name={item.author.name || item.author.username} />
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {item.author.name || item.author.username}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {item.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4 m-0 pl-0 text-slate-500 dark:text-slate-400">
          <div className="md-0 mt-2">Author</div>
          <div className="text-slate-700 dark:text-slate-200 font-bold w-full text-xl mt-2 flex items-center">
            <Avatar name={blog.post.author?.name || "Unknown"} />

            <div className="ml-2 ">{blog.post.author?.name || "Unknown"}</div>
          </div>
          <div className="w-full text-slate-500 dark:text-slate-400 text-md">
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