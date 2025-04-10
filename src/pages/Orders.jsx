import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/api';
import { format } from 'date-fns';
import config from '../config';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getImagePath = (imagePath) => {
    if (!imagePath) return `${config.baseUrl}/images/products/placeholder.jpg`;
    if (imagePath.startsWith('http')) return imagePath;
    return `${config.baseUrl}${imagePath}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Please log in to view your orders</h2>
            <p className="mt-2 text-gray-500">You need to be logged in to access your order history.</p>
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
            <p className="mt-4 text-gray-500">Loading orders...</p>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">My Orders</h1>
          <p className="mt-4 text-xl text-gray-500">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-2 text-gray-500">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-orange-600 to-orange-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-white">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="mt-1 text-sm text-orange-100">
                        Placed on {format(new Date(order.createdAt), 'PPP')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flow-root">
                      <ul className="-my-4 divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <li key={item._id} className="py-4 flex">
                            <div className="flex-shrink-0 w-16 h-16">
                              <img
                                src={getImagePath(item.product.image)}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `${config.baseUrl}/images/products/placeholder.jpg`;
                                }}
                              />
                            </div>
                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.product.name}</h3>
                                  <p className="ml-4">₹{item.price * item.quantity}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-gray-200 py-4">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total Amount</p>
                        <p>₹{order.totalAmount}</p>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 