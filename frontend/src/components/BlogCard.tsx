import Avatar from "./Avatar"
import { Link } from "react-router-dom"

interface BlogCardProps {
    id?: string,
    authorName: string,
    title: string,
    content: string,
    publishedDate: string,
    children?: React.ReactNode; // Add this line to accept children
    currentUserId?: string | null; // New prop
}

interface BlogCardProps {
    id?: string,
    authorId: string,
    authorName: string,
    title: string,
    content: string,
    publishedDate: string,
    children?: React.ReactNode;
    currentUserId?: string | null;
}

export default function BlogCard({
    id,
    authorId,
    authorName,
    title,
    content,
    publishedDate,
    children,
    currentUserId
}: BlogCardProps) {
    return (
        <Link to={`/blog/${id}`}>
            <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer ">
                <div className="flex">
                    <div className="flex justify-center flex-col">
                        <Avatar size={"small"} name={authorName} />
                    </div>

                    <div className="text-sm font-extralight pr-2 pl-2">
                        {authorName}
                    </div>

                    <div className="flex justify-center pr-2 flex-col">
                        <div className="h-1 w-1 text-gray-500 rounded-full bg-slate-400"></div>
                    </div>

                    <div className="text-sm font-thin text-slate-600">
                        {publishedDate}
                    </div>
                </div>
                <div className="pt-2 text-xl font-bold">
                    {title}
                </div>

                <div className="text-sm font-thin">
                    {content.slice(0, 220) + "...."}
                </div>

                <div className="pt-2 text-slate-400 text-sm font-thin">
                    {`${Math.ceil(content.length / 100)} min read`}
                </div>
                
                {children}
                {currentUserId === authorId && (
                    <Link to={`/edit/${id}`}>
                        <button className="mt-2 bg-blue-500 text-white rounded px-2 py-1">Edit</button>
                    </Link>
                )}
            </div>
        </Link>
    );
}
