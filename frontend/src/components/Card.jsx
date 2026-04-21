import { Link } from 'react-router-dom';

const Card = ({ post }) => {
    return (
        <Link to={`/posts/${post.id}`} className="block">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                <img
                    src={post.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-400 text-sm">{post.category}</p>
                    <p className="text-gray-500 text-xs mt-2">{post.created_at}</p>
                </div>
            </div>
        </Link>
    );
};

export default Card;