import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartIcon, UserIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/gujarati-snacks/images/Logo/logo.png" 
                alt="Jigkrupa Farsan Logo" 
                className="h-16 w-auto mr-3"
              />
              <div className="flex flex-col">
                <span className="text-orange-600 text-2xl font-bold font-gujarati">જિગકૃપા ફરસાણ</span>
                <span className="text-gray-800 text-xl font-semibold">Jigkrupa Farsan</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-orange-600 border-2 border-orange-600 rounded-md'
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/favorites"
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isActive('/favorites') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  <HeartIcon className="h-6 w-6" />
                </Link>
                <Link
                  to="/cart"
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isActive('/cart') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                </Link>
                <div className="relative group">
                  <button
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      isActive('/profile') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    <UserIcon className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white px-4 py-2 rounded-md text-sm font-medium bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600 p-2 rounded-md"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-orange-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-white hover:text-orange-100 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path) ? 'bg-orange-700' : 'hover:bg-orange-500'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/favorites"
                  className={`block text-white hover:text-orange-100 px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/favorites') ? 'bg-orange-700' : 'hover:bg-orange-500'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites
                </Link>
                <Link
                  to="/cart"
                  className={`block text-white hover:text-orange-100 px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/cart') ? 'bg-orange-700' : 'hover:bg-orange-500'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart
                </Link>
                <Link
                  to="/profile"
                  className={`block text-white hover:text-orange-100 px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/profile') ? 'bg-orange-700' : 'hover:bg-orange-500'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className={`block text-white hover:text-orange-100 px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/orders') ? 'bg-orange-700' : 'hover:bg-orange-500'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-white hover:text-orange-100 px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-white hover:text-orange-100 px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 