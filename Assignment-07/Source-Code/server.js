const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/college-ecommerce')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Product Schema with Category
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
});
const Product = mongoose.model('Product', productSchema);

// Seed extended database on startup
const seedProducts = async () => {
  try {
    await Product.deleteMany({}); // Wipe old items to refresh
    const products = [
      { name: 'Wireless Headphones', price: 2499, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: 'High quality wireless headphones with noise cancellation.', category: 'Electronics' },
      { name: 'Mechanical Keyboard', price: 3499, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', description: 'RGB mechanical keyboard with tactile blue switches.', category: 'Electronics' },
      { name: 'Gaming Mouse', price: 1499, image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500', description: 'Ergonomic gaming mouse with precision targeting.', category: 'Electronics' },
      { name: 'Smart Watch', price: 3999, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80', description: 'Fitness tracking smart watch with heart rate and sleep monitor.', category: 'Electronics' },
      { name: 'Cotton T-Shirt', price: 499, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', description: 'Classic 100% cotton casual wearing t-shirt.', category: 'Clothing' },
      { name: 'Denim Jeans', price: 1299, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80', description: 'Comfortable stretch denim jeans.', category: 'Clothing' },
      { name: 'Running Shoes', price: 2999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', description: 'Lightweight sports shoes with enhanced grip.', category: 'Footwear' },
      { name: 'Coffee Mug', price: 299, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', description: 'Ceramic mug for your perfect morning brew.', category: 'Home' },
      { name: 'Desk Lamp', price: 899, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80', description: 'Adjustable LED desk lamp for studying.', category: 'Home' },
      { name: 'Wall Clock', price: 599, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&q=80', description: 'Minimalist silent wall clock.', category: 'Home' }
    ];
    await Product.insertMany(products);
    console.log('Database seeded with new extended products');
  } catch (error) {
    console.log("Error seeding products:", error);
  }
};
seedProducts();

// API Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
