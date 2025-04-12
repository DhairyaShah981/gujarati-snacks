const config = {
  apiBaseUrl: import.meta.env.PROD 
    ? 'https://gujarati-snacks-api.onrender.com/api'  // Production API URL
    : 'http://localhost:5000/api',  // Development API URL
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:10000',
  emailServiceId: 'service_2qj8j8p',
  emailTemplateId: 'template_2qj8j8p',
  emailPublicKey: '2qj8j8p',
  imageSettings: {
    quality: 80,
    format: 'webp',
    sizes: {
      thumbnail: '150x150',
      small: '300x300',
      medium: '600x600',
      large: '1200x1200'
    }
  }
};

export default config; 