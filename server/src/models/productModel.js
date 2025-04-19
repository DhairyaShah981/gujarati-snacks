import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: '/images/placeholder.svg',
    validate: {
      validator: function(v) {
        // Allow relative paths starting with /images/ or absolute URLs
        return /^\/images\/.*$/.test(v) || /^https?:\/\/.*$/.test(v);
      },
      message: props => `${props.value} is not a valid image path or URL`
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['farsan', 'sweets', 'snacks', 'beverages']
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product; 