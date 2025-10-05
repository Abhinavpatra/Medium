import Avatar from "./Avatar";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function Appbar() {
    const { user, loading } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        
        // Redirect to signin page
        navigate('/signin');
    };

    return (
        <div className="flex justify-between px-6 py-2 border-b-4">
            <Link to={'/blogs'} className="flex flex-col justify-center text-xl cursor-pointer font-semibold">
                Medium
            </Link>
            <div className="flex items-center gap-4">
                <Link to={`/publish`}>
                    <button 
                        type="button" 
                        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center transition-colors"
                    >
                        New
                    </button>
                </Link>
                
                <div className="flex items-center gap-3">
                    {!loading && user && (
                        <span className="text-gray-700 font-medium">{user.name || 'Anonymous'}</span>
                    )}
                    <Avatar size="big" name={user?.name || 'A'} />
                    
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-sm font-medium px-4 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                        aria-label="Logout"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}