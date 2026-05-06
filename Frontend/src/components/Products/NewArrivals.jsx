import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NewArrivals = () => {
  const scrollRef = useRef(null);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const newArrivals = [
    {
      _id: "1",
      name: "Product 1",
      description: "New arrival product",
      price: 49.99,
      image: [{ url: "https://picsum.photos/500/500?random=1" }],
    },
    {
      _id: "2",
      name: "Product 2",
      description: "New arrival product",
      price: 59.99,
      image: [{ url: "https://picsum.photos/500/500?random=2" }],
    },
    {
      _id: "3",
      name: "Product 3",
      description: "New arrival product",
      price: 39.99,
      image: [{ url: "https://picsum.photos/500/500?random=3" }],
    },
    {
      _id: "4",
      name: "Product 4",
      description: "New arrival product",
      price: 29.99,
      image: [{ url: "https://picsum.photos/500/500?random=4" }],
    },
    {
      _id: "5",
      name: "Product 5",
      description: "New arrival product",
      price: 69.99,
      image: [{ url: "https://picsum.photos/500/500?random=5" }],
    },
    {
      _id: "6",
      name: "Product 6",
      description: "New arrival product",
      price: 69.99,
      image: [{ url: "https://picsum.photos/500/500?random=5" }],
    },
    {
      _id: "7",
      name: "Product 7",
      description: "New arrival product",
      price: 69.99,
      image: [{ url: "https://picsum.photos/500/500?random=5" }],
    },
    {
      _id: "8",
      name: "Product 8",
      description: "New arrival product",
      price: 69.99,
      image: [{ url: "https://picsum.photos/500/500?random=5" }],
    },
    {
      _id: "9",
      name: "Product 9",
      description: "New arrival product",
      price: 69.99,
      image: [{ url: "https://picsum.photos/500/500?random=5" }],
    }
  ];

  // Drag Scroll Functions
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Button Scroll
  const scroll = (direction) => {
    const amount = 300;
    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -amount, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-10">
      {/* Header */}
      <div className="container mx-auto text-center mb-6 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Buttons */}
        <div className="absolute right-6 bottom-[-30px]  flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded  bg-white hover:bg-gray-100"
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="p-2 rounded  bg-white hover:bg-gray-100"
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scroll Area */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="container mx-auto flex space-x-6 overflow-x-auto px-4 cursor-grab active:cursor-grabbing"
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[250px] bg-white shadow-md rounded-lg p-3 flex-shrink-0"
          >
            <img
              src={product.image[0]?.url}
              alt={product.name}
              className="w-full h-60 object-cover rounded-md"
            />

            <h3 className="mt-3 font-semibold text-lg">
              {product.name}
            </h3>

            <p className="text-gray-500 text-sm">
              {product.description}
            </p>

            <p className="mt-2 font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;