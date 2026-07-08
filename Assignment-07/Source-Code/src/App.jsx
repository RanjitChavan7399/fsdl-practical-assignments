import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Plus, Trash2, ArrowLeft, User } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setUser({ name: 'Guest User' });
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    if (!user) {
      alert("Please login first to add items to your cart!");
      setShowAuth(true);
      return;
    }
    setCart([...cart, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  // Derive categories and filtered products
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Auth Screen
  if (showAuth) {
    return (
      <div className="container">
        <nav className="navbar glass">
          <div className="logo" onClick={() => setShowAuth(false)}>
            <Package size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            PremiumCart
          </div>
          <div className="nav-links">
            <button onClick={() => setShowAuth(false)}>
              <ArrowLeft size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Back to Shop
            </button>
          </div>
        </nav>
        
        <div className="auth-container">
          <div className="glass auth-card">
            <h2>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
            <form onSubmit={handleAuth}>
              {!isLoginView && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="" required />
                </div>
              )}
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="" required />
              </div>
              <button type="submit" className="btn-primary">
                {isLoginView ? 'Login' : 'Sign Up'}
              </button>
            </form>
            <button 
              className="toggle-auth" 
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cart Screen
  if (showCart) {
    return (
      <div className="container">
        <nav className="navbar glass">
          <div className="logo" onClick={() => setShowCart(false)}>
            <Package size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            PremiumCart
          </div>
          <div className="nav-links">
            <button onClick={() => setShowCart(false)}>
              <ArrowLeft size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Back to Shop
            </button>
          </div>
        </nav>
        
        <div className="cart-wrapper">
          <div className="glass cart-container">
            <h2>Your Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="empty-state">
                <ShoppingCart size={48} style={{ opacity: 0.5, marginBottom: '1rem', display: 'inline-block' }} />
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet.</p>
              </div>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="cart-item glass">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <span className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button className="remove-btn" title="Remove" onClick={() => removeFromCart(index)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <div className="cart-total">
                  Total: ₹{cartTotal.toLocaleString('en-IN')}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Shop Screen
  return (
    <div className="container">
      <nav className="navbar glass">
        <div className="logo">
          <Package size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          PremiumCart
        </div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <button onClick={handleLogout} title="Logout">
              <User size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Logout ({user.name})
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)}>
              <User size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Login
            </button>
          )}
          <button className="cart-btn" onClick={() => setShowCart(true)}>
            <ShoppingCart size={18} />
            {cart.length} Items
          </button>
        </div>
      </nav>

      {/* Category Filter Menu */}
      {!loading && products.length > 0 && (
        <div className="category-menu">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading products...</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card glass">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                {product.category && (
                  <span className="category-badge">{product.category}</span>
                )}
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                  <button className="add-btn" title="Add to Cart" onClick={() => addToCart(product)}>
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              No products found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
