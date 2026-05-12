import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/slices/productSlice';
import FloatingProductModel from '../components/3d/FloatingProductModel';
import TiltCard from '../components/ui/TiltCard';
import axiosClient from '../api/axiosClient';

const Home = () => {
  const dispatch = useDispatch();
  const filteredProducts = useSelector((state) => state.product.filteredProducts);
  const selectedCategory = useSelector((state) => state.product.selectedCategory);
  const { userInfo } = useSelector((state) => state.auth);

  const [activeOffer, setActiveOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch real products from backend
    const fetchAllProducts = async () => {
      try {
        const { data } = await axiosClient.get('/products');
        // Transform backend product format to match TiltCard expectations if necessary
        const formattedProducts = data.map(p => ({
          id: p._id,
          title: p.title,
          price: p.price,
          image: p.images && p.images.length > 0 ? p.images[0] : '',
          category: p.category?.name || 'Uncategorized',
          inFlashSale: p.inFlashSale
        }));
        dispatch(setProducts(formattedProducts));
      } catch (error) {
        console.error('Failed to load products', error);
      }
    };
    fetchAllProducts();

    // Fetch Offers
    const fetchOffers = async () => {
      try {
        const { data } = await axiosClient.get('/admin/offers');
        const currentOffer = data.find(o => o.isActive && new Date(o.endTime) > new Date());
        if (currentOffer) {
          setActiveOffer(currentOffer);
        }
      } catch (error) {
        console.error('Failed to load offers', error);
      }
    };
    fetchOffers();

    // Fetch AI Recommendations if logged in
    const fetchRecommendations = async () => {
        if (!userInfo) return;
        try {
            const { data } = await axiosClient.get(`/recommendation/${userInfo._id}`);
            const formattedRecs = data.recommendations.map(r => ({
                id: r.product._id,
                title: r.product.title,
                price: r.product.price,
                image: r.product.images && r.product.images.length > 0 ? r.product.images[0] : '',
                category: r.product.category?.name || 'Uncategorized',
                inFlashSale: r.product.inFlashSale,
                aiScore: r.score
            }));
            setRecommendations(formattedRecs);
        } catch (error) {
            console.log("No AI recs available yet");
        }
    };
    fetchRecommendations();
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!activeOffer) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(activeOffer.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setActiveOffer(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOffer]);

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] text-black font-sans selection:bg-[#008000] selection:text-white">
      {/* 3D Hero Section */}
      <section className="relative w-full h-[90vh] overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Background 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
               <FloatingProductModel position={[0, 0, 0]} />
            </Float>
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          </Canvas>
        </div>

        {/* Foreground UI Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="text-6xl md:text-8xl font-black text-black tracking-tighter drop-shadow-sm"
          >
            NEXT GEN
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-[#008000] mt-2 tracking-tight"
          >
            GAMING EXPERIENCE
          </motion.h2>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 px-10 py-4 rounded-full bg-black text-white font-bold text-lg pointer-events-auto shadow-xl hover:bg-[#008000] hover:shadow-[0_0_25px_rgba(0,128,0,0.5)] transition-all duration-300"
          >
            Shop Now
          </motion.button>
        </div>
      </section>

      {/* AI Recommendations Section */}
      {recommendations.length > 0 && (
      <section className="relative z-20 w-full bg-[#f4f4f6] py-16 px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#f57224]/10 rounded-full flex items-center justify-center">
                        <span className="text-xl">✨</span>
                    </div>
                    <motion.h2 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl font-extrabold text-black tracking-tight"
                    >
                        Recommended For You
                    </motion.h2>
                </div>
                <span className="text-[#f57224] font-bold cursor-pointer hover:underline text-sm">See More &rarr;</span>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar">
                {recommendations.map((product, index) => (
                    <motion.div key={product.id} className="flex-shrink-0 w-72" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                        <TiltCard product={product} />
                        <div className="mt-4 text-center">
                            <span className="text-xs font-bold text-white bg-gradient-to-r from-[#f57224] to-[#d0611e] px-3 py-1.5 rounded-full shadow-sm">
                                🎯 AI Match Score: {product.aiScore}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
      )}

      {/* Best Selling Products Section */}
      <section className="relative z-20 w-full bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-extrabold text-black tracking-tight"
                >
                    Best Selling Products
                </motion.h2>
                <span className="text-[#008000] font-bold cursor-pointer hover:underline">View All &rarr;</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
                {/* Display top 4 products as Best Sellers for now */}
                {filteredProducts.slice(0, 4).map((product, index) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                        <TiltCard product={product} />
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      {activeOffer && (
      <section className="relative z-20 w-full bg-black py-24 px-8 overflow-hidden">
        {/* Neon green abstract glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#008000] rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#008000] rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                <div>
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl font-black text-white tracking-tighter uppercase"
                    >
                        {activeOffer.title || 'FLASH SALE'}
                    </motion.h2>
                    <p className="text-gray-400 mt-2 font-medium">Up to {activeOffer.discountPercentage}% off! Limited time only!</p>
                </div>

                {/* Countdown Timer */}
                <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <span className="text-2xl font-black text-[#008000]">{String(timeLeft.days).padStart(2, '0')}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Days</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <span className="text-2xl font-black text-[#008000]">{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hrs</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <span className="text-2xl font-black text-[#008000]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mins</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <span className="text-2xl font-black text-[#008000]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secs</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
                {/* Flash Sale products from database */}
                {filteredProducts.filter(p => p.inFlashSale).length > 0 ? (
                    filteredProducts.filter(p => p.inFlashSale).slice(0, 4).map((product, index) => (
                        <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative group">
                            <div className="absolute -top-3 -right-3 z-30 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] transform rotate-12">
                                -{activeOffer.discountPercentage}%
                            </div>
                            <TiltCard product={{...product, price: (product.price * (1 - activeOffer.discountPercentage / 100)).toFixed(2)}} />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-8 text-center text-gray-500 font-bold">
                        No products have been added to this flash sale yet.
                    </div>
                )}
            </div>
        </div>
      </section>
      )}

      {/* All Products Section */}
      <section id="products-section" className="relative z-20 w-full min-h-screen bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-extrabold text-black tracking-tight"
                >
                    {selectedCategory === 'all' ? 'All Products' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`}
                </motion.h2>
                <span className="text-gray-500 font-medium">{filteredProducts.length} Results</span>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <TiltCard product={product} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="w-full py-20 flex justify-center">
                    <p className="text-xl text-gray-400">No products found in this category.</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;