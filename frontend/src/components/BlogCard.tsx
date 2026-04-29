import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSound } from "../hooks/use-sound";
import { hoverTickSound } from "../lib/hover-tick";
import { click003Sound } from "../lib/click-003";
import { select008Sound } from "../lib/select-008";

interface BlogCardProps {
  id: string;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  authorId: string;
  children?: React.ReactNode;
}

export default function BlogCard({
  id,
  authorName,
  title,
  content,
  publishedDate,
  authorId,
  children,
}: BlogCardProps) {
  const [, setCurrentUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [playHover] = useSound(hoverTickSound, { volume: 0.08 });
  const [playClick] = useSound(click003Sound, { volume: 0.5 });
  const [playSelect] = useSound(select008Sound, { volume: 0.4 });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
    setIsOwner(userId === authorId);
  }, [authorId]);

  return (
    <div
      onMouseEnter={() => playHover()}
      className="group p-6 mb-6 bg-white dark:bg-gray-300 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all duration-500 ease-spring hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={authorName} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-white">
              {authorName}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span className="text-sm text-slate-500 dark:text-white">
              {publishedDate}
            </span>
          </div>
        </div>

        {isOwner && (
          <Link to={`/edit/${id}`}>
            <button
              onClick={() => playClick()}
              className="opacity-0 group-hover:opacity-100 px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-200 rounded-full transition-all focus:outline-none"
              aria-label={`Edit post: ${title}`}
            >
              Edit
            </button>
          </Link>
        )}
      </div>

      <Link to={`/blog/${id}`} onClick={() => playSelect()}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors line-clamp-2 leading-tight">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-700 text-base leading-relaxed mb-4 line-clamp-3">
          {content}
        </p>
        <div className="flex items-center text-slate-400 dark:text-slate-500 text-sm font-medium">
          {Math.ceil(content.length / 100)} min read
        </div>
      </Link>

      {children}
    </div>
  );
}
