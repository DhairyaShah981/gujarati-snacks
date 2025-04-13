import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import config from '../config';

const About = () => {
  const getImagePath = (imagePath) => {
    if (!imagePath) {
      console.log('No image path provided, using placeholder');
      return 'https://raw.githubusercontent.com/DhairyaShah981/gujarati-snacks/main/public/images/team/placeholder.jpg';
    }
    if (imagePath.startsWith('http')) {
      console.log('Using direct URL:', imagePath);
      return imagePath;
    }
    // For GitHub images
    if (imagePath.startsWith('/images/')) {
      const url = `https://raw.githubusercontent.com/DhairyaShah981/gujarati-snacks/main/public${imagePath}`;
      console.log('Generated GitHub URL:', url);
      return url;
    }
    console.log('Using base URL:', `${config.baseUrl}${imagePath}`);
    return `${config.baseUrl}${imagePath}`;
  };

  // Test URLs
  console.log('Founder URL:', getImagePath('/images/team/founder.jpeg'));
  console.log('Cuisine URL:', getImagePath('/images/team/gujarati-cuisine.jpg'));

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
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 mb-4">
                  Born from a passion for authentic Gujarati cuisine, our journey began with a simple mission: 
                  to make traditional Gujarati snacks accessible to everyone, everywhere.
                </p>
                <p className="text-gray-600 mb-4">
                  What started as a small family business has grown into a trusted name in Gujarati snacks, 
                  while maintaining the same commitment to quality and authenticity that we began with.
                </p>
                <p className="text-gray-600">
                  Our story is deeply rooted in the rich culinary traditions of Gujarat. Each recipe we create 
                  is a celebration of our heritage, carefully crafted to bring you the authentic taste of Gujarat. 
                  From the bustling streets of Ahmedabad to your home, we bring you the true essence of Gujarati 
                  cuisine with every bite.
                </p>
              </div>
              <div className="relative h-64 md:h-96">
                <img
                  src={getImagePath('/images/team/gujarati-cuisine.jpg')}
                  alt="Gujarati Cuisine"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error('Error loading image:', e.target.src);
                    e.target.onerror = null;
                    e.target.src = 'https://raw.githubusercontent.com/DhairyaShah981/gujarati-snacks/main/public/images/team/placeholder.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-orange-800 mb-4">Quality</h3>
                <p className="text-gray-600">
                  We use only the finest ingredients and maintain strict quality control at every step of production.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-orange-800 mb-4">Authenticity</h3>
                <p className="text-gray-600">
                  Our recipes stay true to traditional Gujarati cuisine, preserving the authentic flavors and textures.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-orange-800 mb-4">Innovation</h3>
                <p className="text-gray-600">
                  While respecting tradition, we continuously innovate to bring you new and exciting products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Our Team</h2>
            <div className="flex justify-center">
              <div className="text-center max-w-md">
                <div className="w-48 h-48 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4 overflow-hidden">
                  <img 
                    src={getImagePath('/images/team/founder.jpeg')}
                    alt="Dhairya Shah" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = 'https://raw.githubusercontent.com/DhairyaShah981/gujarati-snacks/main/public/images/team/placeholder.jpg';
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Dhairya Shah</h3>
                <p className="text-gray-500">Founder & CEO</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 