import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { addToCart, addToFavorites, removeFromFavorites, checkFavorite } from '../../services/api';

const ProductCard = ({ product, onFavoriteChange }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);

  // Check if product is in favorites when component mounts
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await checkFavorite(product._id);
          setIsFavorite(response.data.isFavorite);
        } catch (err) {
          console.error('Error checking favorite status:', err);
        }
      }
    };
    checkIfFavorite();
  }, [isAuthenticated, user, product._id]);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated || !user) {
      sessionStorage.setItem('redirectPath', window.location.pathname);
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await addToCart(product._id, 1);
      if (response.data) {
        toast.success(`Added ${product.name} to cart`, {
          duration: 2000,
          position: 'bottom-right',
          icon: '🛒',
        });
      }
    } catch (err) {
      setError('Failed to add to cart. Please try again.');
      toast.error('Failed to add to cart', {
        duration: 2000,
        position: 'bottom-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated || !user) {
      sessionStorage.setItem('redirectPath', window.location.pathname);
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      if (isFavorite) {
        const response = await removeFromFavorites(product._id);
        if (response.data) {
          setIsFavorite(false);
          // Call the callback function to notify parent component
          if (onFavoriteChange) {
            onFavoriteChange(product._id, false);
          }
          toast.success(`Removed ${product.name} from favorites`, {
            duration: 2000,
            position: 'bottom-right',
            icon: '💔',
          });
        }
      } else {
        const response = await addToFavorites(product._id);
        if (response.data) {
          setIsFavorite(true);
          // Call the callback function to notify parent component
          if (onFavoriteChange) {
            onFavoriteChange(product._id, true);
          }
          toast.success(`Added ${product.name} to favorites`, {
            duration: 2000,
            position: 'bottom-right',
            icon: '❤️',
          });
        }
      }
    } catch (err) {
      setError('Failed to update favorites. Please try again.');
      toast.error('Failed to update favorites', {
        duration: 2000,
        position: 'bottom-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.jpg';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => handleToggleFavorite(e)}
              className={`p-2 rounded-full ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              disabled={isLoading}
            >
              {isFavorite ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-orange-600">₹{product.price}</span>
            <button
              onClick={(e) => handleAddToCart(e)}
              className="flex items-center text-orange-600 hover:text-orange-700"
              disabled={isLoading}
            >
              <ShoppingCartIcon className="h-5 w-5 mr-1" />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 