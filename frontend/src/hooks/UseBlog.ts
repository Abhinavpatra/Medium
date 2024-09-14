import axios from "axios";
import { useState,useEffect } from "react";
import { BACKEND_URL } from "../Config";

interface Blog {
    post:{
    id:string,
    title: string;
    content: string;
    author: {
        name: string;
    };
}
}

export default function useBlog({id}:{id:string}){
    const[loading, setLoading] = useState(true);
    const[blog,setBlog]=useState<Blog>({} as Blog);
     
    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }

        }) 
        .then((res)=>{
            setBlog(res.data)
            setLoading(false);
            
        })
    },[])
    return{
        blog,
        loading
    }
}