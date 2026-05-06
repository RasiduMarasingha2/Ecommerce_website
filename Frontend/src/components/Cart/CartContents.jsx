function CartContents() {

  const cartProducts = [
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      price: 20,
      quantity: 2,
      imageUrl: "https://via.placeholder.com/150"
    },
     {
      productId: 2,
      name: "shirt",
      size: "L",
      color: "Blue",
      price: 22,
      quantity: 2,
      imageUrl: "https://via.placeholder.com/150"
    }
  ];

  return (
    <div>
      {cartProducts.map((product, index) => (
        <div
          key={index}
         className="flex items-start justify-between py-4 border-b border-gray-300"
        >

          {/* LEFT SIDE */}
          <div className="flex items-start">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />

            <div>
              <h3 className="font-medium">{product.name}</h3>

              <p className="text-gray-500 text-sm">
                Size: {product.size} | Color: {product.color}
              </p>

              <p className="text-gray-700 text-sm">
                ${product.price}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            Qty: {product.quantity}
          </div>

        </div>
      ))}
    </div>
  );
}

export default CartContents;