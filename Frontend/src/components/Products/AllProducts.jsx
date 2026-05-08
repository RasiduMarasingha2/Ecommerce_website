

const AllProducts = () => {
  // Sample data for all products
  const allProducts = [
    {
      _id: "1",
      name: "Product 1",
      description: "High quality everyday product",
      price: 49.99,
      image: [{ url: "https://picsum.photos/500/500?random=11" }],
    },
    {
      _id: "2",
      name: "Product 2",
      description: "High quality everyday product",
      price: 59.99,
      image: [{ url: "https://picsum.photos/500/500?random=12" }],
    },
    {
      _id: "3",
      name: "Product 3",
      description: "High quality everyday product",
      price: 39.99,
      image: [{ url: "https://picsum.photos/500/500?random=13" }],
    },
    {
      _id: "4",
      name: "Product 4",
      description: "High quality everyday product",
      price: 29.99,
      image: [{ url: "https://picsum.photos/500/500?random=14" }],
    },
    {
      _id: "5",
      name: "Product 5",
      description: "High quality everyday product",
      price: 69.99,
      image: [{ url: "https://picsum.photos/500/500?random=15" }],
    },
    {
      _id: "6",
      name: "Product 6",
      description: "High quality everyday product",
      price: 79.99,
      image: [{ url: "https://picsum.photos/500/500?random=16" }],
    },
    {
      _id: "7",
      name: "Product 7",
      description: "High quality everyday product",
      price: 89.99,
      image: [{ url: "https://picsum.photos/500/500?random=17" }],
    },
    {
      _id: "8",
      name: "Product 8",
      description: "High quality everyday product",
      price: 99.99,
      image: [{ url: "https://picsum.photos/500/500?random=18" }],
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">All Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our entire collection to find exactly what you're looking for.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg p-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="overflow-hidden rounded-md">
                <img
                  src={product.image[0]?.url}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 font-semibold text-lg text-gray-800">
                {product.name}
              </h3>

              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <p className="font-bold text-lg">${product.price}</p>
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProducts;