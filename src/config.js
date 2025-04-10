const config = {
  apiBaseUrl: import.meta.env.PROD 
    ? 'https://gujarati-snacks-api.onrender.com/api'  // Production API URL
    : 'http://localhost:5000/api',  // Development API URL
  baseUrl: import.meta.env.PROD 
    ? '/gujarati-snacks'  // GitHub Pages base URL
    : '',  // Development base URL
  emailServiceId: 'service_2qj8j8p',
  emailTemplateId: 'template_2qj8j8p',
  emailPublicKey: '2qj8j8p'
};

export default config; 