import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';

// Get user's favorites
export const getFavorites = async (req, res) => {
  try {
    console.log('Fetching favorites for user:', req.user.id);
    let favorites = await Favorite.findOne({ user: req.user.id }).populate('products');
    if (!favorites) {
      console.log('No favorites found, creating new favorites list');
      favorites = await Favorite.create({ user: req.user.id, products: [] });
    }
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
};

// Add product to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let favorites = await Favorite.findOne({ user: req.user.id });
    if (!favorites) {
      favorites = await Favorite.create({
        user: req.user.id,
        products: [productId],
      });
    } else {
      // Check if product already in favorites
      if (favorites.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in favorites' });
      }

      favorites.products.push(productId);
      await favorites.save();
    }

    favorites = await favorites.populate('products');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to favorites', error: error.message });
  }
};

// Remove product from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Removing from favorites:', productId);

    const favorites = await Favorite.findOne({ user: req.user.id });
    if (!favorites) {
      console.log('Favorites not found');
      return res.status(404).json({ message: 'Favorites not found' });
    }

    favorites.products = favorites.products.filter(
      (id) => id.toString() !== productId
    );
    await favorites.save();

    const updatedFavorites = await favorites.populate('products');
    res.json(updatedFavorites);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Error removing from favorites', error: error.message });
  }
};

// Check if product is in favorites
export const checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Checking if product is favorite:', productId);

    const favorites = await Favorite.findOne({ user: req.user.id });
    if (!favorites) {
      console.log('Favorites not found');
      return res.json({ isFavorite: false });
    }

    const isFavorite = favorites.products.includes(productId);
    console.log('Is product favorite:', isFavorite);
    res.json({ isFavorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Error checking favorite status', error: error.message });
  }
}; 