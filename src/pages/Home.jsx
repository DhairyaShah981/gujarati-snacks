import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await getProducts({ limit: 4 });
        setFeaturedProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block font-gujarati text-5xl sm:text-6xl lg:text-7xl">જિગકૃપા ફરસાણ</span>
            <span className="block">Authentic Gujarati Snacks</span>
          </h1>
          <p className="mt-6 text-xl text-orange-100 max-w-3xl">
            Experience the authentic taste of Gujarat with our premium quality snacks. 
            Made with traditional recipes and shipped fresh from the heart of Gujarat to your doorstep.
          </p>
          <div className="mt-10">
            <Link
              to="/products"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-md font-medium hover:bg-orange-50 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Premium Quality</h3>
              <p className="mt-2 text-gray-500">
                Handpicked ingredients and traditional recipes ensure the best quality snacks.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Fresh & Fast Delivery</h3>
              <p className="mt-2 text-gray-500">
                Quick nationwide shipping to ensure you receive fresh snacks at your doorstep.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Customer Satisfaction</h3>
              <p className="mt-2 text-gray-500">
                Dedicated to providing the best experience with our authentic Gujarati snacks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Discover our most popular Gujarati snacks, made with love and tradition.
            </p>
          </div>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                  <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About Jigkrupa Farsan
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              We are passionate about bringing the authentic taste of Gujarat to your table. 
              Our journey began with a simple mission: to share the rich culinary heritage 
              of Gujarat with snack lovers across India.
            </p>
            <p className="mt-3 text-lg text-gray-500">
              Every snack we offer is carefully crafted using traditional recipes and 
              premium ingredients, ensuring that you get the same authentic taste that 
              has been cherished for generations in Gujarat.
            </p>
            <div className="mt-8">
              <Link
                to="/about"
                className="inline-block bg-orange-600 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-700 transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 