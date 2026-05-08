import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter, setSearchQuery } from '../../redux/slices/productSlice';
import { removeFromCart } from '../../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedCategory = useSelector((state) => state.product.selectedCategory);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const navItems = [
    { label: 'All Products', value: 'all' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Electronics', value: 'electronics' },
  ];

  const handleFilterClick = (value) => {
    dispatch(setCategoryFilter(value));
    if (window.location.pathname !== '/') {
        navigate('/');
        // Use a short timeout to let the page render before scrolling
        setTimeout(() => {
            const section = document.getElementById('products-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        const section = document.getElementById('products-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="text-2xl font-extrabold tracking-tighter text-black">
              E<span className="text-[#008000]">COMMERCE</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleFilterClick(item.value)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === item.value
                    ? 'text-[#008000]'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {item.label}
                {selectedCategory === item.value && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#008000] rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
             {/* Search Toggle / Input */}
             <div className="flex items-center">
                 {isSearchOpen && (
                     <motion.input 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 200, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        type="text"
                        placeholder="Search products..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:border-[#008000] text-black mr-2"
                     />
                 )}
                 <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-700 hover:text-[#008000] transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </button>
             </div>

             <button onClick={() => setIsCartOpen(true)} className="text-gray-700 hover:text-[#008000] transition-colors relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-[#008000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                )}
             </button>
             
             {userInfo ? (
                <button onClick={() => navigate('/user')} className="text-sm font-bold text-gray-700 hover:text-[#008000]">
                    {userInfo.name}
                </button>
             ) : (
                <button onClick={() => navigate('/login')} className="bg-black hover:bg-[#008000] hover:shadow-[0_0_15px_rgba(0,128,0,0.5)] text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300">
                    Sign In
                </button>
             )}
          </div>

        </div>
      </div>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
      )}

      {/* Cart Drawer */}
      <motion.div
          initial={{ x: '100%' }}
          animate={{ x: isCartOpen ? '0%' : '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-full md:w-[400px] h-screen bg-white shadow-2xl z-[70] flex flex-col border-l border-gray-100"
      >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      <p className="text-gray-500 font-medium">Your cart is empty.</p>
                      <button onClick={() => setIsCartOpen(false)} className="mt-6 text-[#008000] font-bold hover:underline">Continue Shopping</button>
                  </div>
              ) : (
                  <div className="space-y-6">
                      {cartItems.map((item, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                  {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" /> : <span className="text-xs text-gray-400 font-bold">IMAGE</span>}
                              </div>
                              <div className="flex-1">
                                  <h4 className="font-bold text-sm text-black">{item.title}</h4>
                                  <p className="text-[#008000] font-bold mt-1">${item.price}</p>
                                  <div className="flex justify-between items-center mt-2">
                                      <span className="text-xs text-gray-500 font-medium">Qty: {item.qty}</span>
                                      <button onClick={() => dispatch(removeFromCart(item.id))} className="text-xs text-red-500 font-bold hover:underline">Remove</button>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-gray-500">Subtotal</span>
                      <span className="font-black text-xl text-black">
                          ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                      </span>
                  </div>
                  <button className="w-full py-4 rounded-xl bg-black text-white font-bold hover:bg-[#008000] hover:shadow-[0_0_20px_rgba(0,128,0,0.3)] transition-all duration-300">
                      Proceed to Checkout
                  </button>
              </div>
          )}
      </motion.div>
    </nav>
  );
};

export default Topbar;