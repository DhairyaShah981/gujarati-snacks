import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import config from '../config';

const About = () => {
  const getImagePath = (imagePath) => {
    if (!imagePath) return `${config.baseUrl}/images/team/placeholder.jpg`;
    if (imagePath.startsWith('http')) return imagePath;
    return `${config.baseUrl}${imagePath}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-orange-100">Bringing authentic Gujarati flavors to your doorstep</p>
        </div>
      </div>

      <div className="bg-white">
        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 mb-4">
                  Born from a passion for authentic Gujarati cuisine, our journey began with a simple mission: 
                  to make traditional Gujarati snacks accessible to everyone, everywhere.
                </p>
                <p className="text-gray-600">
                  What started as a small family business has grown into a trusted name in Gujarati snacks, 
                  while maintaining the same commitment to quality and authenticity that we began with.
                </p>
              </div>
              <div className="relative h-64 md:h-96">
                <img
                  src={getImagePath('/images/team/founder.jpeg')}
                  alt="Our Founder"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${config.baseUrl}/images/team/placeholder.jpg`;
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-orange-800 mb-4">Quality</h3>
                <p className="text-gray-600">
                  We use only the finest ingredients and maintain strict quality control at every step of production.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-orange-800 mb-4">Authenticity</h3>
                <p className="text-gray-600">
                  Our recipes stay true to traditional Gujarati cuisine, preserving the authentic flavors and textures.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-orange-800 mb-4">Innovation</h3>
                <p className="text-gray-600">
                  While respecting tradition, we continuously innovate to bring you new and exciting products.
                </p>
              </div>
            </div>
          </div>

          {/* Our Team */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Our Team</h2>
            <div className="flex justify-center">
              <div className="text-center max-w-md">
                <div className="w-48 h-48 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4 overflow-hidden">
                  {/* Replace this with your actual image when available */}
                  <img 
                    src="/images/team/founder.jpeg" 
                    alt="Dhairya Shah" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200x200?text=DS";
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Dhairya Shah</h3>
                <p className="text-gray-500">Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 