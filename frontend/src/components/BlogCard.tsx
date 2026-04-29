import Avatar from "./Avatar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import SoundManager from "../utils/sounds"

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
    children
}: BlogCardProps) {
    const [, setCurrentUserId] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setCurrentUserId(userId);
        setIsOwner(userId === authorId);
    }, [authorId]);

    return (
        <div 
            onMouseEnter={() => SoundManager.hover()}
            className="group p-6 mb-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-spring hover:-translate-y-1"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Avatar name={authorName} />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">{authorName}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-sm text-slate-500">{publishedDate}</span>
                    </div>
                </div>
                
                {isOwner && (
                    <Link to={`/edit/${id}`}>
                        <button 
                            onClick={() => SoundManager.click()}
                            className="opacity-0 group-hover:opacity-100 px-4 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-all focus:outline-none"
                            aria-label={`Edit post: ${title}`}
                        >
                            Edit
                        </button>
                    </Link>
                )}
            </div>
            
            <Link to={`/blog/${id}`} onClick={() => SoundManager.click()}>
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {title}
                </h2>
                <p className="text-slate-600 text-base leading-relaxed mb-4 line-clamp-3">
                    {content}
                </p>
                <div className="flex items-center text-slate-400 text-sm font-medium">
                    {Math.ceil(content.length / 100)} min read
                </div>
            </Link>
            
            {children}
        </div>
    );
}