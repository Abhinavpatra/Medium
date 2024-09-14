import { SignUpInput } from "@abhinavpatra/common"
import { useState } from "react"
import { Link,  useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../Config"


// read trpc docs
export default function Auth({ type }: { type: "signup" | "signin" }){
    const navigate=useNavigate();


    // defined the type of input, as it can take only signup or signin, and the displayed details are based on that. otherwise its copy paste in signup and signin page
    const [postInputs,setPostInputs]=useState<SignUpInput>({
        // you should have a separate thing calles SigninInput, but still this will work

        name:"",
        username:"",
        password:""

    })
    async function sendRequest(){
        try {
            const res= await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signup"?"signup":"signin"}`,postInputs)
            const jwt=res.data.jwt;
            localStorage.setItem("token",jwt)
            navigate("/blogs")
        } catch (error) {
            console.error("Failed fetching the backend info",error);
        }
        
    }
    return<>
    <div className="h-screen flex justify-center flex-col ">
        <div className="flex justify-center">
           <div>
                <div className="text-2xl font-bold">
                    {type==='signup'?"Create a new account":"Log in to your account"}
                </div>
                <div className="text-slate-400 text-sm ">
                    {type==='signup'?'Already have an account?':'Don\'t have an account?'}
                    
                    <Link className="underline  pl-2" to={type==='signin'?"/signup":"/signin"}>{type==='signin'?'Sign up':'Log in'}</Link>    
                </div>
           </div> 
                
        </div>
        <div className=" mt-7 flex flex-col  items-center ">
        {type==='signup'?<Label  label="Name" type="" placeholder="Enter your name" onChange={(e)=>setPostInputs({
                        ...postInputs,
                        name:e.target.value
                        })}/>:null}


                        <Label label="username" type="email" placeholder="email@email.com" onChange={(e)=>setPostInputs({
                        ...postInputs,
                        username:e.target.value})} />


                        <Label label="Password" type="password" placeholder="*******" onChange={(e)=>setPostInputs({
                        ...postInputs,
                        password:e.target.value})} />
                        <button onClick={sendRequest} type="button" className="mt-7 w-6/12 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type ==="signin"?"Sign in":"Sign up"}</button>
            </div>  
    </div>
    </>
}
     /**anytime the user changes something in the input, it gets the pravious value and then edits/updates the new edit, as it is next to it 
      * basically takes all the keys and values, and spreads it accross the other object, like it was.
      * we can firther edit or modify or add new details
      */
interface LabelProps{
    label: string,
    placeholder: string,
    type?:string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Label({label,placeholder, onChange, type}: LabelProps){
    return <div>
        <div>
            <label className=" mt-0 block mb-2 text-sm font-semibold text-gray-900 pt-4">{label}</label>
            <input type={type || "text"} placeholder={placeholder} onChange={onChange} id="first_name" className=" w-96 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  " required />
        </div>
    </div>

}