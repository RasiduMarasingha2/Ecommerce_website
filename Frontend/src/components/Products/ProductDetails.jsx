import { useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";


const selectedProduct = {
  name: "Stylish Sneakers",
  price: 79.99,
  originalPrice: 150,
  description:
    "Experience the perfect blend of style and comfort with our Stylish Sneakers. Crafted with premium materials, these sneakers feature a sleek design that effortlessly complements any outfit.",
  brand: "FashionCo",
  material: "Leather",
  sizes: ["6 ", "7", "8", "9", "10"],
  colors: ["Black", "White", "Red"],
  image: [
    {
      url: "https://picsum.photos/500/500?random=1",
      altText: "Stylish Sneakers - Black",
    },
    {
      url: "https://picsum.photos/500/500?random=2",
      altText: "Stylish Sneakers - White",
    },
    {
      url: "https://picsum.photos/500/500?random=3",
      altText: "Stylish Sneakers - Red",
    },
  ],
};

const similarProducts = [
    {

      _id: "1",
      name: "Product 1",
      price: 49.99,
      image: [{ url: "https://picsum.photos/500/500?random=1" }],

    },
    {

      _id: "2",
      name: "Product 2",
      price: 49.99,
      image: [{ url: "https://picsum.photos/500/500?random=1" }],
    
    },
    {

      _id: "3",
      name: "Product 3",
      price: 49.99,
      image: [{ url: "https://picsum.photos/500/500?random=1" }],

    },

  ]

const ProductDetails = () => {

  const [mainImage, setMainImage] = useState(
    selectedProduct.image[0].url
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Quantity functions
  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
     toast.error("Please select size and color");
      return;
    }

    const cartItem = {
      product: selectedProduct.name,
      price: selectedProduct.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      total: (selectedProduct.price * quantity).toFixed(2),
    };

    console.log("Added to cart:", cartItem);
    toast.success("Product added to cart!");
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex flex-col md:flex-row">

          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.image.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={img.altText}
                onClick={() => setMainImage(img.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === img.url ? "border-black" : ""
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 md:ml-10 mt-6 md:mt-0">

            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              {selectedProduct.name}
            </h1>

            {/* Price */}
            <p className="text-lg text-gray-500 line-through">
              ${selectedProduct.originalPrice}
            </p>
            <p className="text-2xl font-bold text-black mb-2">
              ${selectedProduct.price}
            </p>

            {/* Description */}
            <p className="text-gray-600 mb-4">
              {selectedProduct.description}
            </p>

            {/* Colors */}
            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color ? "ring-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={decreaseQty}
                  className="px-3 py-1 border rounded hover:bg-gray-200"
                >
                  -
                </button>

                <span className="text-lg font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={increaseQty}
                  className="px-3 py-1 border rounded hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <p className="text-lg font-semibold mb-4">
              Total: ${(selectedProduct.price * quantity).toFixed(2)}
            </p>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              Add to Cart
            </button>

            <div className="mt-10 text-gray-700">
                  
               <h3 className="text-xl font-bold mb-4"> Product Details</h3>
               <table className="w-full text-left text-sm text-gray-600">
                       
                        <tbody>
                          <tr>
                                <td className="py-1">Brand</td>
                                <td className="py-1">{selectedProduct.brand}</td>
                          </tr>
                          <tr>
                                <td className="py-1">Material</td>
                                <td className="py-1">{selectedProduct.material}</td>
                          </tr>
                          </tbody>

               </table>
            </div>

          </div>
        </div>

        {/* Mobile Thumbnails */}
        <div className="md:hidden flex overflow-x-auto space-x-4 mt-6">
          {selectedProduct.image.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={img.altText}
              onClick={() => setMainImage(img.url)}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                mainImage === img.url ? "border-black" : ""
              }`}
            />
          ))}
        </div> 
          <div className="mt-20">
                       <h2 className=" text-2xl text-center font-medium mb-4">
                               
                               You may also like
                       </h2>
                       <ProductGrid products={similarProducts} />
          </div>

      </div>
    </div>
  );
};

export default ProductDetails;