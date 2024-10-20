import AppBar from "../components/AppBar";
import BlogCard from "../components/BlogCard";
import SkeletonBlogs from "../components/SkeletonBlogs";
import useBlogs from "../hooks/UseBlogs";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import { Link } from "react-router-dom";


interface Blog {
    id: string;
    title: string;
    content: string;
    author?: {
        id: string;
        name: string;
    };
}

export default function Blogs() {
    const { loading, blogs } = useBlogs();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
                headers: {
                    Authorization: token
                }
            })
            .then(response => {
                setCurrentUserId(response.data.id); // Assuming the response contains the user's ID
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
        }
    }, []);

    if (loading) {
        return (
            <div>
                <SkeletonBlogs />
                <SkeletonBlogs />
                <SkeletonBlogs />
                <SkeletonBlogs />
                <SkeletonBlogs />
            </div>
        );
    }

    // Access the posts array from blogs
    //@ts-ignore
    const posts = blogs?.posts || [];

    return (
        <>
            <AppBar />
            <div className="flex justify-center">
                <div className="max-w-xl">
                    {posts.map((post: Blog) => (
                        <BlogCard
                            id={post.id}
                            authorName={post?.author?.name || "Unknown"}
                            title={post.title}
                            content={post.content}
                            publishedDate="6th Sept 2024" // Hardcoded, update if needed
                        >
                            {currentUserId === post.author?.id && (
                                <Link to={`/edit/${post.id}`}>
                                    <button className="mt-2 bg-blue-500 text-white py-1 px-3 rounded">Edit</button>
                                </Link>
                            )}
                        </BlogCard>
                    ))}
                    {/* Example of a hardcoded blog card */}
                    <BlogCard
                        authorName="abhinav"
                        title="Blog of the day"
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae officia explicabo distinctio nesciunt tenetur quasi, placeat et nihil voluptatibus rem optio. Consequatur, ut! Debitis, praesentium quidem reprehenderit tenetur deserunt qui? lore Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae officia explicabo distinctio nesciunt tenetur quasi, placeat et nihil voluptatibus rem optio. Consequatur, ut! Debitis, praesentium quidem reprehenderit tenetur deserunt qui? lore"
                        publishedDate="6th Sept 2024"
                    />
                </div>
            </div>
        </>
    );
}
