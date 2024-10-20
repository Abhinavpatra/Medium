import { useEffect } from "react";
import Appbar from "./AppBar";
import Avatar from "./Avatar";
interface Blog {
    post:{
    id:string,
    title: string;
    content: string;
    author: {
        name: string;
        id: string;
    };
}
}

export default function FullBlog({blog}:{blog:Blog}) {

  useEffect(()=>{
    
  })
  return <div>
    <Appbar/>
      <div className="grid grid-cols-12 w-full pt-200 px-10 max-w-screen-2xl">
          <div className="col-span-8">
            <div className="mt-2    text-5xl font-extrabold">
                 {blog.post.title} 
            </div>
            <div className="text-slate-500 pt-2">
                Posted on 12th September
            </div>
            <div className="pt-4">
                {blog.post.content}
            </div>
          </div>
          
          <div className="col-span-4 m-0 pl-0 text-slate-500">
            <div className="md-0 mt-2">Author</div>
            <div className="text-slate-700 font-bold w-full text-xl mt-2 flex items-center">


                <Avatar name={blog.post.author.name}/>
                
                <div className="ml-2 ">{blog.post.author?.name}</div>
                
            </div>
            <div className="w-full text-slate-500 text-md">
                a description of the author Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam reprehenderit asperiores quis accusamus quos, at hic voluptatem rerum, eius eos deserunt culpa illum distinctio veniam placeat ea quod molestiae sunt.
            </div>
          </div>
      </div>
    </div>
}