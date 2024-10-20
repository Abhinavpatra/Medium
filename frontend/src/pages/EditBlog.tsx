import { useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

export default function EditBlog() {
    const { id } = useParams<{ id: string }>(); // Extract id from URL params
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then(response => {
            setTitle(response.data.post.title);
            setContent(response.data.post.content);
        })
        .catch(error => {
            console.error('Error fetching blog:', error);
        });
    }, [id]);

    const handleUpdate = () => {
        axios.put(`${BACKEND_URL}/api/v1/blog/update-post`, {
            id,
            title,
            content,
        }, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then(response => {
            console.log('Blog updated:', response.data);
            navigate(`/blog/${id}`);
        })
        .catch(error => {
            if (error.response && error.response.status === 403) {
                alert('You are not authorized to edit this post.');
            } else {
                console.error('Error updating blog:', error);
            }
        });
    };

    return (
        <>
            <input className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
            className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts here..."
            />
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdate}>Update</button>
        </>
    );
}
