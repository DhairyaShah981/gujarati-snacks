# Gujarati Snacks E-commerce Website

A modern e-commerce platform for traditional Gujarati snacks, built with React and Node.js.

## Features

- 🛍️ Product browsing with category filtering and pagination
- 🛒 Shopping cart functionality
- ❤️ Favorites/Wishlist
- 👤 User authentication and profile management
- 📝 Address management
- 💳 Checkout process
- 📧 Email notifications for orders
- 🎨 Responsive design

## Tech Stack

- **Frontend:**
  - React
  - Tailwind CSS
  - React Router
  - EmailJS for notifications

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gujarati-snacks.git
   cd gujarati-snacks
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add necessary environment variables (MongoDB URI, JWT secret, etc.)

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm run dev
   ```

## Project Structure

```
gujarati-snacks/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── context/      # React context
│   └── public/           # Static assets
└── server/               # Backend Node.js application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/      # MongoDB models
    │   ├── routes/      # API routes
    │   └── middleware/  # Custom middleware
    └── config/          # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Dhairya Shah - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/gujarati-snacks](https://github.com/yourusername/gujarati-snacks)
