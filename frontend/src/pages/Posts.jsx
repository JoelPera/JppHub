import { useState, useEffect } from 'react';
import Card from '../components/Card';
import api from '../services/api';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/articles');
                setPosts(res.data);
                setFilteredPosts(res.data);
                const cats = [...new Set(res.data.map(p => p.category))];
                setCategories(cats);
            } catch (err) {
                console.error('Error fetching posts:', err);
                // Fallback
                const dummy = [
                    { id: 1, title: 'Post 1', category: 'AI', image: '', created_at: '2023-01-01' },
                    { id: 2, title: 'Post 2', category: 'Automation', image: '', created_at: '2023-01-02' },
                ];
                setPosts(dummy);
                setFilteredPosts(dummy);
                setCategories(['AI', 'Automation']);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            setFilteredPosts(posts.filter(p => p.category === selectedCategory));
        } else {
            setFilteredPosts(posts);
        }
    }, [selectedCategory, posts]);

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Posts</h1>

            {/* Filters */}
            <div className="mb-6">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => <Card key={post.id} post={post} />)}
            </div>
        </div>
    );
};

export default Posts;