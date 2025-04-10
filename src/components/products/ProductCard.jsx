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

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              <Link to={`/product/${product._id}`} className="hover:text-orange-600 transition-colors duration-200">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleFavorite}
              disabled={isLoading}
              className={`p-2 rounded-full ${
                isFavorite ? 'text-red-500' : 'text-gray-400'
              } hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="p-2 rounded-full text-gray-400 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Add to cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">₹{product.price}</p>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 