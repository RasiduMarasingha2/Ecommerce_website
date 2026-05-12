import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'sonner';

const TiltCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please sign up to continue.");
      navigate('/register');
      return;
    }
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative w-72 h-96 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 p-4 cursor-pointer overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,128,0,0.2)]"
    >
      <Link to={`/product/${product.id}`} className="block h-full cursor-pointer">
        <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
              <span className="text-gray-400 font-bold">IMAGE PREVIEW</span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-black truncate">{product.title}</h3>
          <p className="text-[#008000] font-bold mt-1">${product.price}</p>
          
          <motion.button 
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-2.5 rounded-xl bg-black text-white font-medium hover:bg-[#008000] hover:shadow-[0_0_15px_rgba(0,128,0,0.4)] transition-all duration-300"
        >
            Add to Cart
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default TiltCard;
