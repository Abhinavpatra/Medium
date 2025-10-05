import Avatar from "./Avatar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

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
        <div className="p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Avatar name={authorName} />
                    <div className="flex items-center pl-2">
                        <span className="text-sm font-extralight">{authorName}</span>
                        <div className="mx-2 w-1 h-1 rounded-full bg-slate-400"></div>
                        <span className="text-sm font-thin text-slate-500">{publishedDate}</span>
                    </div>
                </div>
                
                {isOwner && (
                    <Link to={`/edit/${id}`}>
                        <button 
                            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`Edit post: ${title}`}
                        >
                            Edit
                        </button>
                    </Link>
                )}
            </div>
            
            <Link to={`/blog/${id}`}>
                <div className="pt-2 text-xl font-semibold hover:text-blue-600 transition-colors cursor-pointer">
                    {title}
                </div>
                <div className="font-thin text-md text-gray-700 mt-1">
                    {content.slice(0, 100) + "..."}
                </div>
                <div className="text-slate-500 text-sm mt-2">
                    {Math.ceil(content.length / 100)} min read
                </div>
            </Link>
            
            {children}
        </div>
    );
}