
import Publish from "./Publish";
import useBlog from "../hooks/UseBlog";

export default function EditBlog({id}:{id:string}) {
    //@ts-ignore
   const {blog,loading}=useBlog({id:id});

   if(loading){
    return <div>Loading</div>
   }
   return<>
   <Publish/>

   </>
}