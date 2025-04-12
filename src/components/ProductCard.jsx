import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { addToCart, addToFavorites, removeFromFavorites } from '../services/api';
import { toast } from 'react-hot-toast';
import config from '../config';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const getImagePath = (imagePath, size = 'medium') => {
    if (!imagePath) return `${config.baseUrl}/images/products/placeholder.jpg`;
    if (imagePath.startsWith('http')) return imagePath;
    
    // Extract the base name without extension
    const baseName = imagePath.replace(/\.[^/.]+$/, '');
    return `${config.baseUrl}/images/products/optimized/${baseName}-${size}.webp`;
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add to favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(product._id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(product._id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-w-1 aspect-h-1">
        <Link to={`/product/${product._id}`}>
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={getImagePath(product.image, 'small')}
              srcSet={`
                ${getImagePath(product.image, 'small')} 300w,
                ${getImagePath(product.image, 'medium')} 600w,
                ${getImagePath(product.image, 'large')} 1200w
              `}
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 1200px"
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${config.baseUrl}/images/products/placeholder.jpg`;
              }}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>
        </Link>
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
          } shadow-md hover:shadow-lg transition-all duration-300`}
        >
          <HeartIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-orange-600">₹{product.price}</span>
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 