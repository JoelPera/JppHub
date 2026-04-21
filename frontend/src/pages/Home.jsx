import { useState, useEffect } from 'react';
import Card from '../components/Card';
import api from '../services/api';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/articles');
                setPosts(res.data);
            } catch (err) {
                console.error('Error fetching posts:', err);
                // Fallback dummy data
                setPosts([
                    { id: 1, title: 'Introduction to AI', category: 'AI', image: 'https://via.placeholder.com/300', created_at: '2023-01-01' },
                    { id: 2, title: 'Automation Tools', category: 'Automation', image: 'https://via.placeholder.com/300', created_at: '2023-01-02' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center py-10">Loading...</div>;

    const featured = posts[0];
    const trending = posts.slice(0, 5);
    const latest = posts.slice(5, 10);

    return (
        <div className="space-y-8">
            {/* Hero Banner */}
            {featured && (
                <section className="relative">
                    <img
                        src={featured.image || 'https://via.placeholder.com/1200x400?text=Featured+Post'}
                        alt={featured.title}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">{featured.title}</h1>
                            <p className="text-xl">{featured.category}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Trending */}
            <section>
                <h2 className="text-2xl font-bold mb-4">🔥 Trending</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
                    {trending.map(post => <Card key={post.id} post={post} />)}
                </div>
            </section>

            {/* Latest */}
            <section>
                <h2 className="text-2xl font-bold mb-4">🆕 Latest</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {latest.map(post => <Card key={post.id} post={post} />)}
                </div>
            </section>

            {/* AI Tools */}
            <section>
                <h2 className="text-2xl font-bold mb-4">🤖 AI Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {posts.filter(p => p.category === 'AI').map(post => <Card key={post.id} post={post} />)}
                </div>
            </section>
        </div>
    );
};

export default Home;