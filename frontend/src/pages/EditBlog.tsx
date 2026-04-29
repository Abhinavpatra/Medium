import { useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import Appbar from "../components/AppBar";
import { useSound } from "../hooks/use-sound";
import { click003Sound } from "../lib/click-003";
import { successChimeSound } from "../lib/success-chime";
import { error001Sound } from "../lib/error-001";

const MAX_CONTENT_LENGTH = 600;

export default function EditBlog() {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [playClick] = useSound(click003Sound, { volume: 0.5 });
    const [playSuccess] = useSound(successChimeSound, { volume: 0.5 });
    const [playError] = useSound(error001Sound, { volume: 0.4 });

    const contentLength = content.length;
    const isContentValid = contentLength > 0 && contentLength <= MAX_CONTENT_LENGTH;
    const isTitleValid = title.trim().length > 0;
    const canUpdate = isContentValid && isTitleValid && !isUpdating;
    const isOverLimit = contentLength > MAX_CONTENT_LENGTH;
    const remainingChars = MAX_CONTENT_LENGTH - contentLength;

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then(response => {
            setTitle(response.data.post.title);
            setContent(response.data.post.content);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching blog:', error);
            alert('Failed to load blog post');
            navigate('/blogs');
        });
    }, [id, navigate]);

    const handleUpdate = () => {
        if (!canUpdate) return;

        setIsUpdating(true);
        axios.put(`${BACKEND_URL}/api/v1/blog/update-post`, {
            id: Number(id),
            title,
            content,
        }, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then(response => {
            console.log('Blog updated:', response.data);
            playSuccess();
            navigate(`/blog/${id}`);
        })
        .catch(error => {
            playError();
            if (error.response && error.response.status === 403) {
                alert('You are not authorized to edit this post.');
                navigate('/blogs');
            } else {
                console.error('Error updating blog:', error);
                alert('Failed to update blog. Please try again.');
            }
            setIsUpdating(false);
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-dark">
                <Appbar />
                <div className="flex justify-center items-center h-screen">
                    <div className="text-gray-600 dark:text-gray-300 text-lg">Loading post...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-dark">
            <Appbar />
            <div className="flex justify-center pt-8">
                <div className="max-w-5xl w-full px-4">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Edit Post</h2>
                    
                    <input 
                        className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    
                    <div className="mt-4">
                        <textarea 
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 h-64 resize-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your thoughts here..."
                        />
                        
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <span className={`font-medium ${isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {contentLength} / {MAX_CONTENT_LENGTH} characters
                            </span>
                            {isOverLimit && (
                                <span className="text-red-600 dark:text-red-400 font-semibold">
                                    {Math.abs(remainingChars)} characters over limit!
                                </span>
                            )}
                            {!isOverLimit && remainingChars <= 50 && remainingChars > 0 && (
                                <span className="text-orange-500 dark:text-orange-400 font-medium">
                                    {remainingChars} characters remaining
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button 
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors ${
                                !canUpdate ? 'opacity-50 cursor-not-allowed hover:bg-blue-500' : ''
                            }`}
                            onClick={()=>{
                                playClick();
                                handleUpdate();}}
                            disabled={!canUpdate}
                        >
                            {isUpdating ? 'Updating...' : 'Update Post'}
                        </button>
                        
                        <button 
                            className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 font-bold py-2 px-6 rounded transition-colors"
                            onClick={() => {
                                navigate(`/blog/${id}`)}}
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                </div>
            </div>
    );
}