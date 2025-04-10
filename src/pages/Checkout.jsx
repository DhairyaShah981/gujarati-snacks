import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart, createOrder } from '../services/api';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCart();
        const cartData = response.data?.items ? response.data : { items: [], total: 0 };
        setCart(cartData);
        
        // Set default address if available
        if (user?.addresses?.length > 0) {
          const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
          setSelectedAddress(defaultAddress);
        }
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

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setPlacingOrder(true);
      
      // Create order
      const orderData = {
        shippingAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
        },
        paymentMethod: 'cash_on_delivery',
      };
      
      const orderResponse = await createOrder(orderData);
      
      // Prepare order items list for email
      const orderItemsList = cart.items.map(item => 
        `${item.product.name} - Qty: ${item.quantity} - ₹${item.product.price * item.quantity}`
      ).join('\n');
      
      // Send order confirmation email
      await emailjs.send(
        'service_rp0782i',
        'template_tr8ak6u',
        {
          to_email: user.email,
          from_name: 'Jigkrupa Farsan',
          from_email: 'info@jigkrupafarsan.com',
          subject: 'Order Confirmation',
          message: `Dear ${user.firstName} ${user.lastName},

Thank you for your order! Your order has been successfully placed.

Order Details:
-------------
Order ID: ${orderResponse.data._id}
Order Date: ${new Date().toLocaleDateString()}

Items Ordered:
${orderItemsList}

Shipping Address:
${selectedAddress.street}
${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}

Payment Method: Cash on Delivery
Total Amount: ₹${cart.total}

We will process your order soon.

Best regards,
Jigkrupa Farsan Team`,
        },
        'PetqFRmfT0ag19QmD'
      );
      
      toast.success('Order placed successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Please log in to checkout</h2>
            <p className="mt-2 text-gray-500">You need to be logged in to complete your purchase.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              Log In
            </button>
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
            <p className="mt-4 text-gray-500">Loading checkout...</p>
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
            <button
              onClick={() => navigate('/products')}
              className="mt-6 inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Details & Address */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Details */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-orange-600 to-orange-500">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Customer Information
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.phoneNumber || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-orange-600 to-orange-500">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Delivery Address
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-4">
                    {user.addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`border rounded-lg p-4 ${
                          selectedAddress?._id === address._id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`address-${address._id}`}
                              name="address"
                              type="radio"
                              checked={selectedAddress?._id === address._id}
                              onChange={() => setSelectedAddress(address)}
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                            />
                          </div>
                          <div className="ml-3">
                            <label
                              htmlFor={`address-${address._id}`}
                              className="text-sm font-medium text-gray-900"
                            >
                              {address.street}
                              <br />
                              {address.city}, {address.state} {address.zipCode}
                            </label>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No addresses found.</p>
                    <button
                      onClick={() => navigate('/profile')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-orange-600 to-orange-500">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Payment Method
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex items-center">
                  <input
                    id="cash-on-delivery"
                    name="payment-method"
                    type="radio"
                    checked={true}
                    disabled={true}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <label
                    htmlFor="cash-on-delivery"
                    className="ml-3 block text-sm font-medium text-gray-900"
                  >
                    Cash on Delivery
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Pay with cash upon delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg sticky top-4">
              <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-orange-600 to-orange-500">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Order Summary
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flow-root">
                  <ul className="-my-4 divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item._id || item.product._id} className="py-4 flex">
                        <div className="flex-shrink-0 w-16 h-16">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.product.name}</h3>
                              <p className="ml-4">₹{item.product.price * item.quantity}</p>
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
                    <p>Subtotal</p>
                    <p>₹{cart.total}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <p>Shipping</p>
                    <p>Free</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                    <p>Total</p>
                    <p>₹{cart.total}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder || !selectedAddress}
                    className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                      (placingOrder || !selectedAddress) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {placingOrder ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 