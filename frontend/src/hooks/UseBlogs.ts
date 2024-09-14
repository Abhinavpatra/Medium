import axios from "axios";
import { useState,useEffect } from "react";
import { BACKEND_URL } from "../Config";


export default function useBlogs(){
    const[loading, setLoading] = useState(true);
    const[blogs,setBlogs]=useState([]);
    
    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }

        }) 
        .then((res)=>{
            setBlogs(res.data)
            setLoading(false);
            
        })
    },[])
    return{
        blogs,
        loading
    }
}


