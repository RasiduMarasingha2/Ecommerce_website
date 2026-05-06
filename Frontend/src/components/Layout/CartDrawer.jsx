
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";

const CartDrawer =({ drawerOpen, toggleCartDrawer }) => {
  
  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 
      h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 
      ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-end p-4">
      <button onClick={toggleCartDrawer}>
        <IoMdClose className="h-6 w-6 text-gray-500"/>
      </button>
      </div>
      {/*cart content with scroll bar area*/}
      <div className=" flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl  font-semibold mb-4">
               Your Cart
        </h2>
        <CartContents/>
      </div>
      {/*Checkout button fixed at the bottom */}
      <div className="p-4 bg-white sticky bottom-0">
        <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
          Checkout
        </button>
        <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
          Shipping,Taxes and Discount Codes Calculated at Checkout.
        </p>
      </div>
    </div>
  );
};


export default CartDrawer;
