import AppBar from "../components/AppBar";
import BlogCard from "../components/BlogCard";
import SkeletonBlogs from "../components/SkeletonBlogs";
import useBlogs from "../hooks/UseBlogs";

interface Blog {
    id:string,
    title: string;
    content: string;
    author?: {
        name: string;
    };
}

export default function Blogs() {
    const { loading, blogs } = useBlogs();
    if (loading) {
        return <div>

            <SkeletonBlogs />
            <SkeletonBlogs />
            <SkeletonBlogs />
            <SkeletonBlogs />
            <SkeletonBlogs />
        </div>;
    }

    // Access the posts array from blogs
    //@ts-ignore
    const posts = blogs?.posts || [];

    return (
        <>
            <AppBar />
            <div className="flex justify-center">
                <div className="max-w-xl">
                    {posts.map((post: Blog, index: number) => (
                        <BlogCard
                            id={post.id}
                            key={index}
                            authorName={post?.author?.name || "Unknown"}
                            title={post.title}
                            content={post.content}
                            publishedDate="6th Sept 2024" // Hardcoded, update if needed
                        />
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
