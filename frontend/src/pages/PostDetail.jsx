import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/articles/${id}`);
                setPost(res.data);
            } catch (err) {
                console.error('Error fetching post:', err);
                // Fallback
                setPost({
                    id,
                    title: 'Sample Post',
                    content: 'This is the content of the post.',
                    image: 'https://via.placeholder.com/800x400',
                    author: 'Author Name',
                    views: 100,
                    created_at: '2023-01-01'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!post) return <div className="text-center py-10">Post not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <img
                src={post.image || 'https://via.placeholder.com/800x400?text=Post+Image'}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 mb-6 text-gray-400">
                <span>By {post.author}</span>
                <span>{post.views} views</span>
                <span>{post.created_at}</span>
            </div>
            <div className="prose prose-invert max-w-none">
                <p>{post.content}</p>
            </div>
        </div>
    );
};

export default PostDetail;