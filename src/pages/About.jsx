import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              About Jigkrupa Farsan
            </h1>
            <p className="mt-4 text-xl text-orange-100">
              Bringing authentic Gujarati flavors to your table since 2010
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Our Story</h2>
            <div className="prose prose-lg text-gray-500">
              <p>
                Jigkrupa Farsan was born from a passion for authentic Gujarati cuisine and a desire to share these traditional flavors with the world. What started as a small family business in 2010 has grown into a beloved name in the world of Gujarati snacks and sweets.
              </p>
              <p className="mt-4">
                Our journey began in a small kitchen in Ahmedabad, where we started making traditional farsan and sweets using age-old recipes passed down through generations. Today, we continue to maintain the same dedication to quality and authenticity, while embracing modern technology to reach customers across the country.
              </p>
            </div>
          </div>

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