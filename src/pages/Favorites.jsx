import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFavorites();
        // Check if response.data exists and has products property
        const products = response.data?.products || response.data || [];
        setFavorites(products);
      } catch (err) {
        setError('Failed to fetch favorites. Please try again later.');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  // Handle favorite status change
  const handleFavoriteChange = (productId, isFavorite) => {
    if (!isFavorite) {
      // If item is removed from favorites, remove it from the favorites list
      setFavorites(prevFavorites => 
        prevFavorites.filter(product => product._id !== productId)
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Please log in to view your favorites</h2>
            <p className="mt-2 text-gray-500">You need to be logged in to access your favorites.</p>
            <Link
              to="/login"
              className="mt-6 inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't added any favorites yet.</p>
            <Link
              to="/products"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {favorites.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 