import axios from 'axios';

const API_URL = 'https://gujarati-snacks-api.onrender.com/api/products';

const testApi = async () => {
  try {
    console.log('Testing API connection...');
    const response = await axios.get(API_URL);
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    console.log('API is working correctly!');
    process.exit(0);
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
};

testApi(); 