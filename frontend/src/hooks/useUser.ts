import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";

interface User{
    name: string;
    id: string;
}

export default function useUser(){
    const [user, setUser] = useState<User |null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            axios.get(`${BACKEND_URL}/api/v1/user/me`,{
                headers:{
                    Authorization:token
                }
            })
            .then(response=>{
                setUser(response.data.user);
            })
            .catch(error=>{
                console.error("Error fetching user data", error);
            })
            .finally(()=>{
                setLoading(false);
            });
        }
        else{
            setLoading(false);
        }

    },[]);

    return{user, loading}
}