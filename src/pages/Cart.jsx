import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { getCart, updateCartItem, removeFromCart } from '../services/api';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Calculate total amount
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCart();
        // Check if response.data exists and has items property
        const cartData = response.data?.items ? response.data : { items: [], total: 0 };
        // Calculate total based on current items
        cartData.total = calculateTotal(cartData.items);
        setCart(cartData);
      } catch (err) {
        setError('Failed to fetch cart. Please try again later.');
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user]);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      setLoading(true);
      if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        await removeFromCart(productId);
      } else {
        // Otherwise update the quantity
        await updateCartItem(productId, newQuantity);
      }
      const response = await getCart();
      const cartData = response.data?.items ? response.data : { items: [], total: 0 };
      // Recalculate total after update
      cartData.total = calculateTotal(cartData.items);
      setCart(cartData);
    } catch (err) {
      console.error('Error updating cart:', err);
      // You might want to show an error toast here
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setLoading(true);
      await removeFromCart(productId);
      const response = await getCart();
      const cartData = response.data?.items ? response.data : { items: [], total: 0 };
      // Recalculate total after removal
      cartData.total = calculateTotal(cartData.items);
      setCart(cartData);
    } catch (err) {
      console.error('Error removing item:', err);
      // You might want to show an error toast here
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Please log in to view your cart</h2>
            <p className="mt-2 text-gray-500">You need to be logged in to access your cart.</p>
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
            <p className="mt-4 text-gray-500">Loading cart...</p>
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

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <li key={item._id || item.product._id} className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-24 h-24">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          disabled={loading}
                          className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="mx-4 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          disabled={loading}
                          className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900">
                        ₹{item.product.price}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-900">Total</p>
                <p className="mt-1 text-sm text-gray-500">Including all taxes</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{cart.total || 0}</p>
            </div>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 