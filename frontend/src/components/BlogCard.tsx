import Avatar from "./Avatar"
import { Link } from "react-router-dom"

interface BlogCardProps {
    id?: string,
    authorName: string,
    title: string,
    content: string,
    publishedDate: string
}
export default function BlogCard({
    id,
    authorName,
    title,
    content,
    publishedDate
}:BlogCardProps) {
    return <Link to={`/blog/${id}`}>
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer ">
        

        <div className="flex">

                    <div className="flex justify-center flex-col">
                        <Avatar size={"small"} name={authorName}/>
                    </div>

                    <div className="text-sm font-extralight pr-2 pl-2">
                        {authorName}
                    </div> 

                    <div className="flex justify-center pr-2 flex-col">
                        
                        <div className="  h-1 w-1 text-gray-500 rounded-full bg-slate-400 "></div>
                    </div>

                    <div className=" text-sm font-thin text-slate-600">
                        {publishedDate}
                    </div>
                    
        </div>
        <div className=" pt-2 text-xl font-bold">
            {title}
        </div>

        <div className="text-sm font-thin">
            {content.slice(0, 220)+"...."}
        </div>
        
        <div className="pt-2 text-slate-400 text-sm font-thin">
            {`${Math.ceil(content.length/100)} min read`}
        </div>
    
    </div>
</Link>
}