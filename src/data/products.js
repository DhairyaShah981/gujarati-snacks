export const products = [
  {
    id: 1,
    name: 'Traditional Khakhra',
    description: 'Crispy, thin, and crunchy flatbread made from whole wheat flour and spices.',
    price: 199,
    category: 'Khakhra',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6254803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Masala Chevdo',
    description: 'A savory mix of puffed rice, nuts, and spices, perfect for snacking.',
    price: 149,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6254803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.3,
    reviews: 95,
  },
  {
    id: 3,
    name: 'Bhakharwadi',
    description: 'Spicy and crispy rolled snack made with gram flour and spices.',
    price: 179,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6254803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: 'Methi Thepla',
    description: 'Soft flatbread made with fenugreek leaves and spices.',
    price: 169,
    category: 'Thepla',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6254803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.4,
    reviews: 112,
  },
  {
    id: 5,
    name: 'Gujarati Kadhi',
    description: 'Traditional Gujarati curry made with yogurt and gram flour.',
    price: 199,
    category: 'Curries',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6254803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 6,
    name: 'Farsaan Mix',
    description: 'Assorted Gujarati snacks including sev, gathiya, and more.',
    price: 249,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6254803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    reviews: 167,
  },
  {
    id: 7,
    name: 'Handvo',
    description: 'Savory cake made with rice, lentils, and vegetables.',
    price: 189,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6254803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.2,
    reviews: 76,
  },
  {
    id: 8,
    name: 'Khaman Dhokla',
    description: 'Steamed savory cake made with gram flour and spices.',
    price: 159,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6254803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    reviews: 143,
  },
];

export const categories = [
  'All',
  'Khakhra',
  'Snacks',
  'Thepla',
  'Curries',
];

export const filters = {
  priceRanges: [
    { label: 'Under ₹150', min: 0, max: 150 },
    { label: '₹150 - ₹200', min: 150, max: 200 },
    { label: 'Over ₹200', min: 200, max: Infinity },
  ],
  ratings: [5, 4, 3, 2, 1],
}; 