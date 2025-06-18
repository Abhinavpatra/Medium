import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function Appbar() {
    const { user, loading } = useUser();

    return (
        <div className="flex justify-between px-6 py-2 border-b-4">
            <Link to={'/blogs'} className="flex flex-col justify-center text-xl cursor-pointer">
                Medium
            </Link>
            <div className="flex items-center">
                <Link to={`/publish`}>
                    <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                        New
                    </button>
                </Link>
                
                <div className="flex items-center">
                    {!loading && user && (
                        <span className="mr-2 text-gray-700">{user.name || 'Anonymous'}</span>
                    )}
                    <Avatar size="big" name={user?.name || 'k'} />
                </div>
            </div>
        </div>
    );
}