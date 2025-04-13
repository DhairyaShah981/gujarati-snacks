import Product from '../models/Product.js';

// Update all product image paths
export const updateAllProductImages = async (req, res) => {
  try {
    const products = await Product.find();
    for (const product of products) {
      product.image = `/images/products/optimized/${product.name.toLowerCase()}-medium.webp`;
      await product.save();
    }
    res.json({ message: 'All product images updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product images' });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'name':
          sortOptions.name = 1;
          break;
        case 'price':
          sortOptions.price = 1;
          break;
        case 'price-desc':
          sortOptions.price = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1;
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Add review to product
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Add review
    product.reviews.push({
      user: req.user.id,
      rating,
      comment,
    });

    // Update product rating
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
}; 