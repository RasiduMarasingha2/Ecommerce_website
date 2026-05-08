import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/slices/productSlice';
import FloatingProductModel from '../components/3d/FloatingProductModel';
import TiltCard from '../components/ui/TiltCard';

const Home = () => {
  const dispatch = useDispatch();
  const filteredProducts = useSelector((state) => state.product.filteredProducts);
  const selectedCategory = useSelector((state) => state.product.selectedCategory);

  useEffect(() => {
    // Simulating API call for products. In production, replace with axios fetch.
    const mockProducts = [
      { id: 1, title: 'Pro Gaming Headset', price: 149.99, image: '', category: 'gaming' },
      { id: 2, title: 'Mechanical Keyboard XT', price: 129.00, image: '', category: 'gaming' },
      { id: 3, title: 'Wireless RGB Mouse', price: 89.50, image: '', category: 'gaming' },
      { id: 4, title: 'Elite Controller', price: 199.99, image: '', category: 'gaming' },
      { id: 5, title: 'Studio Earpods', price: 249.00, image: '', category: 'electronics' },
      { id: 6, title: 'Smart Watch Series 9', price: 399.00, image: '', category: 'electronics' },
    ];
    dispatch(setProducts(mockProducts));
  }, [dispatch]);

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
                        className="text-5xl font-black text-white tracking-tighter"
                    >
                        FLASH <span className="text-[#008000]">SALE</span>
                    </motion.h2>
                    <p className="text-gray-400 mt-2 font-medium">Up to 50% off on premium gaming gear. Limited time only!</p>
                </div>

                {/* Fake Countdown Timer */}
                <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <span className="text-2xl font-black text-[#008000]">02</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Days</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <span className="text-2xl font-black text-[#008000]">14</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hrs</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <span className="text-2xl font-black text-[#008000]">59</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mins</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
                {/* Mock Flash Sale products */}
                {filteredProducts.slice(-4).map((product, index) => (
                    <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative group">
                        <div className="absolute -top-3 -right-3 z-30 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] transform rotate-12">
                            -30%
                        </div>
                        <TiltCard product={{...product, price: (product.price * 0.7).toFixed(2)}} />
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

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