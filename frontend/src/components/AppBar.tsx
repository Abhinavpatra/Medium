import Avatar from "./Avatar";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import SoundManager from "../utils/sounds";

export default function Appbar() {
    const { user, loading } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        SoundManager.click();
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        
        // Redirect to signin page
        navigate('/signin');
    };

    return (
        <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <Link 
                to={'/blogs'} 
                onClick={() => SoundManager.click()}
                onMouseEnter={() => SoundManager.hover()}
                className="font-display text-2xl font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors"
            >
                Medium
            </Link>
            <div className="flex items-center gap-6">
                <Link to={`/publish`}>
                    <button 
                        type="button" 
                        onClick={() => SoundManager.click()}
                        onMouseEnter={() => SoundManager.hover()}
                        className="font-sans text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-slate-200"
                    >
                        New Story
                    </button>
                </Link>
                
                <div className="flex items-center gap-4">
                    {!loading && user && (
                        <span className="text-slate-600 font-medium text-sm hidden sm:block">{user.name || 'Anonymous'}</span>
                    )}
                    <Avatar size="big" name={user?.name || 'A'} />
                    
                    <button
                        onClick={handleLogout}
                        onMouseEnter={() => SoundManager.hover()}
                        className="text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors focus:outline-none"
                        aria-label="Logout"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}