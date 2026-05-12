import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShare2, FiMessageCircle, FiShoppingCart, FiMinus, FiPlus, FiStar, FiTruck, FiShield, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import axiosClient from '../api/axiosClient';
import { addToCart } from '../redux/slices/cartSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    
    // Selection States
    const [qty, setQty] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const { data } = await axiosClient.get(`/products/${id}`);
                setProduct(data.product);
                setReviews(data.reviews);
                if (data.product.images?.length > 0) setActiveImage(data.product.images[0]);
                if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
                if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);

                // Fetch related
                const relatedRes = await axiosClient.get(`/products/${id}/related`);
                setRelatedProducts(relatedRes.data);
            } catch (error) {
                toast.error("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            id: product._id,
            title: product.title,
            price: product.price * (1 - (product.discount || 0) / 100),
            image: product.images[0],
            qty,
            seller: product.seller?._id,
            selectedColor,
            selectedSize
        }));
        
        // If logged in, we could trigger a backend sync here.
        if (userInfo) {
             axiosClient.post('/cart', {
                 cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
                 totalPrice: 0 // Optional recalc
             }).catch(e => console.error("Sync error", e));
        }
        
        toast.success(`${qty}x ${product.title} added to cart!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart'); // Or checkout page
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Product not found.</div>;
    }

    const currentPrice = product.price * (1 - (product.discount || 0) / 100);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#f4f4f6] font-sans selection:bg-green-500 selection:text-white">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
                    <Link to="/" className="hover:text-green-600 transition">Home</Link>
                    <span>/</span>
                    <span className="capitalize">{product.category?.name || 'Category'}</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate w-32 md:w-auto">{product.title}</span>
                </div>

                {/* Main 3-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* LEFT COLUMN: Gallery */}
                    <div className="w-full lg:w-1/3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 group cursor-crosshair">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    src={activeImage || 'https://via.placeholder.com/500'} 
                                    alt={product.title}
                                    className="w-full h-full object-contain group-hover:scale-150 transition-transform duration-500 origin-center"
                                />
                            </AnimatePresence>
                            {product.inFlashSale && (
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                                    FLASH SALE
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {product.images?.map((img, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setActiveImage(img)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-green-500 shadow-md scale-105' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CENTER COLUMN: Product Info & Actions */}
                    <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">
                            {product.title}
                        </h1>
                        
                        <div className="flex items-center gap-4 text-sm mb-4">
                            <div className="flex items-center text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={i < Math.round(product.ratings || 0) ? "fill-current" : "text-gray-300"} />
                                ))}
                                <span className="text-gray-500 ml-2 font-medium">({product.numReviews} Reviews)</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <span className="text-gray-500">Brand: <span className="font-bold text-gray-800">Generic</span></span>
                        </div>

                        <div className="bg-gray-50/50 p-4 rounded-xl mb-6 border border-gray-100">
                            <div className="flex items-end gap-3 mb-1">
                                <span className="text-4xl font-black text-[#f57224]">${currentPrice.toFixed(2)}</span>
                                {product.discount > 0 && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through mb-1">${product.price.toFixed(2)}</span>
                                        <span className="text-sm font-bold text-white bg-red-500 px-2 py-0.5 rounded mb-1">-{product.discount}%</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Variants */}
                        {product.colors?.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Color Family</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 border rounded-md font-medium text-sm transition-all ${selectedColor === color ? 'border-[#f57224] text-[#f57224] bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes?.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded-md font-medium text-sm transition-all ${selectedSize === size ? 'border-[#f57224] text-[#f57224] bg-orange-50' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50" disabled={qty <= 1}>
                                        <FiMinus />
                                    </button>
                                    <span className="w-12 text-center font-bold">{qty}</span>
                                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50" disabled={qty >= product.stock}>
                                        <FiPlus />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">{product.stock > 0 ? `Only ${product.stock} items left` : <span className="text-red-500 font-bold">Out of Stock</span>}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-auto">
                            <button onClick={handleBuyNow} disabled={product.stock === 0} className="flex-1 bg-[#2abbe8] text-white py-3 rounded-md font-bold text-lg hover:bg-[#25a5d8] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                Buy Now
                            </button>
                            <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 bg-[#f57224] text-white py-3 rounded-md font-bold text-lg hover:bg-[#d0611e] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FiShoppingCart /> Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Delivery & Seller */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        
                        {/* Delivery Info */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Delivery Options</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <FiTruck className="text-xl text-gray-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Standard Delivery</p>
                                        <p className="text-xs text-gray-500 mt-1">3 - 5 Working Days</p>
                                    </div>
                                    <span className="ml-auto font-bold text-sm">$4.99</span>
                                </div>
                                <div className="flex gap-3">
                                    <FiCheckCircle className="text-xl text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Cash on Delivery Available</p>
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="my-4 border-gray-100" />
                            
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Return & Warranty</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <FiShield className="text-xl text-gray-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">14 Days Free Return</p>
                                        <p className="text-xs text-gray-500 mt-1">Change of mind is not applicable</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FiShield className="text-xl text-gray-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">1 Year Local Warranty</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seller Info */}
                        {product.seller && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sold By</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-xl text-gray-400">
                                        {product.seller.storeName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 flex items-center gap-2">
                                            {product.seller.storeName}
                                            {product.seller.sellerVerification === 'approved' && <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase">Verified</span>}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <FiStar className="text-yellow-500 fill-current" />
                                                <span className="font-bold text-gray-700">92%</span> Positive
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 text-sm font-bold text-[#2abbe8] border border-[#2abbe8] rounded-md hover:bg-[#2abbe8]/5 transition-colors">
                                        Visit Store
                                    </button>
                                    <button className="flex-1 py-2 text-sm font-bold text-white bg-[#2abbe8] rounded-md hover:bg-[#25a5d8] transition-colors flex items-center justify-center gap-2">
                                        <FiMessageCircle /> Chat
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Quick Actions */}
                        <div className="flex justify-between items-center px-4">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-medium text-sm group">
                                <FiHeart className="group-hover:fill-current" /> Add to Wishlist
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium text-sm">
                                <FiShare2 /> Share
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Product Description */}
                <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-6 border-b pb-4">Product Description</h2>
                    <div className="prose max-w-none text-gray-600">
                        {product.description.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
                        ))}
                    </div>
                </div>

                {/* Ratings & Reviews */}
                <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-xl font-black text-gray-900">Ratings & Reviews</h2>
                    </div>
                    {reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review!</div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">by <span className="font-bold text-gray-700">{review.name}</span> <span className="text-green-500 ml-2">✓ Verified Purchase</span></p>
                                    <p className="text-gray-800">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">People Who Viewed This Item Also Viewed</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {relatedProducts.map((p) => (
                                <Link to={`/product/${p._id}`} key={p._id} className="bg-white p-3 rounded-xl hover:shadow-lg transition-shadow border border-gray-100 group">
                                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                                        <img src={p.images?.[0] || 'https://via.placeholder.com/150'} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                                    <p className="text-[#f57224] font-black mt-1">${(p.price * (1 - (p.discount||0)/100)).toFixed(2)}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
