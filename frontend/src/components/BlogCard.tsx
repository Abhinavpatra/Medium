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
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setCurrentUserId(userId);
    }, []);

    return (
        <div className="p-4 border-b border-slate-200">
            <div className="flex">
                <Avatar name={authorName} />
                <div className="flex flex-col justify-center pl-2 text-sm font-extralight">
                    {authorName}
                </div>
                <div className="flex flex-col justify-center pl-2">
                    <div className="w-1 h-1 text-gray-500 rounded-full bg-slate-400"></div>
                </div>
                <div className="flex flex-col justify-center pl-2 text-sm font-thin text-slate-500">
                    {publishedDate}
                </div>
            </div>
            <Link to={`/blog/${id}`}>
                <div className="pt-2 text-xl font-semibold">
                    {title}
                </div>
                <div className="font-thin text-md">
                    {content.slice(0, 100) + "..."}
                </div>
            </Link>
            {currentUserId === authorId && (
                <Link to={`/edit/${id}`}>
                    <button className="px-3 py-1 mt-2 text-white bg-blue-500 rounded">
                        Edit
                    </button>
                </Link>
            )}
            {children}
        </div>
    );
}
