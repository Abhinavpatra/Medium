import Avatar  from "../components/Avatar"
import { Link } from "react-router-dom"

export default function Appbar () {
    return <div className="border-b-4 flex justify-between px-6 py-2">
        <Link to={'/blogs'} className="flex flex-col text-xl justify-center cursor-pointer">
                Medium
        </Link>
        <div>
            <Link to={`/publish`} >
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
            </Link>

            <Avatar size={"big"} name="harkirat" />
        </div>
    </div>
}