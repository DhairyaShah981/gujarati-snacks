import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { addToCart, addToFavorites, removeFromFavorites } from '../services/api';
import { toast } from 'react-hot-toast';
import config from '../config';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    try {
      setIsAddingToFavorites(true);
      if (isFavorite) {
        await removeFromFavorites(product._id);
      } else {
        await addToFavorites(product._id);
      }
      setIsFavorite(!isFavorite);
      // Show success toast
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Show error toast
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // Get the correct image path based on environment
  const getImagePath = (imagePath) => {
    if (!imagePath) return '/images/products/placeholder.jpg';
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // For local images, prepend the base URL in production
    return import.meta.env.PROD ? `${config.baseUrl}${imagePath}` : imagePath;
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        disabled={isAddingToFavorites}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
      >
        {isFavorite ? (
          <HeartIconSolid className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
        )}
      </button>

      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block aspect-w-1 aspect-h-1">
        <div className="relative pb-[100%]">
          <img
            src={getImagePath(product.image)}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/products/placeholder.jpg';
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">₹{product.price}</p>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 