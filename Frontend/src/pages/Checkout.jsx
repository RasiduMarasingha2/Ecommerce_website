import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'sonner';
import axiosClient from '../api/axiosClient';
import { FiMapPin, FiCreditCard, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Checkout = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [checkoutItems, setCheckoutItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    // Address State
    const [address, setAddress] = useState({
        street: userInfo?.address?.street || '',
        city: userInfo?.address?.city || '',
        state: userInfo?.address?.state || '',
        zip: userInfo?.address?.zip || '',
        country: userInfo?.address?.country || 'Sri Lanka'
    });

    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=/checkout');
        } else if (location.state?.cartItems) {
            setCheckoutItems(location.state.cartItems.map(item => ({
                product: item.id,
                name: item.title,
                image: item.image,
                price: item.price,
                qty: item.qty,
                seller: item.seller,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize
            })));
        } else if (location.state?.product) {
            // Single product Buy Now
            setCheckoutItems([{
                product: location.state.product._id,
                name: location.state.product.title,
                image: location.state.product.images[0],
                price: location.state.price,
                qty: location.state.qty,
                seller: location.state.product.seller,
                selectedColor: location.state.selectedColor,
                selectedSize: location.state.selectedSize
            }]);
        } else {
            // No items passed, redirect back
            toast.error("No items to checkout.");
            navigate('/');
        }
    }, [userInfo, location, navigate]);

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const itemsPrice = checkoutItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 5; // Example logic
    const taxPrice = 0; // Or calculate tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const placeOrderHandler = async () => {
        // Validate address
        if (!address.street || !address.city || !address.zip || !address.country) {
            toast.error("Please fill in all shipping address fields");
            return;
        }

        setLoading(true);
        try {
            // 1. Update user profile to save the address permanently
            const profileRes = await axiosClient.put('/users/profile', {
                address
            });
            dispatch(setCredentials(profileRes.data));

            // 2. Place Order
            const orderRes = await axiosClient.post('/orders', {
                orderItems: checkoutItems,
                shippingAddress: {
                    address: address.street,
                    city: address.city,
                    postalCode: address.zip,
                    country: address.country
                },
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            });

            toast.success("Order placed successfully!");
            setOrderComplete(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    if (!checkoutItems.length) return null;

    if (orderComplete) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-[#f4f4f6] flex items-center justify-center font-sans">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center max-w-md text-center border border-gray-100"
                >
                    <div className="w-24 h-24 bg-[#008000]/10 rounded-full flex items-center justify-center text-[#008000] mb-6">
                        <FiCheckCircle className="text-5xl" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">Order Complete!</h2>
                    <p className="text-gray-500 mb-8">Thank you for your purchase. Your order has been successfully placed.</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full bg-[#008000] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#005a00] transition-colors"
                    >
                        Continue Shopping
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#f4f4f6] font-sans">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Forms */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        
                        {/* Shipping Address Section */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#008000]">
                                    <FiMapPin className="text-xl" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Shipping Address</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Street Address</label>
                                    <input 
                                        type="text" 
                                        name="street"
                                        value={address.street}
                                        onChange={handleAddressChange}
                                        placeholder="House number and street name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#008000] focus:ring-1 focus:ring-[#008000] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City / Town</label>
                                    <input 
                                        type="text" 
                                        name="city"
                                        value={address.city}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#008000] focus:ring-1 focus:ring-[#008000] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State / Province</label>
                                    <input 
                                        type="text" 
                                        name="state"
                                        value={address.state}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#008000] focus:ring-1 focus:ring-[#008000] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Zip / Postal Code</label>
                                    <input 
                                        type="text" 
                                        name="zip"
                                        value={address.zip}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#008000] focus:ring-1 focus:ring-[#008000] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                                    <input 
                                        type="text" 
                                        name="country"
                                        value={address.country}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#008000] focus:ring-1 focus:ring-[#008000] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 flex items-center gap-2">
                                <FiCheckCircle className="text-[#008000]" />
                                This address will be saved to your profile for future purchases.
                            </p>
                        </div>

                        {/* Payment Method Section */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                    <FiCreditCard className="text-xl" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Select Payment Method</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Cash on Delivery */}
                                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-[#008000] bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Cash on Delivery' ? 'border-[#008000]' : 'border-gray-300'}`}>
                                            {paymentMethod === 'Cash on Delivery' && <div className="w-2.5 h-2.5 rounded-full bg-[#008000]" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500">Pay when you receive your order</p>
                                        </div>
                                    </div>
                                    <FiTruck className="text-2xl text-gray-400" />
                                </label>

                                {/* Credit Card */}
                                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Credit Card' ? 'border-[#008000] bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Credit Card' ? 'border-[#008000]' : 'border-gray-300'}`}>
                                            {paymentMethod === 'Credit Card' && <div className="w-2.5 h-2.5 rounded-full bg-[#008000]" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Credit / Debit Card</p>
                                            <p className="text-xs text-gray-500">Safe and secure payment</p>
                                        </div>
                                    </div>
                                    <FiCreditCard className="text-2xl text-gray-400" />
                                </label>
                                
                                {paymentMethod === 'Credit Card' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4 px-2">
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600 text-center">
                                            This is a mock implementation. No real card is needed.
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                {checkoutItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {item.selectedColor && <span>Color: {item.selectedColor} | </span>}
                                                {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-sm font-bold text-[#008000]">LKR {item.price.toFixed(2)}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-sm border-t pt-4 border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items Total</span>
                                    <span className="font-medium">LKR {itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Fee</span>
                                    <span className="font-medium">{shippingPrice === 0 ? 'Free' : `LKR ${shippingPrice.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Taxes</span>
                                    <span className="font-medium">LKR {taxPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                                <span className="font-black text-gray-800 text-lg">Total</span>
                                <span className="font-black text-[#008000] text-2xl">LKR {totalPrice.toFixed(2)}</span>
                            </div>

                            <button 
                                onClick={placeOrderHandler}
                                disabled={loading}
                                className="w-full mt-6 bg-[#008000] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#005a00] transition-colors shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
